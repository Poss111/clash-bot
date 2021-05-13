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
                    players: dynamodb.types.stringSet()
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

    registerPlayer(playerName, serverName) {
        return new Promise((resolve, reject) => {
            this.getTeams(serverName).then((data) => {
                let teams = data;
                console.log(teams);
                let foundTeam = [];
                let availableTeams = [];
                teams.forEach(team => {
                    if (team.players) {
                        if (team.players.includes(playerName)) {
                            foundTeam.push(team);
                        }
                        if (team.players.length < 5) {
                            availableTeams.push(team);
                        }
                    } else {
                        availableTeams.push(team);
                    }
                });
                if (this.tentative.includes(playerName)) {
                    this.handleTentative(playerName).then((data) => {
                        if (data) console.log('Pulled off tentative');
                    });
                } if (teams.length === 0 || availableTeams.length < 1) {
                    console.log(`Creating new team for ${playerName} since there are no available teams.`);
                    foundTeam = this.createNewTeam(playerName, serverName, teams.length + 1);
                    resolve(foundTeam);
                } else if (foundTeam.length === 0) {
                    console.log(`Adding ${playerName} to first available team ${availableTeams[0].teamName}...`);
                    let params = {};
                    params.UpdateExpression = 'ADD players :playerName';
                    params.ExpressionAttributeValues = {
                        ':playerName': dynamodb.Set([playerName], 'S')
                    };
                    foundTeam = availableTeams[0];
                    this.Team.update({key: this.getKey(foundTeam.teamName, foundTeam.serverName)}, params, function (err, record) {
                        if (err) reject(err);
                        else {
                            console.log(`Added ${playerName} to ${record.attrs.teamName}.`);
                            resolve(record.attrs);
                        }
                    });
                } else {
                    foundTeam[0].exist = true;
                    resolve(foundTeam[0]);
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

    createNewTeam(playerName, serverName, number) {
        let name = names[number];
        let createTeam = {
            teamName: `Team ${name}`,
            serverName: serverName,
            players: [playerName]
        };
        createTeam.key = this.getKey(createTeam.teamName, serverName);
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

    getKey(teamName, serverName) {
        return `${teamName}#${serverName}`;
    }

    getTentative() {
        return JSON.parse(JSON.stringify(this.tentative));
    }
}

module.exports = new DynamoDBUtils;
