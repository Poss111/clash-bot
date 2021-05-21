const dynamoDBUtils = require('../dynamo-db-impl');
const dynamodb = require('dynamodb');
const streamTest = require('streamtest');
const randomNames = require('../../random-names');

jest.mock('dynamodb');

beforeEach(() => {
    jest.resetModules();
    delete process.env.LOCAL;
});

describe('Initialize Database connection and tables', () => {
    test('Initialize should create the table and establish the model definition of the teams if not local.', () => {
        dynamodb.AWS.config.update = jest.fn();
        dynamodb.define = jest.fn();
        dynamodb.createTables.mockImplementation((callback) => callback());
        return dynamoDBUtils.initializeClashBotDB().then((data) => {
                expect(data).toEqual('Successfully initialized Database.');
            expect(dynamodb.AWS.config.loadFromPath.mock.calls.length).toEqual(0);
                expect(dynamodb.AWS.config.update.mock.calls.length).toEqual(1);
                expect(dynamodb.define.mock.calls.length).toEqual(1);
            }
        )
    })

    test('Initialize should create the table and establish the model definition of the teams using the credentials.json if local.', () => {
        dynamodb.AWS.config.loadFromPath = jest.fn();
        dynamodb.AWS.config.update = jest.fn();
        dynamodb.define = jest.fn();
        dynamodb.createTables.mockImplementation((callback) => callback());
        process.env.LOCAL = true;
        return dynamoDBUtils.initializeClashBotDB().then((data) => {
                expect(data).toEqual('Successfully initialized Database.');
                expect(dynamodb.AWS.config.loadFromPath.mock.calls.length).toEqual(1);
                expect(dynamodb.AWS.config.update.mock.calls.length).toEqual(0);
                expect(dynamodb.define.mock.calls.length).toEqual(1);
            }
        )
    })

    test('Initialize should return error if the createTables call callback returns with an error.', () => {
        dynamodb.AWS.config.loadFromPath = jest.fn();
        dynamodb.AWS.config.update = jest.fn();
        dynamodb.define = jest.fn();
        const sampleError = 'Failed to create table.'
        dynamodb.createTables.mockImplementation((callback) => callback(sampleError));
        process.env.LOCAL = true;
        return dynamoDBUtils.initializeClashBotDB().then(() => {}).catch((err) => expect(err).toEqual(sampleError))
    })
})

describe('Retrieve Teams', () => {

    test('I should retrieve all teams for a server when getTeams is called with a single team.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Sample Team',
                    serverName: 'Sample Server',
                    players: ['Player1', 'Player2'],
                    tournamentName: 'msi2021',
                    tournamentDay: 'day_2'
                }
            }
            ]
        };
        const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromObjects([value]));
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.Team = {
            scan: jest.fn().mockReturnThis(),
            filterExpression: jest.fn().mockReturnThis(),
            expressionAttributeValues: jest.fn().mockReturnThis(),
            expressionAttributeNames: jest.fn().mockReturnThis(),
            exec: mockStream
        }

        return dynamoDBUtils.getTeams('Sample Server').then((data) => {
            expect(data).toEqual([value.Items[0].attrs]);
        });
    })

    test('I should retrieve all teams for a server when getTeams is called with multiple teams.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Sample Team',
                    serverName: 'Sample Server',
                    players: ['Player1', 'Player2'],
                    tournamentName: 'msi2021',
                    tournamentDay: 'day_2'
                }
            },
                {
                    attrs: {
                        key: 'Sample Team2#Sample Server',
                        teamName: 'Sample Team2',
                        serverName: 'Sample Server',
                        players: ['Player3', 'Player4'],
                        tournamentName: 'msi2021',
                        tournamentDay: 'day_2'
                    }
                }
            ]
        };
        const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromObjects([value]));
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.Team = {
            scan: jest.fn().mockReturnThis(),
            filterExpression: jest.fn().mockReturnThis(),
            expressionAttributeValues: jest.fn().mockReturnThis(),
            expressionAttributeNames: jest.fn().mockReturnThis(),
            exec: mockStream
        }

        return dynamoDBUtils.getTeams('Sample Server').then((data) => {
            expect(data).toEqual([value.Items[0].attrs, value.Items[1].attrs]);
        });
    })
})

