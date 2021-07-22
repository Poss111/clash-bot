const dynamoDBUtils = require('../dynamo-db-impl');
const dynamodb = require('dynamodb');
const streamTest = require('streamtest');
const randomNames = require('../../random-names');
const each = require('jest-each').default;

jest.mock('dynamodb');

function buildMockReturnForRegister(streamData, teamToBeReturned, add, update, del) {
    const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromObjects([streamData]));
    dynamoDBUtils.Team = jest.fn();
    dynamoDBUtils.Team.exec = mockStream;
    dynamoDBUtils.Team.scan = jest.fn().mockReturnThis();
    dynamoDBUtils.Team.filterExpression = jest.fn().mockReturnThis();
    dynamoDBUtils.Team.expressionAttributeValues = jest.fn().mockReturnThis();
    dynamoDBUtils.Team.expressionAttributeNames = jest.fn().mockReturnThis();
    if (teamToBeReturned) {
        dynamoDBUtils.Team.update = jest.fn();
        if (add) {
            dynamoDBUtils.Team.update.mockImplementationOnce((team, callback) => {
                callback(undefined, {
                    attrs: teamToBeReturned
                });
            })
        }
        if (update) {
            dynamoDBUtils.Team.update.mockImplementationOnce((key, params, callback) => {
            if (callback) {
                callback(undefined, {
                    attrs: teamToBeReturned
                });
            }
        })
        }
        if (del) {
            dynamoDBUtils.Team.update.mockImplementationOnce((key, params, callback) => {
                if (callback) {
                    callback(undefined, {
                        attrs: teamToBeReturned
                    });
                }
            })
        }
        dynamodb.Set = jest.fn().mockImplementation(([players]) => {
            return [players];
        })
    }
}

beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
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
        return dynamoDBUtils.initializeClashBotDB().then(() => {
        }).catch((err) => expect(err).toEqual(sampleError))
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

        return dynamoDBUtils.getTeams('Sample Server').then(() => {
        })
            .catch((err) => expect(err).toEqual([value]));
    })

    test('I should register a player and create a new Team if another tournament to register is available and they exist by themselves on a team for the first tournament.', () => {
        const expectedPlayerName = 'Player2';
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: [expectedPlayerName],
                    tournamentName: 'msi2021',
                    tournamentDay: 'day_2'
                }
            }
            ]
        };
        let expectedPlayers = [];
        expectedPlayers.push(expectedPlayerName);
        let mockTeam = {
            key: 'Sample Team#Sample Server',
            teamName: 'Team Sample',
            serverName: 'Sample Server',
            players: expectedPlayers
        };
        buildMockReturnForRegister(value, mockTeam, true);

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
        let tournament = [
            {
                tournamentName: 'msi2021',
                tournamentDay: 'day_2'
            },
            {
                tournamentName: 'msi2021',
                tournamentDay: 'day_3'
            }
        ];
        return dynamoDBUtils.registerPlayer(expectedPlayerName, 'Sample Server', tournament).then(result => {
            expect(result).toBeTruthy();
            expect(result.teamName).toEqual(mockTeam.teamName);
            expect(result.players.length).toEqual(1);
            expect(result.players).toContain(expectedPlayerName);
            expect(dynamoDBUtils.Team.update.mock.calls.length).toEqual(1);
            expect(dynamoDBUtils.Team.update).toBeCalledWith(expectedCreatedTeam, expect.any(Function));
        });
    })

    test('I should not register a player that already exists in a team', () => {
        let expectedPlayer = 'Player1';
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: [expectedPlayer],
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

        let tournament = [{tournamentName: 'msi2021', tournamentDay: 'day_3'}];
        return dynamoDBUtils.registerPlayer(expectedPlayer, 'Sample Server', tournament).then(result => {
            expect(result).toBeTruthy();
            expect(result[0].exist).toBeTruthy();
            expect(result[0].teamName).toEqual(value.Items[0].attrs.teamName);
            expect(result[0].players).toEqual([expectedPlayer]);
        });
    })

    test('I should register a player into the team if the players property is undefined', () => {
        const value = {
            Items: [
                {
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
        let expectedPlayers = [];
        expectedPlayers.push('Player1');
        let mockTeam = {
            key: 'Sample Team#Sample Server',
            teamName: 'Team Sample',
            serverName: 'Sample Server',
            players: expectedPlayers
        };
        buildMockReturnForRegister(value, mockTeam, false, true);

        let tournament = [{tournamentName: 'msi2021', tournamentDay: 'day_3'}];
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
        const expectedPlayer = 'Player1';
        let mockTeam = {
            key: 'Sample Team#Sample Server',
            teamName: 'Team Sample',
            serverName: 'Sample Server',
            players: [expectedPlayer]
        };
        buildMockReturnForRegister(value, mockTeam, true);

        let tournament = [{tournamentName: 'msi2021', tournamentDay: 'day_3'}];
        return dynamoDBUtils.registerPlayer('Player1', 'Sample Server', tournament).then(result => {
            expect(result).toBeTruthy();
            expect(result.teamName).toEqual(mockTeam.teamName);
            expect(result.players).toEqual([expectedPlayer]);
            expect(dynamoDBUtils.Team.update.mock.calls.length).toEqual(1);
        });
    })

    test('I should register the player to a completely new Team if they request one and they already exist on a team.', () => {
        let expectedPlayer = 'Player2';
        let expectedServerName = 'Sample Server';
        const expectedPlayers = ['Player1', expectedPlayer];
        const value = {
            Items: [{
                attrs: {
                    key: 'Team Sample#Sample Server#msi2021#3',
                    teamName: 'Team Sample',
                    serverName: expectedServerName,
                    tournamentName: 'msi2021',
                    tournamentDay: '3',
                    players: expectedPlayers
                }
            }]
        };
        let mockTeam = {
            key: 'Sample Team#Sample Server',
            teamName: 'Team Sample',
            serverName: expectedServerName,
            tournamentName: 'msi2021',
            tournamentDay: '3',
            players: [expectedPlayer]
        };
        buildMockReturnForRegister(value, mockTeam, true, false, true);

        let tournament = [
            {tournamentName: 'msi2021', tournamentDay: '3'},
            {tournamentName: 'msi2021', tournamentDay: '4'}
        ];
        let expectedTeamToPersist = {
            key: "Team Absol#Sample Server#msi2021#3",
            players: ["Player2"],
            serverName: "Sample Server",
            teamName: "Team Absol",
            tournamentDay: "3",
            tournamentName: "msi2021"
        };
        let expectedTournament = JSON.parse(JSON.stringify(tournament[0]));
        return dynamoDBUtils.registerPlayer(expectedPlayer, expectedServerName, tournament)
            .then(result => {
                expect(result).toBeTruthy();
                expect(result.teamName).toEqual(mockTeam.teamName);
                expect(result.players).toEqual(mockTeam.players);
                expect(result.tournamentName).toEqual(expectedTournament.tournamentName);
                expect(result.tournamentDay).toEqual(expectedTournament.tournamentDay);
                expect(dynamoDBUtils.Team.update.mock.calls.length).toEqual(2);
                expect(dynamoDBUtils.Team.update.mock.calls).toEqual([
                    [
                        expectedTeamToPersist,
                        expect.any(Function)
                    ],
                    [
                        {key: value.Items[0].attrs.key}, {
                        ExpressionAttributeValues: {
                            ':playerName': [expectedPlayer],
                            ':nameOfTeam': 'Team Sample'
                        },
                        ConditionExpression: 'teamName = :nameOfTeam',
                        UpdateExpression: 'DELETE players :playerName'
                    },
                        expect.any(Function)
                    ]
                ]);
            });
    })
})

describe('Register Specific Team', () => {
    test('A user should be able to request to join a specific Team based on the Tournament and Team name.', () => {
        let playerName = 'TestPlayer1';
        let serverName = 'Test Server';
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: '3'
        }];
        let teamName = 'Abra';
        const dynamoDbRetrieveList = {
            Items: [{
                attrs: {
                    key: dynamoDBUtils.getKey(teamName, serverName, tournaments[0].tournamentName, tournaments[0].tournamentDay),
                    teamName: `Team Awesome`,
                    serverName: serverName,
                    players: undefined,
                    tournamentName: tournaments[0].tournamentName,
                    tournamentDay: tournaments[0].tournamentDay
                }
            }, {
                attrs: {
                    key: dynamoDBUtils.getKey(`Team Existing`, serverName, tournaments[0].tournamentName, tournaments[0].tournamentDay),
                    teamName: `Team Existing`,
                    serverName: serverName,
                    players: ['Player3', playerName],
                    tournamentName: tournaments[0].tournamentName,
                    tournamentDay: tournaments[0].tournamentDay
                }
            }, {
                attrs: {
                    key: dynamoDBUtils.getKey(`Team ${teamName}`, serverName, tournaments[0].tournamentName, tournaments[0].tournamentDay),
                    teamName: `Team ${teamName}`,
                    serverName: serverName,
                    players: ['Player3'],
                    tournamentName: tournaments[0].tournamentName,
                    tournamentDay: tournaments[0].tournamentDay
                }
            }
            ]
        };
        let updatedExpectedPlayers = JSON.parse(JSON.stringify(dynamoDbRetrieveList.Items[1].attrs.players)).concat(playerName);
        let mockTeam = {
            key: dynamoDBUtils.getKey(teamName, serverName, tournaments[0].tournamentName, tournaments[0].tournamentDay),
            teamName: `Team ${teamName}`,
            serverName: serverName,
            players: updatedExpectedPlayers,
            tournamentName: tournaments[0].tournamentName,
            tournamentDay: tournaments[0].tournamentDay
        };
        buildMockReturnForRegister(dynamoDbRetrieveList, mockTeam, false, true, true);
        expect(dynamoDBUtils.tentative).toHaveLength(0);
        return dynamoDBUtils.registerWithSpecificTeam(playerName, serverName, tournaments, teamName, () => { console.log('Do Something.');}).then(data => {
            expect(data).toBeTruthy();
            expect(data.teamName).toEqual(dynamoDbRetrieveList.Items[2].attrs.teamName);
            expect(data.serverName).toEqual(dynamoDbRetrieveList.Items[2].attrs.serverName);
            expect(data.tournamentName).toEqual(dynamoDbRetrieveList.Items[2].attrs.tournamentName);
            expect(data.tournamentDay).toEqual(dynamoDbRetrieveList.Items[2].attrs.tournamentDay);
            expect(data.players).toEqual(updatedExpectedPlayers);
            expect(dynamoDBUtils.tentative).toHaveLength(0);
            expect(dynamoDBUtils.Team.update.mock.calls).toEqual([
                [
                    {key: dynamoDbRetrieveList.Items[2].attrs.key},
                    {
                        ExpressionAttributeValues: {
                            ':playerName': [playerName]
                        },
                        UpdateExpression: 'ADD players :playerName'
                    }, expect.any(Function)
                ], [
                    {key: dynamoDbRetrieveList.Items[1].attrs.key},
                    {
                        ExpressionAttributeValues: {
                            ':playerName': [playerName],
                            ':nameOfTeam': dynamoDbRetrieveList.Items[1].attrs.teamName
                        },
                        ConditionExpression: 'teamName = :nameOfTeam',
                        UpdateExpression: 'DELETE players :playerName'
                    }, expect.any(Function)
                ]
            ]);
        })
    })

    test('A user should be able to request to join a specific Team based on the Tournament and Team name and be removed from Tentative queue if they exist in it.', () => {
        let playerName = 'TestPlayer1';
        let serverName = 'Test Server';
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: '3'
        }];
        let teamName = 'Abra';
        const dynamoDbRetrieveList = {
            Items: [{
                attrs: {
                    key: dynamoDBUtils.getKey(`Team Existing`, serverName, tournaments[0].tournamentName, tournaments[0].tournamentDay),
                    teamName: `Team Existing`,
                    serverName: serverName,
                    players: ['Player3', playerName],
                    tournamentName: tournaments[0].tournamentName,
                    tournamentDay: tournaments[0].tournamentDay
                }
            }, {
                attrs: {
                    key: dynamoDBUtils.getKey(`Team ${teamName}`, serverName, tournaments[0].tournamentName, tournaments[0].tournamentDay),
                    teamName: `Team ${teamName}`,
                    serverName: serverName,
                    players: ['Player3'],
                    tournamentName: tournaments[0].tournamentName,
                    tournamentDay: tournaments[0].tournamentDay
                }
            }, {
                attrs: {
                    key: dynamoDBUtils.getKey(teamName, serverName, tournaments[0].tournamentName, tournaments[0].tournamentDay),
                    teamName: `Team ${teamName}`,
                    serverName: serverName,
                    players: ['Player1', 'Player2'],
                    tournamentName: tournaments[0].tournamentName,
                    tournamentDay: tournaments[0].tournamentDay
                }
            }
            ]
        };
        dynamoDBUtils.tentative = [{
            playerName: playerName,
            serverName: serverName,
            tournamentName: tournaments[0].tournamentName
        }];
        let updatedExpectedPlayers = JSON.parse(JSON.stringify(dynamoDbRetrieveList.Items[0].attrs.players)).concat(playerName);
        let mockTeam = {
            key: dynamoDBUtils.getKey(teamName, serverName, tournaments[0].tournamentName, tournaments[0].tournamentDay),
            teamName: `Team ${teamName}`,
            serverName: serverName,
            players: updatedExpectedPlayers,
            tournamentName: tournaments[0].tournamentName,
            tournamentDay: tournaments[0].tournamentDay
        };
        buildMockReturnForRegister(dynamoDbRetrieveList, mockTeam, false, true);
        expect(dynamoDBUtils.tentative).toHaveLength(1);
        return dynamoDBUtils.registerWithSpecificTeam(playerName, serverName, tournaments, teamName).then(data => {
            expect(data).toBeTruthy();
            expect(data.teamName).toEqual(dynamoDbRetrieveList.Items[1].attrs.teamName);
            expect(data.serverName).toEqual(dynamoDbRetrieveList.Items[1].attrs.serverName);
            expect(data.tournamentName).toEqual(dynamoDbRetrieveList.Items[1].attrs.tournamentName);
            expect(data.tournamentDay).toEqual(dynamoDbRetrieveList.Items[1].attrs.tournamentDay);
            expect(data.players).toEqual(updatedExpectedPlayers);
            expect(dynamoDBUtils.tentative).toHaveLength(0);
            expect(dynamoDBUtils.Team.update.mock.calls).toEqual([
                [
                    {key: dynamoDbRetrieveList.Items[1].attrs.key},
                    {
                        ExpressionAttributeValues: {
                            ':playerName': [playerName]
                        },
                        UpdateExpression: 'ADD players :playerName'
                    }, expect.any(Function)
                ], [
                    {key: dynamoDbRetrieveList.Items[0].attrs.key},
                    {
                        ExpressionAttributeValues: {
                            ':playerName': [playerName],
                            ':nameOfTeam': dynamoDbRetrieveList.Items[0].attrs.teamName
                        },
                        ConditionExpression: 'teamName = :nameOfTeam',
                        UpdateExpression: 'DELETE players :playerName'
                    }, expect.any(Function)
                ]
            ]);
        })
    })

    test('If the team that the user is requesting, does not exist, return with an undefined response.', () => {
        let playerName = 'TestPlayer1';
        let serverName = 'Test Server';
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: '3'
        }];
        let teamName = 'Abra';
        const dynamoDbRetrieveList = {
            Items: [{
                attrs: {
                    key: dynamoDBUtils.getKey(`Team DNE`, serverName, tournaments[0].tournamentName, tournaments[0].tournamentDay),
                    teamName: `Team DNE`,
                    serverName: serverName,
                    players: ['Player3'],
                    tournamentName: tournaments[0].tournamentName,
                    tournamentDay: tournaments[0].tournamentDay
                }
            }, {
                attrs: {
                    key: dynamoDBUtils.getKey(`Team DNE`, serverName, tournaments[0].tournamentName, tournaments[0].tournamentDay),
                    teamName: `Team Hello`,
                    serverName: serverName,
                    players: ['Player1', 'Player2'],
                    tournamentName: tournaments[0].tournamentName,
                    tournamentDay: tournaments[0].tournamentDay
                }
            }
            ]
        };
        buildMockReturnForRegister(dynamoDbRetrieveList);
        return dynamoDBUtils.registerWithSpecificTeam(playerName, serverName, tournaments, teamName).then(data => {
            expect(data).toBeFalsy();
        })
    })

    test('If the team that the user is requesting, has 5 players, return with an undefined response.', () => {
        let playerName = 'TestPlayer1';
        let serverName = 'Test Server';
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: '3'
        }];
        let teamName = 'Abra';
        const dynamoDbRetrieveList = {
            Items: [{
                attrs: {
                    key: dynamoDBUtils.getKey(`Team DNE`, serverName, tournaments[0].tournamentName, tournaments[0].tournamentDay),
                    teamName: `Team ${teamName}`,
                    serverName: serverName,
                    players: ['Player3', 'Player2', 'Player3', 'Player4', 'Player5'],
                    tournamentName: tournaments[0].tournamentName,
                    tournamentDay: tournaments[0].tournamentDay
                }
            }]
        };
        buildMockReturnForRegister(dynamoDbRetrieveList);
        return dynamoDBUtils.registerWithSpecificTeam(playerName, serverName, tournaments, teamName).then(data => {
            expect(data).toBeFalsy();
        })
    })

    describe('Error', () => {
        test('If there is an error upon querying for records, the error should be caught and rejected.', () => {
            let playerName = 'TestPlayer1';
            let serverName = 'Test Server';
            let tournaments = [{
                tournamentName: 'msi2021',
                tournamentDay: '3'
            }];
            let teamName = 'Abra';
            const dynamoDbRetrieveList = {
                Items: [{
                    attrs: {
                        key: dynamoDBUtils.getKey(`Team DNE`, serverName, tournaments[0].tournamentName, tournaments[0].tournamentDay),
                        teamName: `Team DNE`,
                        serverName: serverName,
                        players: ['Player3'],
                        tournamentName: tournaments[0].tournamentName,
                        tournamentDay: tournaments[0].tournamentDay
                    }
                }, {
                    attrs: {
                        key: dynamoDBUtils.getKey(`Team DNE`, serverName, tournaments[0].tournamentName, tournaments[0].tournamentDay),
                        teamName: `Team Hello`,
                        serverName: serverName,
                        players: ['Player1', 'Player2'],
                        tournamentName: tournaments[0].tournamentName,
                        tournamentDay: tournaments[0].tournamentDay
                    }
                }
                ]
            };
            buildMockReturnForRegister(dynamoDbRetrieveList);
            dynamoDBUtils.Team.exec = undefined;

            return dynamoDBUtils.registerWithSpecificTeam(playerName, serverName, tournaments, teamName).then(data => {
                expect(data).toBeFalsy();
            }).catch(err => expect(err).toBeTruthy());
        })
    })

})

