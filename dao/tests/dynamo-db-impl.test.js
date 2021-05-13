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

describe('Register Player', () => {
    test('I should retrieve all teams for a server when getTeams is called with a single team.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Sample Team',
                    serverName: 'Sample Server',
                    players: ['Player1', 'Player2']
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
                    players: ['Player1', 'Player2']
                }
            },
                {
                    attrs: {
                        key: 'Sample Team2#Sample Server',
                        teamName: 'Sample Team2',
                        serverName: 'Sample Server',
                        players: ['Player3', 'Player4']
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

    test('I should register a player and add him to a Team if a teams exist with less than 4 players.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: ['Player1', 'Player2']
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

        return dynamoDBUtils.registerPlayer('Player3', 'Sample Server').then(result => {
            expect(result).toBeTruthy();
            expect(result.teamName).toEqual(value.Items[0].attrs.teamName);
            expect(result.players.length).toEqual(3);
            expect(result.players).toContain('Player3');
            expect(dynamoDBUtils.Team.update.mock.calls.length).toEqual(1);
        }).catch(err => expect(err).toBeFalsy());
    })

    test('I should register a player and add him to a Team if a teams exist with less than 4 players and remove him from tentative if he is on it.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: ['Player1', 'Player2']
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

        return dynamoDBUtils.registerPlayer('Player3', 'Sample Server').then(result => {
            expect(result).toBeTruthy();
            expect(result.teamName).toEqual(value.Items[0].attrs.teamName);
            expect(result.players.length).toEqual(3);
            expect(result.players).toContain('Player3');
            expect(dynamoDBUtils.tentative.length).toEqual(0)
            expect(dynamoDBUtils.Team.update.mock.calls.length).toEqual(1);
        }).catch(err => expect(err).toBeFalsy());
    })

    test('I should not register a player that already exists in a team', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: ['Player1', 'Player2']
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

        return dynamoDBUtils.registerPlayer('Player2', 'Sample Server').then(result => {
            expect(result).toBeTruthy();
            expect(result.exist).toBeTruthy();
            expect(result.teamName).toEqual(value.Items[0].attrs.teamName);
            expect(result.players.length).toEqual(2);
            expect(result.players).toContain('Player2');
        });
    })

    test('I should register a player into the team if the players property is undefined', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server'
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

        return dynamoDBUtils.registerPlayer('Player2', 'Sample Server').then(result => {
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

        return dynamoDBUtils.registerPlayer('Player1', 'Sample Server').then(result => {
            expect(result).toBeTruthy();
            expect(result.teamName).toEqual(`Team ${randomNames[1]}`);
            expect(result.players).toEqual(['Player1']);
            expect(dynamoDBUtils.Team.update.mock.calls.length).toEqual(1);
        }).catch(err => expect(err).toBeFalsy());
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
        const newTeam = dynamoDBUtils.createNewTeam('Player1', 'Sample Server', 0);
        expect(newTeam.teamName).toBeTruthy();
    })
})

test('Should return a hashkey of the team name and the server name passed.', () => {
    expect(dynamoDBUtils.getKey('Sample Team', 'Sample Server')).toEqual('Sample Team#Sample Server');
})

test('Should return a copy of the tentative users.', () => {
    dynamoDBUtils.tentative = ['Player1', 'Player2'];
    expect(dynamoDBUtils.getTentative()).toEqual(dynamoDBUtils.tentative);
})