describe('Register Player', () => {

    test('I should return an error with getTeams if I receive an error from the stream.', () => {
        const value = {
            error: 'Failed to retrieve.'
        };
        const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromErroredObjects([value]));
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.Team = {
            scan: jest.fn().mockReturnThis(),
            filterExpression: jest.fn().mockReturnThis(),
            expressionAttributeValues: jest.fn().mockReturnThis(),
            expressionAttributeNames: jest.fn().mockReturnThis(),
            exec: mockStream
        }

        return dynamoDBUtils.getTeams('Sample Server').then(() => {})
            .catch((err) => expect(err).toEqual([value]));
    })

    test('I should register a player and add him to a Team with the specified tournament and day if a teams exist with less than 4 players.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: ['Player1', 'Player2'],
                    tournamentName: 'msi2021',
                    tournamentDay: 'day_2'
                }
            }, {
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: undefined,
                    tournamentName: 'msi2021',
                    tournamentDay: 'day_3'
                }
            }
            ]
        };
        const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromObjects([value]));
        let expectedPlayers = [];
        const expectedPlayerName = 'Player3';
        expectedPlayers.push(expectedPlayerName);
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.Team.update = jest.fn();
        dynamoDBUtils.Team = {
            scan: jest.fn().mockReturnThis(),
            filterExpression: jest.fn().mockReturnThis(),
            expressionAttributeValues: jest.fn().mockReturnThis(),
            expressionAttributeNames: jest.fn().mockReturnThis(),
            exec: mockStream,
            update: jest.fn().mockImplementation((key, params, callback) => {
                callback(undefined, {
                    attrs: {
                        key: 'Sample Team#Sample Server',
                        teamName: 'Team Sample',
                        serverName: 'Sample Server',
                        players: expectedPlayers
                    }
                });
            })
        }
        dynamodb.Set = jest.fn().mockReturnValue(expectedPlayers);

        let foundTeam = value.Items[1].attrs;
        let key = dynamoDBUtils.getKey(foundTeam.teamName, foundTeam.serverName, foundTeam.tournamentName, foundTeam.tournamentDay);
        let tournament = [{ tournamentName: 'msi2021', tournamentDay: 'day_3'}];
        return dynamoDBUtils.registerPlayer(expectedPlayerName, 'Sample Server', tournament).then(result => {
            expect(result).toBeTruthy();
            expect(result.teamName).toEqual(value.Items[0].attrs.teamName);
            expect(result.players.length).toEqual(1);
            expect(result.players).toContain(expectedPlayerName);
            expect(dynamoDBUtils.Team.update.mock.calls.length).toEqual(1);
            expect(dynamoDBUtils.Team.update).toBeCalledWith({key: key}, {
                ExpressionAttributeValues: {
                    ':playerName': expectedPlayers
                },
                UpdateExpression: 'ADD players :playerName'
            }, expect.any(Function));
        });
    })

    test('I should register a player and create a new Team if another tournament to register is available.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: ['Player1', 'Player2'],
                    tournamentName: 'msi2021',
                    tournamentDay: 'day_2'
                }
            }
            ]
        };
        const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromObjects([value]));
        let expectedPlayers = [];
        const expectedPlayerName = 'Player2';
        expectedPlayers.push(expectedPlayerName);
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.Team.update = jest.fn();
        dynamoDBUtils.Team = {
            scan: jest.fn().mockReturnThis(),
            filterExpression: jest.fn().mockReturnThis(),
            expressionAttributeValues: jest.fn().mockReturnThis(),
            expressionAttributeNames: jest.fn().mockReturnThis(),
            exec: mockStream,
            update: jest.fn().mockImplementation((team, callback) => {
                callback(undefined, {
                    attrs: {
                        key: 'Sample Team#Sample Server',
                        teamName: 'Team Sample',
                        serverName: 'Sample Server',
                        players: expectedPlayers
                    }
                });
            })
        }
        dynamodb.Set = jest.fn().mockReturnValue(expectedPlayers);

        let foundTeam = value.Items[0].attrs;
        let key = dynamoDBUtils.getKey('Team Absol', foundTeam.serverName, 'msi2021', 'day_3');
        let expectedCreatedTeam = {
            key: key,
            teamName: 'Team Absol',
            serverName: 'Sample Server',
            players: expectedPlayers,
            tournamentName: 'msi2021',
            tournamentDay: 'day_3'
        }
        let tournament = [{
            tournamentName: 'msi2021',
            tournamentDay: 'day_2'
        },
            {
                tournamentName: 'msi2021',
                tournamentDay: 'day_3'
            }];
        return dynamoDBUtils.registerPlayer(expectedPlayerName, 'Sample Server', tournament).then(result => {
            expect(result).toBeTruthy();
            expect(result.teamName).toEqual('Team Absol');
            expect(result.players.length).toEqual(1);
            expect(result.players).toContain(expectedPlayerName);
            expect(dynamoDBUtils.Team.update.mock.calls.length).toEqual(1);
            expect(dynamoDBUtils.Team.update).toBeCalledWith(expectedCreatedTeam, expect.any(Function));
        });
    })

    test('I should register a player and add him to a Team if a teams exist with less than 4 players and remove him from tentative if he is on it.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: ['Player1', 'Player2'],
                    tournamentName: 'msi2021',
                    tournamentDay: 'day_3'
                }
            }
            ]
        };
        const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromObjects([value]));
        let expectedPlayers = [];
        expectedPlayers.push(value.Items[0].attrs.players[0]);
        expectedPlayers.push(value.Items[0].attrs.players[1]);
        expectedPlayers.push('Player3');
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.tentative.push('Player3');
        dynamoDBUtils.Team.update = jest.fn();
        dynamoDBUtils.Team = {
            scan: jest.fn().mockReturnThis(),
            filterExpression: jest.fn().mockReturnThis(),
            expressionAttributeValues: jest.fn().mockReturnThis(),
            expressionAttributeNames: jest.fn().mockReturnThis(),
            exec: mockStream,
            update: jest.fn().mockImplementation((key, params, callback) => {
                callback(undefined, {
                    attrs: {
                        key: 'Sample Team#Sample Server',
                        teamName: 'Team Sample',
                        serverName: 'Sample Server',
                        players: expectedPlayers
                    }
                });
            })
        }
        dynamodb.Set = jest.fn().mockReturnValue(expectedPlayers);

        let foundTeam = value.Items[0].attrs;
        let key = dynamoDBUtils.getKey(foundTeam.teamName, foundTeam.serverName, foundTeam.tournamentName, foundTeam.tournamentDay);
        let tournament = [{ tournamentName: 'msi2021', tournamentDay: 'day_3'}];
        return dynamoDBUtils.registerPlayer('Player3', 'Sample Server', tournament).then(result => {
            expect(result).toBeTruthy();
            expect(result.teamName).toEqual(value.Items[0].attrs.teamName);
            expect(result.players.length).toEqual(3);
            expect(result.players).toContain('Player3');
            expect(dynamoDBUtils.tentative.length).toEqual(0);
            expect(dynamoDBUtils.Team.update).toBeCalledWith({key: key}, {
                ExpressionAttributeValues: {
                    ':playerName': expectedPlayers
                },
                UpdateExpression: 'ADD players :playerName'
            }, expect.any(Function));
        });
    })

    test('I should not register a player that already exists in a team', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: ['Player1', 'Player2'],
                    tournamentName: 'msi2021',
                    tournamentDay: 'day_3'
                }
            }
            ]
        };
        const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromObjects([value]));
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.Team.update = jest.fn();
        dynamoDBUtils.Team = {
            scan: jest.fn().mockReturnThis(),
            filterExpression: jest.fn().mockReturnThis(),
            expressionAttributeValues: jest.fn().mockReturnThis(),
            expressionAttributeNames: jest.fn().mockReturnThis(),
            exec: mockStream
        }

        let tournament = [{ tournamentName: 'msi2021', tournamentDay: 'day_3'}];
        return dynamoDBUtils.registerPlayer('Player2', 'Sample Server', tournament).then(result => {
            expect(result).toBeTruthy();
            expect(result[0].exist).toBeTruthy();
            expect(result[0].teamName).toEqual(value.Items[0].attrs.teamName);
            expect(result[0].players.length).toEqual(2);
            expect(result[0].players).toContain('Player2');
        });
    })

    test('I should register a player into the team if the players property is undefined', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    tournamentName: 'msi2021',
                    tournamentDay: 'day_3'
                }
            }
            ]
        };
        const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromObjects([value]));
        let expectedPlayers = [];
        expectedPlayers.push('Player1');
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.Team.update = jest.fn();
        dynamoDBUtils.Team = {
            scan: jest.fn().mockReturnThis(),
            filterExpression: jest.fn().mockReturnThis(),
            expressionAttributeValues: jest.fn().mockReturnThis(),
            expressionAttributeNames: jest.fn().mockReturnThis(),
            exec: mockStream,
            update: jest.fn().mockImplementation((key, params, callback) => {
                callback(undefined, {
                    attrs: {
                        key: 'Sample Team#Sample Server',
                        teamName: 'Team Sample',
                        serverName: 'Sample Server',
                        players: expectedPlayers
                    }
                });
            })
        }

        let tournament = [{ tournamentName: 'msi2021', tournamentDay: 'day_3'}];
        return dynamoDBUtils.registerPlayer('Player2', 'Sample Server', tournament).then(result => {
            expect(result).toBeTruthy();
            expect(result.teamName).toEqual(value.Items[0].attrs.teamName);
            expect(result.players.length).toEqual(1);
            expect(result.players).toContain('Player1');
        });
    })

    test('I should register a player and create a new Team if no teams exist.', () => {
        const value = {
            Items: []
        };
        const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromObjects([value]));
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.Team.update = jest.fn();
        dynamoDBUtils.Team = {
            scan: jest.fn().mockReturnThis(),
            filterExpression: jest.fn().mockReturnThis(),
            expressionAttributeValues: jest.fn().mockReturnThis(),
            expressionAttributeNames: jest.fn().mockReturnThis(),
            exec: mockStream,
            update: jest.fn()
        }

        let tournament = [{ tournamentName: 'msi2021', tournamentDay: 'day_3'}];
        return dynamoDBUtils.registerPlayer('Player1', 'Sample Server', tournament).then(result => {
            expect(result).toBeTruthy();
            expect(result.teamName).toEqual(`Team ${randomNames[1]}`);
            expect(result.players).toEqual(['Player1']);
            expect(dynamoDBUtils.Team.update.mock.calls.length).toEqual(1);
        });
    })
})