describe('Filter by Team Name', () => {

    each([
        [true, 'Team Existing', {teamName: `Team Existing`}],
        [true, 'Existing', {teamName: `Team Existing`}],
        [true, 'existing', {teamName: `Team Existing`}],
        [true, 'isting', {teamName: `Team Existing`}],
        [true, 'e', {teamName: `Team Existing`}],
        [false, 'dne', {teamName: `Team Existing`}],
        [false, undefined, {teamName: `Team Existing`}],
        [false, 'Team Existing', {}],
        [false, 'Team Existing', undefined],
    ]).test("Match ('%s') Search Team Name ('%s') with Team ('%s')", (shouldMatch, teamNameToMatch, team) => {
        expect(dynamoDBUtils.doesTeamNameMatch(teamNameToMatch, team)).toEqual(shouldMatch);
    })
})

describe('Unregister Player', () => {
    test('I should remove a player from a team if unregister is called and they exist on a team.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: ['Player1'],
                    tournamentName: 'msi2021',
                    tournamentDay: '1'
                }
            }
            ]
        };
        let leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "1",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                tournamentName: "msi2021",
                tournamentDay: "2",
                "startTime": "May 30 2021 07:00 pm PDT",
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
        let expectedPlayers = ['Player1'];
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
        dynamodb.Set = jest.fn().mockReturnValue(expectedPlayers);

        let foundTeam = value.Items[0].attrs;
        let key = dynamoDBUtils.getKey(foundTeam.teamName, foundTeam.serverName, foundTeam.tournamentName, foundTeam.tournamentDay);

        return dynamoDBUtils.deregisterPlayer('Player1', 'Sample Server', leagueTimes).then((data) => {
            expect(data).toBeTruthy();
            expect(dynamoDBUtils.Team.update).toBeCalledWith({key: key}, {
                ExpressionAttributeValues: {
                    ':playerName': expectedPlayers,
                    ':nameOfTeam': 'Team Sample'
                },
                ConditionExpression: 'teamName = :nameOfTeam',
                UpdateExpression: 'DELETE players :playerName'
            }, expect.any(Function));
        })
    })

    test('I should remove a player from multiple teams if unregister is called and they belong to multiple teams that match the criteria.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: ['Player1'],
                    tournamentName: 'msi2021',
                    tournamentDay: '1'
                }
            }, {
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample2',
                    serverName: 'Sample Server',
                    players: ['Player1'],
                    tournamentName: 'msi2021',
                    tournamentDay: '2'
                }
            }
            ]
        };
        let leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "1",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                tournamentName: "msi2021",
                tournamentDay: "2",
                "startTime": "May 30 2021 07:00 pm PDT",
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
        let expectedPlayers = ['Player1'];
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
        dynamodb.Set = jest.fn().mockReturnValue(expectedPlayers);

        let foundTeam = value.Items[0].attrs;
        let keyOne = dynamoDBUtils.getKey(foundTeam.teamName, foundTeam.serverName, foundTeam.tournamentName, foundTeam.tournamentDay);
        let foundTeamTwo = value.Items[1].attrs;
        let keyTwo = dynamoDBUtils.getKey(foundTeamTwo.teamName, foundTeamTwo.serverName, foundTeamTwo.tournamentName, foundTeamTwo.tournamentDay);

        return dynamoDBUtils.deregisterPlayer('Player1', 'Sample Server', leagueTimes).then((data) => {
            expect(data).toBeTruthy();
            expect(dynamoDBUtils.Team.update.mock.calls.length).toEqual(2);
            expect(dynamoDBUtils.Team.update.mock.calls).toEqual([[{key: keyOne}, {
                ExpressionAttributeValues: {
                    ':playerName': expectedPlayers,
                    ':nameOfTeam': 'Team Sample'
                },
                ConditionExpression: 'teamName = :nameOfTeam',
                UpdateExpression: 'DELETE players :playerName'
            }, expect.any(Function)], [
                {key: keyTwo}, {
                    ExpressionAttributeValues: {
                        ':playerName': expectedPlayers,
                        ':nameOfTeam': 'Team Sample2'
                    },
                    ConditionExpression: 'teamName = :nameOfTeam',
                    UpdateExpression: 'DELETE players :playerName'
                }, expect.any(Function)
            ]]);
        })
    })

    test('I should remove a player from a single team if unregister is called and they belong to a single teams that matches the criteria.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: ['Player1'],
                    tournamentName: 'msi2021',
                    tournamentDay: '1'
                }
            }, {
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample2',
                    serverName: 'Sample Server',
                    players: ['Player1'],
                    tournamentName: 'msi2021',
                    tournamentDay: '2'
                }
            }
            ]
        };
        let leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "1",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            }
        ];
        let expectedPlayers = ['Player1'];
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
        dynamodb.Set = jest.fn().mockReturnValue(expectedPlayers);

        let foundTeam = value.Items[0].attrs;
        let keyOne = dynamoDBUtils.getKey(foundTeam.teamName, foundTeam.serverName, foundTeam.tournamentName, foundTeam.tournamentDay);

        return dynamoDBUtils.deregisterPlayer('Player1', 'Sample Server', leagueTimes).then((data) => {
            expect(data).toBeTruthy();
            expect(dynamoDBUtils.Team.update.mock.calls.length).toEqual(1);
            expect(dynamoDBUtils.Team.update.mock.calls).toEqual([[{key: keyOne}, {
                ExpressionAttributeValues: {
                    ':playerName': expectedPlayers,
                    ':nameOfTeam': 'Team Sample'
                },
                ConditionExpression: 'teamName = :nameOfTeam',
                UpdateExpression: 'DELETE players :playerName'
            }, expect.any(Function)]]);
        })
    })

    test('I should not remove a player from a team if unregister is called and they do not exist on a team.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: ['Player1'],
                    tournamentName: 'msi2021',
                    tournamentDay: '1'
                }
            }
            ]
        };
        let leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "1",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                tournamentName: "msi2021",
                tournamentDay: "2",
                "startTime": "May 30 2021 07:00 pm PDT",
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
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

        return dynamoDBUtils.deregisterPlayer('Player2', 'Sample Server', leagueTimes).then((data) => {
            expect(data).toBeFalsy();
        })
    })

    test('I should not remove a player from a team if unregister is called and they do not exist on a team with the given tournament details.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Team Sample',
                    serverName: 'Sample Server',
                    players: ['Player1'],
                    tournamentName: 'msi2021',
                    tournamentDay: '3'
                }
            }
            ]
        };
        let leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "1",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                tournamentName: "msi2021",
                tournamentDay: "2",
                "startTime": "May 30 2021 07:00 pm PDT",
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
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

        return dynamoDBUtils.deregisterPlayer('Player2', 'Sample Server', leagueTimes).then((data) => {
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
                    players: ['Player1'],
                    tournamentName: 'msi2021',
                    tournamentDay: '1'
                }
            }
            ]
        };
        let leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "1",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                tournamentName: "msi2021",
                tournamentDay: "2",
                "startTime": "May 30 2021 07:00 pm PDT",
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
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

        return expect(dynamoDBUtils.deregisterPlayer('Player1', 'Sample Server', leagueTimes)).rejects.toMatch('Failed to update.')
    })
})

