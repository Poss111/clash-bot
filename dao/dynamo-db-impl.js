const dynamodb = require('dynamodb');
const Joi = require('joi');
const names = require('../random-names');

class DynamoDBUtils {
    Team;
    tentative = [];

    constructor() {}

    initializeClashBotDB() {
        let tableName = 'ClashTeam';
        return new Promise((resolve, reject) => {
            if (process.env.LOCAL) {
                console.log('Loading credentials from local.');
                dynamodb.AWS.config.loadFromPath('./credentials.json');
                tableName = `${tableName}-local`;
            } else {
                console.log('Loading credentials from remote.');
                dynamodb.AWS.config.update({
                    accessKeyId: `${process.env.ACCESS_ID}`,
                    secretAccessKey: `${process.env.ACCESS_KEY}`,
                    region: `${process.env.REGION}`
                });
            }
            this.Team = dynamodb.define(tableName, {
                hashKey: 'key',
                timestamps: true,
                schema: {
                    key: Joi.string(),
                    teamName: Joi.string(),
                    serverName: Joi.string(),
                    players: dynamodb.types.stringSet(),
                    tournamentName: Joi.string(),
                    tournamentDay: Joi.string()
                }
            });
            const dbCallback = (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve('Successfully initialized Database.');
                }
            };
            dynamodb.createTables(dbCallback);
        })
    }

    registerPlayer(playerName, serverName, tournaments) {
        return new Promise((resolve, reject) => {
            this.getTeams(serverName).then((data) => {
                let teams = data;
                console.log(JSON.stringify(teams));
                let teamJoined = [];
                const playerAvailableTournaments = this.filterAvailableTournaments(tournaments, playerName, teams);
                let availableTeam = this.findFirstAvailableTeam(playerName, tournaments, teams);
                if (Array.isArray(playerAvailableTournaments) && !playerAvailableTournaments.length) {
                    resolve(availableTeam);
                } if (this.tentative.includes(playerName)) {
                    this.handleTentative(playerName).then((data) => {
                        if (data) console.log('Pulled off tentative');
                    });
                } if (!availableTeam) {
                    console.log(`Creating new team for ${playerName} and Tournament ${playerAvailableTournaments[0].tournamentName} and Day ${playerAvailableTournaments[0].tournamentDay} since there are no available teams.`);
                    teamJoined = this.createNewTeam(playerName, serverName, playerAvailableTournaments[0], teams.length + 1);
                    resolve(teamJoined);
                } else if (!Array.isArray(availableTeam)) {
                    console.log(`Adding ${playerName} to first available team ${availableTeam.teamName}...`);
                    let params = {};
                    params.UpdateExpression = 'ADD players :playerName';
                    params.ExpressionAttributeValues = {
                        ':playerName': dynamodb.Set([playerName], 'S')
                    };
                    this.Team.update({key: this.getKey(availableTeam.teamName,
                            availableTeam.serverName,
                            availableTeam.tournamentName,
                            availableTeam.tournamentDay)}, params, function (err, record) {
                        if (err) reject(err);
                        else {
                            console.log(`Added ${playerName} to ${record.attrs.teamName}.`);
                            resolve(record.attrs);
                        }
                    });
                }
            });
        });
    }

    deregisterPlayer(playerName, serverName) {
        return new Promise((resolve, reject) => {
            this.getTeams(serverName).then((data) => {
                let filter = [];
                data.forEach(record => {
                    if (record.players && record.players.includes(playerName)) {
                        filter.push(record);
                    }
                });
                if (filter.length > 0) {
                    console.log(`Unregistering ${playerName} from team ${filter[0].teamName}...`);
                    let params = {};
                    params.UpdateExpression = 'DELETE players :playerName';
                    params.ConditionExpression = 'teamName = :nameOfTeam';
                    params.ExpressionAttributeValues = {
                        ':playerName': dynamodb.documentClient().createSet(playerName),
                        ':nameOfTeam': filter[0].teamName,
                    };
                    this.Team.update({key: this.getKey(filter[0].teamName, serverName)}, params, function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(true);
                        }
                    });
                } else {
                    resolve(false);
                }
            });
        });
    }

    getTeams(serverName) {
        return new Promise((resolve, reject) => {
            let teams = [];
            let stream = this.Team.scan()
                .filterExpression('#serverName = :name')
                .expressionAttributeValues({':name': `${serverName}`})
                .expressionAttributeNames({'#serverName': 'serverName'})
                .exec();
            stream.on('readable', function () {
                let read = stream.read();
                if (read) {
                    read.Items.forEach((data) => {
                        teams.push(data.attrs)
                    });
                }
            });
            stream.on('end', function () {
                resolve(teams);
            });
            stream.on('error', (err) => reject(err));
        });
    }

    createNewTeam(playerName, serverName, tournament, number) {
        let name = names[number];
        let createTeam = {
            teamName: `Team ${name}`,
            serverName: serverName,
            players: [playerName],
            tournamentName: tournament.tournamentName,
            tournamentDay: tournament.tournamentDay
        };
        createTeam.key = this.getKey(createTeam.teamName, serverName, tournament.tournamentName, tournament.tournamentDay);
        this.Team.update(createTeam, function (err) {
            if (err) console.error('Failed to create due to error.', err);
        });
        return createTeam;
    }

    handleTentative(playerName, serverName) {
        return new Promise((resolve, reject) => {
            const filteredTentativeList = this.tentative.filter((name) => name !== playerName);
            if (filteredTentativeList.length < this.tentative.length) {
                this.tentative = filteredTentativeList;
                resolve(true);
            } else {
                this.deregisterPlayer(playerName, serverName)
                    .then(() => {
                        this.tentative.push(playerName);
                        resolve(false);
                    })
                    .catch(err => reject(err));
            }
        });
    }

    getKey(teamName, serverName, tournamentName, tournamentDay) {
        return `${teamName}#${serverName}#${tournamentName}#${tournamentDay}`;
    }

    getTentative() {
        return JSON.parse(JSON.stringify(this.tentative));
    }

    findFirstAvailableTeam(playerName, tournaments, teams) {
        if (teams && teams.length > 0) {
            const tournamentTeams = teams.filter(data =>
                tournaments.some(record =>
                    record.tournamentName === data.tournamentName && record.tournamentDay === data.tournamentDay));
            let i;
            for (i = 0; i < tournamentTeams.length; i++) {
                if (!tournamentTeams[i].players
                    || (tournamentTeams[i].players
                        && tournamentTeams[i].players.length < 5
                        && !tournamentTeams[i].players.includes(playerName))) {
                    return tournamentTeams[i];
                } else {
                    tournamentTeams[i].exist = true;
                }
            }
            return tournamentTeams;
        }
    }

    filterAvailableTournaments(tournaments, playerName, teams) {
        if(teams && teams.length > 0) {
            let availableTournaments = [];
            let tournamentToPlayersMap = new Map();
            teams.forEach((team) => {
               if (team.players) {
                   let key = `${team.tournamentName}#${team.tournamentDay}`;
                   if (tournamentToPlayersMap.get(key)) {
                       tournamentToPlayersMap.get(key).push(...team.players);
                   } else {
                       tournamentToPlayersMap.set(key, team.players);
                   }
               }
            });
            tournaments.forEach((tournament) => {
                const players = tournamentToPlayersMap.get(`${tournament.tournamentName}#${tournament.tournamentDay}`);
                if (!players || !players.includes(playerName)) {
                    availableTournaments.push(tournament);
                }
            });
            return availableTournaments;
        }
        return tournaments;
    }
}

module.exports = new DynamoDBUtils;
