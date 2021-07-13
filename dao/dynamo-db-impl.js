const dynamodb = require('dynamodb');
const Joi = require('joi');
const names = require('../random-names');

class DynamoDBUtils {
    Team;
    tentative = [];

    constructor() {
    }

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
                    tournamentDay: Joi.string(),
                    startTime: Joi.string()
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

    buildTournamentToTeamsMap(playerName, teamsList) {
        let tournamentMap = new Map();
        teamsList.forEach(team => {
            let key = `${team.tournamentName}#${team.tournamentDay}`;
            let teamFound = tournamentMap.get(key);
            if (!teamFound) teamFound = {};

            if (team.players && team.players.includes(playerName)) teamFound.teamCurrentlyOn = team;

            else {
                if (Array.isArray(teamFound.availableTeams)) teamFound.availableTeams.push(team);
                else teamFound.availableTeams = [team];
            }

            tournamentMap.set(`${team.tournamentName}#${team.tournamentDay}`, teamFound);
        });
        return tournamentMap;
    }

    registerPlayer(playerName, serverName, tournaments, requestingNewTeam) {
        return new Promise((resolve, reject) => {
            this.getTeams(serverName).then((data) => {
                let teams = data;
                console.log(JSON.stringify(teams));
                if (requestingNewTeam) {
                    tournaments = tournaments.slice(0, 1);
                }
                const tournamentToTeamMap = this.buildTournamentToTeamsMap(playerName, data);
                console.log(`Number of Tournaments from Teams found => ('${tournamentToTeamMap.size}')`);
                let {teamToJoin, currentTeams, tournamentToUse, createNewTeam} = this.buildTeamLogic(tournaments, tournamentToTeamMap);
                console.log(`Requesting User ('${playerName}') Tournament To Use ('${JSON.stringify(tournamentToUse)}')`);
                console.log(`Requesting User ('${playerName}') Available Team ('${JSON.stringify(teamToJoin)}')`);
                console.log(`Requesting User ('${playerName}') Current Teams ('${JSON.stringify(currentTeams)}')`);
                console.log(`Requesting User ('${playerName}') Create new Team? ('${createNewTeam}')`);
                if (!requestingNewTeam
                    && currentTeams
                    && !teamToJoin
                    && !createNewTeam) {
                    currentTeams.forEach(record => record.exist = true);
                    resolve(currentTeams);
                } else {
                    this.removeIfExistingInTentative(playerName, serverName, tournamentToUse);

                    if (requestingNewTeam && currentTeams) {
                        let currentTeam = Array.isArray(currentTeams) ? currentTeams : [currentTeams];
                        this.unregisterPlayerWithSpecificTeam(playerName, currentTeam, serverName, tournaments);
                    }

                    let selectedTeam;
                    if (teamToJoin) {
                        if (requestingNewTeam && Array.isArray(teamToJoin.emptyTeams)) {
                            selectedTeam = teamToJoin.emptyTeams[0];
                        } else if (!createNewTeam) {
                            selectedTeam = teamToJoin.existingTeams && teamToJoin.existingTeams.length > 0 ?
                                teamToJoin.existingTeams[0] : teamToJoin.emptyTeams[0];
                        }
                    }

                    if (selectedTeam) {
                        console.log(`Adding ${playerName} to first available team ${selectedTeam.teamName}...`);
                        this.addUserToTeam(playerName, selectedTeam, reject, resolve);
                    } else {
                        let teamToReturn;
                        // If requesting Player is in a team by themselves. Do not create under any circumstance
                        if (Array.isArray(currentTeams)
                            && currentTeams[0]
                            && currentTeams[0].players.length === 1
                            && currentTeams[0].players.includes(playerName)) {
                            currentTeams[0].exist = true;
                            teamToReturn = currentTeams[0];
                        } else {
                            teamToReturn = this.createNewTeam(playerName, serverName, tournamentToUse, teams.length + 1)
                        }
                        resolve(teamToReturn);
                    }
                }
            });
        });
    }

    registerWithSpecificTeam(playerName, serverName, tournaments, teamName) {
        return new Promise((resolve, reject) => {
            this.getTeams(serverName).then((teams) => {
                let foundTeam = teams.find(team => team.tournamentName === tournaments[0].tournamentName
                    && team.tournamentDay === tournaments[0].tournamentDay
                    && team.teamName.includes(teamName));
                console.log(`Team to be assigned to : ('${JSON.stringify(foundTeam)}')...`);
                if (!foundTeam) {
                    resolve(foundTeam);
                }
                this.addUserToTeam(playerName, foundTeam, reject, resolve);
            }).catch(err => reject(err));
        })
    }

    addUserToTeam(playerName, foundTeam, reject, resolve) {
        let params = {};
        params.UpdateExpression = 'ADD players :playerName';
        params.ExpressionAttributeValues = {
            ':playerName': dynamodb.Set([playerName], 'S')
        };
        this.Team.update({
            key: this.getKey(foundTeam.teamName,
                foundTeam.serverName,
                foundTeam.tournamentName,
                foundTeam.tournamentDay)
        }, params, function (err, record) {
            if (err) reject(err);
            else {
                console.log(`Added ${playerName} to ${record.attrs.teamName}.`);
                resolve(record.attrs);
            }
        });
    }