describe('Unregister Player', () =>{
    test('I should remove a player from a team if unregister is called and they exist on a team.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: ['Player1']
                }
            }
            ]
        };
        const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromObjects([value]));
        dynamodb.documentClient = (() => {
            return {
                documentClient: () => jest.fn().mockReturnThis(),
                createSet: () => jest.fn().mockReturnThis()
            }
        });
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.Team.update = jest.fn();
        dynamoDBUtils.Team = {
            scan: jest.fn().mockReturnThis(),
            filterExpression: jest.fn().mockReturnThis(),
            expressionAttributeValues: jest.fn().mockReturnThis(),
            expressionAttributeNames: jest.fn().mockReturnThis(),
            exec: mockStream,
            update: jest.fn().mockImplementation((key, params, callback) => {
                callback();
            })
        }

        return dynamoDBUtils.deregisterPlayer('Player1', 'Sample Server').then((data) => {
            expect(data).toBeTruthy();
        })
    })

    test('I should not remove a player from a team if unregister is called and they do not exist on a team.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: ['Player1']
                }
            }
            ]
        };
        const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromObjects([value]));
        dynamodb.documentClient = (() => {
            return {
                documentClient: () => jest.fn().mockReturnThis(),
                createSet: () => jest.fn().mockReturnThis()
            }
        });
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.Team.update = jest.fn();
        dynamoDBUtils.Team = {
            scan: jest.fn().mockReturnThis(),
            filterExpression: jest.fn().mockReturnThis(),
            expressionAttributeValues: jest.fn().mockReturnThis(),
            expressionAttributeNames: jest.fn().mockReturnThis(),
            exec: mockStream,
            update: jest.fn().mockImplementation((key, params, callback) => {
                callback();
            })
        }

        return dynamoDBUtils.deregisterPlayer('Player2', 'Sample Server').then((data) => {
            expect(data).toBeFalsy();
        })
    })

    test('I should return and error if an error occurs upon the update of the Team object.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: ['Player1']
                }
            }
            ]
        };
        const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromObjects([value]));
        dynamodb.documentClient = (() => {
            return {
                documentClient: () => jest.fn().mockReturnThis(),
                createSet: () => jest.fn().mockReturnThis()
            }
        });
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.Team.update = jest.fn();
        dynamoDBUtils.Team = {
            scan: jest.fn().mockReturnThis(),
            filterExpression: jest.fn().mockReturnThis(),
            expressionAttributeValues: jest.fn().mockReturnThis(),
            expressionAttributeNames: jest.fn().mockReturnThis(),
            exec: mockStream,
            update: jest.fn().mockImplementation((key, params, callback) => {
                callback('Failed to update.');
            })
        }

        return expect(dynamoDBUtils.deregisterPlayer('Player1', 'Sample Server')).rejects.toMatch('Failed to update.')
    })
})