describe('Tentative Queue', () => {
    test('When a user is not available in the tentative queue, they should be placed into the queue with their server and tournament passed.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Sample Team',
                    serverName: 'Sample Server',
                    players: ['Player2', 'Player3'],
                    tournamentName: 'msi2021',
                    tournamentDay: '1'
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
        dynamoDBUtils.tentative = [];
        return dynamoDBUtils.handleTentative('Player 1', 'Sample Server', 'msi2021').then((returnedValue) => {
            expect(returnedValue).toBeFalsy();
            expect(dynamoDBUtils.tentative.length).toBe(1);
            expect(dynamoDBUtils.tentative[0]).toEqual({
                playerName: 'Player 1',
                serverName: 'Sample Server',
                tournamentName: 'msi2021'
            });
        });
    })

    test('When a user is available in the tentative queue based on the server name and tournament, they should be removed from the queue.', () => {
        const value = {
            Items: [{
                attrs: {
                    key: 'Sample Team#Sample Server',
                    teamName: 'Sample Team',
                    serverName: 'Sample Server',
                    players: ['Player2', 'Player3'],
                    tournamentName: 'msi2021',
                    tournamentDay: '1'
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
        dynamoDBUtils.tentative = [{
            playerName: 'Player 1',
            serverName: 'Sample Server',
            tournamentName: 'msi2021'
        }];
        return dynamoDBUtils.handleTentative('Player 1', 'Sample Server', 'msi2021').then((returnedValue) => {
            expect(returnedValue).toBeTruthy();
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
                    players: ['Player1', 'Player3'],
                    tournamentName: 'msi2021',
                    tournamentDay: '1'
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
        return expect(dynamoDBUtils.handleTentative('Player1', 'Sample Server', 'msi2021')).rejects.toMatch('Failed to update.');
    })

    test('When a user is requesting to be removed from the tentative queue and they belong, they should be removed.', () => {
        dynamoDBUtils.tentative = [{
            playerName: 'Player 1',
            serverName: 'Sample Server',
            tournamentName: 'msi2021'
        }];
        dynamoDBUtils.removeFromTentative('Player 1', 'Sample Server', 'msi2021');
        expect(dynamoDBUtils.tentative.length).toEqual(0);
    })

    test('When a user is requesting to be removed from the tentative queue and they do not belong, they should not be removed.', () => {
        dynamoDBUtils.tentative = [{
            playerName: 'Player 1',
            serverName: 'Sample Server',
            tournamentName: 'msi2021'
        }];
        dynamoDBUtils.removeFromTentative('Player 2', 'Sample Server', 'msi2021');
        expect(dynamoDBUtils.tentative.length).toEqual(1);
        dynamoDBUtils.tentative.forEach((record) => {
            expect(record.playerName).toEqual('Player 1');
        })
    });

    test('When a user retrieves from the tentative queue, they filter based on the server name.', () => {
        dynamoDBUtils.tentative = [{
            playerName: 'Player 1',
            serverName: 'Sample Server',
            tournamentName: 'msi2021'
        }, {
            playerName: 'Player 2',
            serverName: 'Sample Server2',
            tournamentName: 'msi2021'
        }];
        let serverName = 'Sample Server';
        const tentativeForServer = dynamoDBUtils.getTentative(serverName);
        expect(tentativeForServer).toEqual([dynamoDBUtils.tentative[0]]);
    });
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
        dynamoDBUtils.createNewTeam('Player1', 'Sample Server', tournament, 0, (err) => {
            expect(err).toBeTruthy();
        });
    })

    test('I should be able to successfully create a team with the following details: Player Name, Server Name, Tournament Details, and Team Number', () => {
        let playerName = 'Player1';
        let serverName = 'Sample Server';
        let tournament = {
            tournamentName: 'msi2021',
            tournamentDay: 'day_2',
            startTime: '1234567'
        }
        let teamCreated = {
            teamName: 'Sample Team',
            players: [playerName],
            tournamentName: 'msi2021',
            tournamentDay: 'day_2',
            serverName: serverName
        }
        dynamoDBUtils.Team = jest.fn();
        dynamoDBUtils.Team = {
            update: jest.fn().mockImplementation((key, callback) => {
                callback(undefined, teamCreated);
            })
        }
        let teamName = `Team Abomasnow`
        let expectedBuiltTeam = {
            teamName: teamName,
            serverName: serverName,
            players: [playerName],
            tournamentName: tournament.tournamentName,
            tournamentDay: tournament.tournamentDay,
            startTime: tournament.startTime,
            key: dynamoDBUtils.getKey(teamName, serverName, tournament.tournamentName, tournament.tournamentDay)
        }
        dynamoDBUtils.createNewTeam(playerName, serverName, tournament, 0, (err, data) => {
            expect(dynamoDBUtils.Team.update).toBeCalledWith(expectedBuiltTeam, expect.any(Function));
            expect(data).toEqual(teamCreated)
        });
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
                players: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5'],
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
                players: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5'],
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
                players: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5'],
                tournamentName: 'msi2021',
                tournamentDay: 'day1'
            },
            {
                key: 'Sample Team#Sample Server#msi2021#day1',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: ['Player1', 'Player2', 'Player3'],
                tournamentName: 'msi2021',
                tournamentDay: 'day2'
            }
        ];
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: 'day1'
        }, {
            tournamentName: 'msi2021',
            tournamentDay: 'day2'
        }];
        const foundTeam = dynamoDBUtils.findFirstAvailableTeam('Player1', tournaments, JSON.parse(JSON.stringify(teams)));
        expect(foundTeam).toBeFalsy();
        3
    })

    test('I should receive a single team if a player passed does not belong to one of the tournaments and tournament days passed.', () => {
        let teams = [
            {
                key: 'Sample Team#Sample Server#msi2021#day1',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5'],
                tournamentName: 'msi2021',
                tournamentDay: 'day1'
            },
            {
                key: 'Sample Team#Sample Server#msi2021#day1',
                teamName: 'Sample Team',
                serverName: 'Sample Server',
                players: ['Player1', 'Player2', 'Player3'],
                tournamentName: 'msi2021',
                tournamentDay: 'day2'
            }
        ];
        let tournaments = [{
            tournamentName: 'msi2021',
            tournamentDay: 'day1'
        }, {
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
        }, {
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

describe('Build Tournament to Teams Map', () => {
    each([
        ['Player1', [{
            teamName: 'Team Absol',
            serverName: 'Sample Server',
            players: ['Player1', 'Player2'],
            tournamentName: 'msi2021',
            tournamentDay: '1'
        }, {
            teamName: 'Team Magma',
            serverName: 'Sample Server',
            players: ['Player1', 'Player2'],
            tournamentName: 'msi2021',
            tournamentDay: '2'
        }], 2, [0, 1], [[-1], [-1]]],
        ['Player1', [{
            teamName: 'Team Absol',
            serverName: 'Sample Server',
            players: ['Player1', 'Player2'],
            tournamentName: 'msi2021',
            tournamentDay: '1'
        }, {
            teamName: 'Team Scampy',
            serverName: 'Sample Server',
            players: undefined,
            tournamentName: 'msi2021',
            tournamentDay: '1'
        }, {
            teamName: 'Team Magma',
            serverName: 'Sample Server',
            players: ['Player1', 'Player2'],
            tournamentName: 'msi2021',
            tournamentDay: '2'
        }], 2, [0, 2], [[1], [-1]]],
        ['Player1', [{
            teamName: 'Team Absol',
            serverName: 'Sample Server',
            players: ['Player1', 'Player2'],
            tournamentName: 'msi2021',
            tournamentDay: '1'
        }, {
            teamName: 'Team Crazy Train',
            serverName: 'Sample Server',
            players: ['Player3'],
            tournamentName: 'msi2021',
            tournamentDay: '1'
        }, {
            teamName: 'Team Amber',
            serverName: 'Sample Server',
            players: undefined,
            tournamentName: 'msi2021',
            tournamentDay: '1'
        }, {
            teamName: 'Team Magma',
            serverName: 'Sample Server',
            players: ['Player1', 'Player2'],
            tournamentName: 'msi2021',
            tournamentDay: '2'
        }], 2, [0, 3], [[1, 2], [-1]]],
        ['Player1', [], 0, [-1], [[-1]]]
    ]).test('Player Name %s - Tournaments %s - Teams %s - expected number of keys %d', (playerName, teamsList, expectedNumberOfKeys, expectedTeamsCurrentlyOnIndex, expectedAvailableTeamsIndex) => {

        const map = dynamoDBUtils.buildTournamentToTeamsMap(playerName, teamsList);
        let expectedAvailableTeamsMap = [];
        for (let j = 0; j < expectedAvailableTeamsIndex.length; j++) {
            let availableTeamArray = [];
            for (const index in expectedAvailableTeamsIndex[j]) {
                if (teamsList[expectedAvailableTeamsIndex[j][index]]) {
                    availableTeamArray.push(teamsList[expectedAvailableTeamsIndex[j][index]]);
                }
            }
            expectedAvailableTeamsMap.push(availableTeamArray);
        }
        expect(map.size).toEqual(expectedNumberOfKeys);
        if (expectedNumberOfKeys) {
            let keys = map.keys();
            console.log(map);
            for (let i = 0; i < expectedTeamsCurrentlyOnIndex.length; i++) {
                let keyToUse = keys.next();
                expect(map.get(keyToUse.value).teamCurrentlyOn).toEqual(teamsList[expectedTeamsCurrentlyOnIndex[i]]);
                let expectVar = expect(map.get(keyToUse.value).availableTeams);
                if (Array.isArray(expectedAvailableTeamsMap[i]) && expectedAvailableTeamsMap[i].length > 0) expectVar.toEqual(expectedAvailableTeamsMap[i]);
                else expectVar.toBeFalsy();
            }
        }
    })
})

describe('Build register Player logic map', () => {
    test('Should be able to build a map for the Tournament to defined Teams.', () => {
        let tournament = [{tournamentName: 'msi2021', tournamentDay: '1'}, {
            tournamentName: 'msi2021',
            tournamentDay: '2'
        }];
        let tournamentToTeamMap = new Map();
        let expectedTeam = buildSampleTeam();
        let expectedTeamTwo = buildSampleTeam(undefined, undefined, 'Team Two');
        expectedTeamTwo.players = undefined;
        let expectedTeamThree = buildSampleTeam();

        tournamentToTeamMap.set(`${tournament[0].tournamentName}#${tournament[0].tournamentDay}`, {
            availableTeams: [expectedTeam, expectedTeamTwo],
            teamCurrentlyOn: expectedTeamThree
        });
        tournamentToTeamMap.set(`${tournament[1].tournamentName}#${tournament[1].tournamentDay}`, {
            availableTeams: [expectedTeam, expectedTeamTwo]
        });
        let builtMap = dynamoDBUtils.buildTeamLogic(tournament, tournamentToTeamMap);
        expect(builtMap.createNewTeam).toBeFalsy();
        expect(builtMap.teamToJoin.existingTeams).toEqual([expectedTeam]);
        expect(builtMap.teamToJoin.emptyTeams).toEqual([expectedTeamTwo]);
        expect(builtMap.currentTeams).toEqual(expectedTeamThree);
        expect(builtMap.tournamentToUse).toEqual(tournament[0]);
    })

    test('Should be able to build a map for the Tournament to defined Teams until a Tournament with available teams are found.', () => {
        let tournaments = [
            {tournamentName: 'msi2021', tournamentDay: '1'},
            {tournamentName: 'msi2021', tournamentDay: '2'}
        ];
        let tournamentToTeamMap = new Map();
        let expectedTeam = buildSampleTeam();
        let expectedTeamTwo = buildSampleTeam(undefined, undefined, 'Team Two');
        expectedTeamTwo.players = undefined;
        let expectedTeamThree = buildSampleTeam();
        let expectedTeamFour = buildSampleTeam();

        tournamentToTeamMap.set(`${tournaments[0].tournamentName}#${tournaments[0].tournamentDay}`, {
            teamCurrentlyOn: expectedTeamThree
        });
        tournamentToTeamMap.set(`${tournaments[1].tournamentName}#${tournaments[1].tournamentDay}`, {
            availableTeams: [expectedTeam, expectedTeamTwo],
            teamCurrentlyOn: expectedTeamFour
        });
        let builtMap = dynamoDBUtils.buildTeamLogic(tournaments, tournamentToTeamMap);
        expect(builtMap.createNewTeam).toBeFalsy();
        expect(builtMap.teamToJoin.existingTeams).toEqual([expectedTeam]);
        expect(builtMap.teamToJoin.emptyTeams).toEqual([expectedTeamTwo]);
        expect(builtMap.currentTeams).toEqual(expectedTeamFour);
        expect(builtMap.tournamentToUse).toEqual(tournaments[1]);
    })

    test('Should be able to build a logic map to create a new team if the tournament has no data available in the map passed.', () => {
        let tournament = [{tournamentName: 'msi2021', tournamentDay: '1'},
            {tournamentName: 'msi2021', tournamentDay: '2'}];
        let tournamentToTeamMap = new Map();
        let builtMap = dynamoDBUtils.buildTeamLogic(tournament, tournamentToTeamMap);
        expect(builtMap.createNewTeam).toBeTruthy();
        expect(builtMap.currentTeams).toHaveLength(0)
        expect(builtMap.tournamentToUse).toEqual(tournament[0]);
    })
})

test('Should return a hashkey of the team name and the server name passed.', () => {
    expect(dynamoDBUtils.getKey('Sample Team', 'Sample Server', 'msi2021', 'day1')).toEqual('Sample Team#Sample Server#msi2021#day1');
})

test('Should return a copy of the tentative users.', () => {
    dynamoDBUtils.tentative = ['Player1', 'Player2'];
    expect(dynamoDBUtils.getTentative()).toEqual(dynamoDBUtils.tentative);
})

function buildSampleTeam(players, serverName, teamName, tournamentName, tournamentDay) {
    return {
        teamName: teamName ? teamName : `Team ${randomNames[0]}`,
        serverName: serverName ? serverName : 'Sample Server',
        players: players ? players : ['Player1'],
        tournamentName: tournamentName ? tournamentName : 'msi2021',
        tournamentDay: tournamentDay ? tournamentDay : '1'
    };
}
