const dynamodb = require('dynamodb');
const Joi = require('joi');

class DyanmoDBUtils {
    ClashTeam;

    constructor() {
        this.init();
    }

    init() {
        dynamodb.AWS.config.loadFromPath('credentials.json');
        dynamodb.createTables({
            'ClashTeam': {readCapacity: 5, writeCapacity: 10}
        }, function (err) {
            if (err) {
                console.error('Error creating tables: ', err);
            } else {
                console.log('Successfully created table.');
            }
        });
        this.ClashTeam = dynamodb.define('ClashTeams', {
            hashKey: 'name',
            schema: {
                name: Joi.string(),
                players: dynamodb.types.stringSet(),
                clashDate: Joi.date(),
            }
        });
    }

    async registerPlayer(playerName) {
        let teams = await this.getTeams();
        console.log(teams);
        let team = teams.filter(team => team.players.includes(playerName));
        if (team.length === 0) {
            let availableTeams = teams.filter(team => team.players.length < 5);
            let params = {};
            params.UpdateExpression = 'ADD players :playerName';
            params.ConditionExpression = 'size(players) < :size AND NOT contains(players, :playerName)';
            params.ExpressionAttributeValues = {
                ':playerName': dynamodb.documentClient().createSet(playerName),
                ':size': 6
            };
            if (availableTeams.length !== 0) {
                let chosenTeam = availableTeams[0];
                this.ClashTeam.update({name: chosenTeam.name}, params, function (err, data) {
                    if (err) console.error('Failed to update team with user. ', err)
                });
            } else {
                console.log(`Creating new team for ${playerName} since there are no available teams.`)
                team = this.createNewTeam(playerName, teams.length + 1);
            }
        } else {
            team.exist = true;
        }
        return team;
    }

    deregisterPlayer(playerName) {
        let params = {};
        params.UpdateExpression = 'SET players REMOVE :playerName';
        params.ConditionExpression = 'contains(players, :playerName)';
        params.ExpressionAttributeValues = {
            ':playerName': playerName,
        }
    }

    getTeams() {
        return new Promise((resolve, reject) => {
            let teams = [];
            let callback = this.ClashTeam.scan().loadAll().exec();
            callback.on('readable', function () {
                let read = callback.read();
                if (read) {
                    read.Items.forEach((data) => {
                        teams.push(data.attrs)
                    })
                }
            });
            callback.on('end', function () {
                resolve(teams);
            });
        });
    }

    createNewTeam(playerName, number) {
        let createTeam = {
            name: `Team ${number}`,
            players: [playerName],
            clashDate: new Date(),
        };
        this.ClashTeam.create(createTeam);
        return createTeam;
    }
}

module.exports = new DyanmoDBUtils();