describe('Tentative Queue', () => {
    test('When a user is not available in the tentative queue, they should be placed into the queue.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Sample Team',
                    serverName: 'Sample Server',
                    players: ['Player2', 'Player3']
                }
            }
            ]
        };
        const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromObjects([value]));
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.Team = {
            scan: jest.fn().mockReturnThis(),
            filterExpression: jest.fn().mockReturnThis(),
            expressionAttributeValues: jest.fn().mockReturnThis(),
            expressionAttributeNames: jest.fn().mockReturnThis(),
            exec: mockStream
        }
        return expect(dynamoDBUtils.handleTentative('Player 1', 'Sample Server')).resolves.toBeFalsy();
    })

    test('When a user is available in the tentative queue, they should be removed from the queue.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Sample Team',
                    serverName: 'Sample Server',
                    players: ['Player2', 'Player3']
                }
            }
            ]
        };
        const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromObjects([value]));
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.Team = {
            scan: jest.fn().mockReturnThis(),
            filterExpression: jest.fn().mockReturnThis(),
            expressionAttributeValues: jest.fn().mockReturnThis(),
            expressionAttributeNames: jest.fn().mockReturnThis(),
            exec: mockStream
        }
        dynamoDBUtils.tentative = ['Player1'];
        return expect(dynamoDBUtils.handleTentative('Player1', 'Sample Server')).resolves.toBeTruthy().then(() => {
            expect(dynamoDBUtils.tentative.length).toEqual(0);
        });
    })

    test('When a user is available in the tentative queue and an error occurs while unregistering them then the error should be propagated.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Sample Team',
                    serverName: 'Sample Server',
                    players: ['Player1', 'Player3']
                }
            }
            ]
        };
        const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromObjects([value]));
        dynamodb.documentClient = (() => {
            return {
                documentClient: () => jest.fn().mockReturnThis(),
                createSet: () => jest.fn().mockReturnThis()
            }
        });
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.Team = {
            scan: jest.fn().mockReturnThis(),
            filterExpression: jest.fn().mockReturnThis(),
            expressionAttributeValues: jest.fn().mockReturnThis(),
            expressionAttributeNames: jest.fn().mockReturnThis(),
            exec: mockStream,
            update: jest.fn().mockImplementation((key, params, callback) => {
                callback('Failed to update.');
            })
        }
        dynamoDBUtils.tentative = [];
        return expect(dynamoDBUtils.handleTentative('Player1', 'Sample Server')).rejects.toMatch('Failed to update.');
    })
})

