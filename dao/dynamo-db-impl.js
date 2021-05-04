const dynamodb = require('dynamodb');
const Joi = require('joi');
const names = require('../random-names');

class DynamoDBUtils {
    Team;
    tentative = [];

    constructor() {
    }

    initializeClashBotDB() {
        return new Promise((resolve, reject) => {
            dynamodb.AWS.config.loadFromPath('./credentials.json');
            this.Team = dynamodb.define('NewTeam', {
                hashKey: 'key',
                timestamps: true,
                schema: {
                    key: Joi.string(),
                    teamName: Joi.string(),
                    serverName: Joi.string(),
                    players: dynamodb.types.stringSet()
                }
            });
            dynamodb.createTables(function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve('Successfully initialized Database.');
                }
            });
        })
    }

    registerPlayer(playerName, serverName) {
        return new Promise((resolve, reject) => {
            this.getTeams(serverName).then((data) => {
                let teams = data;
                console.log(teams);
                let foundTeam = teams.filter(team => team.players.includes(playerName));
                let availableTeams = teams.filter(team => team.players.length < 5);
                this.handleTentative(playerName).then((data) => {
                    if (data) console.log('Pulled off tentative');
                });
                if (teams.length === 0 || availableTeams.length < 1) {
                    console.log(`Creating new team for ${playerName} since there are no available teams.`);
                    foundTeam = this.createNewTeam(playerName, serverName, teams.length + 1);
                } else if (foundTeam.length === 0) {
                    console.log(`Adding ${playerName} to first available team ${availableTeams[0].teamName}...`);
                    let params = {};
                    params.UpdateExpression = 'ADD players :playerName';
                    params.ConditionExpression = 'teamName = :nameOfTeam';
                    params.ExpressionAttributeValues = {
                        ':playerName': dynamodb.documentClient().createSet(playerName),
                        ':nameOfTeam': availableTeams[0].teamName,
                    };
                    foundTeam = availableTeams[0];
                    this.Team.update({key: this.getKey(foundTeam.teamName, foundTeam.serverName)}, params, function (err, data) {
                        if (err) reject(err);
                    });
                    console.log(`Added.`);
                } else {
                    foundTeam.exist = true;
                }
                resolve(foundTeam);
            });
        });
    }

    deregisterPlayer(playerName, serverName) {
        return new Promise((resolve, reject) => {
            this.getTeams(serverName).then((data) => {
                const filter = data.filter(record => record.players.includes(playerName));
                if (filter.length !== 0) {
                    console.log(`Unregistering ${playerName} from team ${filter[0].teamName}...`);
                    const playersLeft = filter[0].players.filter(player => player !== playerName);
                    this.Team.update({key: this.getKey(filter[0].teamName, serverName), players: playersLeft}, function(err, data) {
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
            let callback = this.Team.scan().where("serverName").equals(serverName).exec();
            callback.on('readable', function () {
                let read = callback.read();
                if (read) {
                    read.Items.forEach((data) => {
                        teams.push(data.attrs)
                    });
                }
            });
            callback.on('end', function () {
                resolve(teams);
            });
            callback.on('error', (err) => reject(err));
        });
    }

    createNewTeam(playerName, serverName, number) {
        let name = names[number];
        let createTeam = {
            teamName: `Team ${name}`,
            serverName: serverName,
            players: [playerName]
        };
        createTeam.key = this.getKey(createTeam.teamName, serverName);
        this.Team.update(createTeam, function(err, data) {
            if (err) console.error('Failed to create due to error.', err);
        });
        return createTeam;
    }

    handleTentative(playerName) {
        return new Promise((resolve, reject) => {
            const filteredTentativeList = this.tentative.filter((name) => name !== playerName);
            if (filteredTentativeList.length < this.tentative.length) {
                this.tentative = filteredTentativeList;
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    getKey(teamName, serverName) {
        return `${teamName}#${serverName}`;
    }

    getTentative() {
        return this.tentative;
    }
}

module.exports = new DynamoDBUtils;