    removeIfExistingInTentative(playerName, serverName, tournamentToUse) {
        if (this.tentative.some(record => record.playerName === playerName
            && record.serverName === serverName
            && record.tournamentName === tournamentToUse.tournamentName)) {
            this.handleTentative(playerName, serverName, tournamentToUse.tournamentName).then((data) => {
                if (data) console.log('Pulled off tentative');
            });
        }
    }

    buildTeamLogic(tournaments, tournamentToTeamMap) {
        let teamToJoin;
        let currentTeams = [];
        let createNewTeam = false;
        let tournamentToUse;
        for (let i = 0; i < tournaments.length; i++) {
            tournamentToUse = tournaments[i];
            let key = `${tournamentToUse.tournamentName}#${tournamentToUse.tournamentDay}`;
            let teamDetailsForTournament = tournamentToTeamMap.get(key);
            if (!teamDetailsForTournament) {
                createNewTeam = true;
                break;
            } else {
                if (teamDetailsForTournament.availableTeams && teamDetailsForTournament.availableTeams.length > 0) {
                    teamToJoin = {
                        existingTeams: teamDetailsForTournament.availableTeams.filter(team => team.players),
                        emptyTeams: teamDetailsForTournament.availableTeams.filter(team => !team.players)
                    };
                    currentTeams = teamDetailsForTournament.teamCurrentlyOn;
                    break;
                } else {
                    if (teamDetailsForTournament.teamCurrentlyOn)
                        currentTeams.push(teamDetailsForTournament.teamCurrentlyOn)
                }
            }
        }
        return {teamToJoin, currentTeams, tournamentToUse, createNewTeam};
    }

    deregisterPlayer(playerName, serverName, tournaments) {
        return new Promise((resolve, reject) => {
            this.getTeams(serverName).then((data) => {
                let filter = [];
                data.forEach(record => {
                    if (record.players && record.players.includes(playerName)
                        && tournaments.some(tournament => tournament.tournamentName === record.tournamentName
                            && tournament.tournamentDay === record.tournamentDay)) {
                        filter.push(record);
                    }
                });
                if (filter.length > 0) {
                    this.unregisterPlayerWithSpecificTeam(playerName, filter, serverName, reject);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    unregisterPlayerWithSpecificTeam(playerName, teamsToBeRemovedFrom, serverName, callback) {
        console.log(`Unregistering ${playerName} from teams ('${teamsToBeRemovedFrom.map(team => team.teamName)}')...`);
        teamsToBeRemovedFrom.forEach(record => {
            console.log(`Unregistering ${playerName} from team ('${record.teamName}')...`);
            let params = {};
            params.UpdateExpression = 'DELETE players :playerName';
            params.ConditionExpression = 'teamName = :nameOfTeam';
            params.ExpressionAttributeValues = {
                ':playerName': dynamodb.Set([playerName], 'S'),
                ':nameOfTeam': record.teamName,
            };
            this.Team.update({
                    key: this.getKey(record.teamName,
                        serverName,
                        record.tournamentName,
                        record.tournamentDay)
                },
                params,
                function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log(`Successfully unregistered ('${playerName}') from ('${record.teamName}').`);
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
        console.log(`Creating new team for ${playerName} and Tournament ${tournament.tournamentName} and Day ${tournament.tournamentDay} since there are no available teams.`);
        let name = names[number];
        let createTeam = {
            teamName: `Team ${name}`,
            serverName: serverName,
            players: [playerName],
            tournamentName: tournament.tournamentName,
            tournamentDay: tournament.tournamentDay,
            startTime: tournament.startTime
        };
        createTeam.key = this.getKey(createTeam.teamName, serverName, tournament.tournamentName, tournament.tournamentDay);
        this.Team.update(createTeam, function (err) {
            if (err) console.error('Failed to create due to error.', err);
        });
        return createTeam;
    }

    handleTentative(playerName, serverName, tournamentName) {
        return new Promise((resolve, reject) => {
            const index = this.tentative.findIndex((record) => record.playerName === playerName
                && record.serverName === serverName
                && record.tournamentName === tournamentName);
            if (index >= 0) {
                this.tentative.splice(index, 1);
                resolve(true);
            } else {
                const tournamentsToDeregister = [{
                    tournamentName: tournamentName,
                    tournamentDay: '1'
                },
                    {
                        tournamentName: tournamentName,
                        tournamentDay: '2'
                    },
                    {
                        tournamentName: tournamentName,
                        tournamentDay: '3'
                    },
                    {
                        tournamentName: tournamentName,
                        tournamentDay: '4'
                    }];
                this.deregisterPlayer(playerName, serverName, tournamentsToDeregister)
                    .then(() => {
                        this.tentative.push({
                            playerName: playerName,
                            serverName: serverName,
                            tournamentName: tournamentName
                        });
                        resolve(false);
                    })
                    .catch(err => reject(err));
            }
        });
    }

    removeFromTentative(playerName, serverName, tournamentName) {
        const index = this.tentative.findIndex((record) => record.playerName === playerName
            && record.serverName === serverName
            && record.tournamentName === tournamentName);
        if (index >= 0) {
            this.tentative.splice(index, 1);
        }
    }

    getKey(teamName, serverName, tournamentName, tournamentDay) {
        return `${teamName}#${serverName}#${tournamentName}#${tournamentDay}`;
    }

    getTentative(serverName) {
        return JSON.parse(JSON.stringify(this.tentative)).filter(data => data.serverName === serverName);
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
                }
            }
        }
    }

    filterAvailableTournaments(tournaments, playerName, teams) {
        if (teams && teams.length > 0) {
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