describe('Create New Team', () => {
    test('When I create a new team and an error occurs then it should be logged.', () => {
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.Team = {
            update: jest.fn().mockImplementation((key, callback) => {
                callback('Failed to update.');
            })
        }
        let tournament = {
            tournamentName: 'msi2021',
            tournamentDay: 'day_2'
        }
        const newTeam = dynamoDBUtils.createNewTeam('Player1', 'Sample Server', tournament, 0);
        expect(newTeam.teamName).toBeTruthy();
    })

    test('I should be able to successfully create a team with the following details: Player Name, Server Name, Tournament Details, and Team Number', () => {
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.Team = {
            update: jest.fn().mockImplementation((key, callback) => {
                callback();
            })
        }
        let tournament = {
            tournamentName: 'msi2021',
            tournamentDay: 'day_2'
        }
        const newTeam = dynamoDBUtils.createNewTeam('Player1', 'Sample Server', tournament, 0);
        expect(newTeam.teamName).toBeTruthy();
        expect(newTeam.key).toEqual(`Team Abomasnow#Sample Server#${tournament.tournamentName}#${tournament.tournamentDay}`);
        expect(newTeam.tournamentName).toEqual(tournament.tournamentName);
        expect(newTeam.tournamentDay).toEqual(tournament.tournamentDay);
    })
})

describe('Filter Available Team', () => {

    test('I should be able to receive an available Team if the player passed does not belong to the team.', () => {
        let teams = [
            {
                key: 'Sample Team#Sample Server#msi2021#day2',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: ['Player1'],
                tournamentName: 'msi2021',
                tournamentDay: 'day2'
            },
            {
                key: 'Sample Team1#Sample Server#msi2021#day3',
                teamName: 'Sample Team1',
                serverName: 'Sample Server',
                players: undefined,
                tournamentName: 'msi2021',
                tournamentDay: 'day3'
            }
        ];
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: 'day2'
        }, {
            tournamentName: 'msi2021',
            tournamentDay: 'day3'
        }, {
            tournamentName: 'shurima2022',
            tournamentDay: 'day3'
        }]
        expect(dynamoDBUtils.findFirstAvailableTeam('Player1', tournaments, teams)).toEqual(teams[1]);
    })

    test('I should be able to receive an available Team if the player passed does not belong to the team and the tournament.', () => {
        let teams = [
            {
                key: 'Sample Team#Sample Server#msi2021#day2',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: undefined,
                tournamentName: 'msi2021',
                tournamentDay: 'day2'
            },
            {
                key: 'Sample Team1#Sample Server#msi2022#day3',
                teamName: 'Sample Team1',
                serverName: 'Sample Server',
                players: undefined,
                tournamentName: 'msi2022',
                tournamentDay: 'day3'
            }
        ];
        let tournaments = [{
            tournamentName: 'msi2022',
            tournamentDay: 'day3'
        }, {
            tournamentName: 'shurima2022',
            tournamentDay: 'day3'
        }]
        expect(dynamoDBUtils.findFirstAvailableTeam('Player1', tournaments, teams)).toEqual(teams[1]);
    })

    test('I should be able to receive an available Team if the player passed does not belong to the team and the first available tournament.', () => {
        let teams = [
            {
                key: 'Sample Team#Sample Server#msi2021#day3',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: ['Player1'],
                tournamentName: 'msi2021',
                tournamentDay: 'day3'
            },
            {
                key: 'Sample Team1#Sample Server#msi2022#day1',
                teamName: 'Sample Team1',
                serverName: 'Sample Server',
                players: undefined,
                tournamentName: 'msi2022',
                tournamentDay: 'day1'
            },
            {
                key: 'Sample Team#Sample Server#shurima2022#day3',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: undefined,
                tournamentName: 'shurima2022',
                tournamentDay: 'day3'
            },
        ];
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: 'day3'
        }, {
            tournamentName: 'msi2022',
            tournamentDay: 'day1'
        }, {
            tournamentName: 'shurima2022',
            tournamentDay: 'day3'
        }]
        expect(dynamoDBUtils.findFirstAvailableTeam('Player1', tournaments, teams)).toEqual(teams[1]);
    })

    test('I should be able to receive an available Team if the player passed does not belong to the team and the first available tournament and day.', () => {
        let teams = [
            {
                key: 'Sample Team#Sample Server#msi2021#day1',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: ['Player1'],
                tournamentName: 'msi2021',
                tournamentDay: 'day1'
            },
            {
                key: 'Sample Team1#Sample Server#msi2021#day2',
                teamName: 'Sample Team1',
                serverName: 'Sample Server',
                players: undefined,
                tournamentName: 'msi2021',
                tournamentDay: 'day2'
            },
            {
                key: 'Sample Team#Sample Server#shurima2022#day3',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: undefined,
                tournamentName: 'shurima2022',
                tournamentDay: 'day3'
            },
        ];
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: 'day1'
        }, {
            tournamentName: 'msi2021',
            tournamentDay: 'day2'
        }, {
            tournamentName: 'shurima2022',
            tournamentDay: 'day3'
        }]
        expect(dynamoDBUtils.findFirstAvailableTeam('Player1', tournaments, teams)).toEqual(teams[1]);
    })

    test('I should be able to receive an available Team if the player passed does not belong to the team and the first available tournament and day with less than 5 players.', () => {
        let teams = [
            {
                key: 'Sample Team#Sample Server#msi2021#day1',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: ['Player1','Player2','Player3','Player4','Player5'],
                tournamentName: 'msi2021',
                tournamentDay: 'day1'
            },
            {
                key: 'Sample Team1#Sample Server#msi2021#day2',
                teamName: 'Sample Team1',
                serverName: 'Sample Server',
                players: undefined,
                tournamentName: 'msi2021',
                tournamentDay: 'day2'
            },
            {
                key: 'Sample Team#Sample Server#shurima2022#day3',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: undefined,
                tournamentName: 'shurima2022',
                tournamentDay: 'day3'
            },
        ];
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: 'day1'
        }, {
            tournamentName: 'msi2021',
            tournamentDay: 'day2'
        }, {
            tournamentName: 'shurima2022',
            tournamentDay: 'day3'
        }]
        expect(dynamoDBUtils.findFirstAvailableTeam('Player6', tournaments, teams)).toEqual(teams[1]);
    })

    test('I should receive a Team with the exist value populated if the player passed belongs to the tournament and tournament day passed', () => {
        let teams = [
            {
                key: 'Sample Team#Sample Server#msi2021#day1',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: ['Player1','Player2','Player3','Player4','Player5'],
                tournamentName: 'msi2021',
                tournamentDay: 'day1'
            }
        ];
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: 'day1'
        }]
        const foundTeam = dynamoDBUtils.findFirstAvailableTeam('Player1', tournaments, teams);
        expect(foundTeam).toBeFalsy()
    })

    test('I should receive all Teams with the exist value populated if the player passed belongs to the tournament and tournament day passed', () => {
        let teams = [
            {
                key: 'Sample Team#Sample Server#msi2021#day1',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: ['Player1','Player2','Player3','Player4','Player5'],
                tournamentName: 'msi2021',
                tournamentDay: 'day1'
            },
            {
                key: 'Sample Team#Sample Server#msi2021#day1',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: ['Player1','Player2','Player3'],
                tournamentName: 'msi2021',
                tournamentDay: 'day2'
            }
        ];
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: 'day1'
        },{
            tournamentName: 'msi2021',
            tournamentDay: 'day2'
        }];
        const foundTeam = dynamoDBUtils.findFirstAvailableTeam('Player1', tournaments, JSON.parse(JSON.stringify(teams)));
        expect(foundTeam).toBeFalsy();3
    })

    test('I should receive a single team if a player passed does not belong to one of the tournaments and tournament days passed.', () => {
        let teams = [
            {
                key: 'Sample Team#Sample Server#msi2021#day1',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: ['Player1','Player2','Player3','Player4','Player5'],
                tournamentName: 'msi2021',
                tournamentDay: 'day1'
            },
            {
                key: 'Sample Team#Sample Server#msi2021#day1',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: ['Player1','Player2','Player3'],
                tournamentName: 'msi2021',
                tournamentDay: 'day2'
            }
        ];
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: 'day1'
        },{
            tournamentName: 'msi2021',
            tournamentDay: 'day2'
        }];
        const foundTeam = dynamoDBUtils.findFirstAvailableTeam('Player4', tournaments, teams);
        expect(foundTeam).toEqual(teams[1]);
    })

    test('I should receive an undefined if there are no Teams currently available.', () => {
        let teams = [];
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: 'day1'
        },{
            tournamentName: 'msi2021',
            tournamentDay: 'day2'
        }];
        const foundTeam = dynamoDBUtils.findFirstAvailableTeam('Player4', tournaments, teams);
        expect(foundTeam).toEqual(undefined);
    })
})

describe('Filter Available Tournaments', () => {
    test('I should receive all tournaments that the player is not registered to.', () => {
        let teams = [
            {
                key: 'Sample Team#Sample Server#msi2021#day2',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: ['Player1'],
                tournamentName: 'msi2021',
                tournamentDay: 'day2'
            },
            {
                key: 'Sample Team1#Sample Server#msi2021#day3',
                teamName: 'Sample Team1',
                serverName: 'Sample Server',
                players: undefined,
                tournamentName: 'msi2021',
                tournamentDay: 'day3'
            }
        ];
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: 'day2'
        }, {
            tournamentName: 'msi2021',
            tournamentDay: 'day3'
        }, {
            tournamentName: 'shurima2022',
            tournamentDay: 'day3'
        }]

        let expectedTournaments = tournaments.slice(1, 3);

        expect(dynamoDBUtils.filterAvailableTournaments(tournaments, 'Player1', teams)).toEqual(expectedTournaments);
    })

    test('I should receive all tournaments if the teams is undefined.', () => {
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: 'day2'
        }, {
            tournamentName: 'msi2021',
            tournamentDay: 'day3'
        }, {
            tournamentName: 'shurima2022',
            tournamentDay: 'day3'
        }];

        expect(dynamoDBUtils.filterAvailableTournaments(tournaments, 'Player1')).toEqual(tournaments);
    })

    test('I should receive all tournaments if the teams is empty.', () => {
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: 'day2'
        }, {
            tournamentName: 'msi2021',
            tournamentDay: 'day3'
        }, {
            tournamentName: 'shurima2022',
            tournamentDay: 'day3'
        }];

        expect(dynamoDBUtils.filterAvailableTournaments(tournaments, 'Player1', [])).toEqual(tournaments);
    })

    test('I should receive no tournaments if the player belongs to a team registered for each tournament passed.', () => {
        let teams = [
            {
                key: 'Sample Team#Sample Server#msi2021#day2',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: ['Player1'],
                tournamentName: 'msi2021',
                tournamentDay: 'day2'
            },
            {
                key: 'Sample Team1#Sample Server#msi2021#day3',
                teamName: 'Sample Team1',
                serverName: 'Sample Server',
                players: ['Player1'],
                tournamentName: 'msi2021',
                tournamentDay: 'day3'
            }
        ];
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: 'day2'
        }, {
            tournamentName: 'msi2021',
            tournamentDay: 'day3'
        }];

        expect(dynamoDBUtils.filterAvailableTournaments(tournaments, 'Player1', teams)).toEqual([]);
    })
})

test('Should return a hashkey of the team name and the server name passed.', () => {
    expect(dynamoDBUtils.getKey('Sample Team', 'Sample Server', 'msi2021', 'day1')).toEqual('Sample Team#Sample Server#msi2021#day1');
})

test('Should return a copy of the tentative users.', () => {
    dynamoDBUtils.tentative = ['Player1', 'Player2'];
    expect(dynamoDBUtils.getTentative()).toEqual(dynamoDBUtils.tentative);
})