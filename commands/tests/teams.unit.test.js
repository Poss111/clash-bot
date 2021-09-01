const teams = require('../teams');
const clashBotTeamsServiceImpl = require('../../services/teams-service-impl');
const tentativeServiceImpl = require('../../services/tentative-service-impl');
const errorHandling = require('../../utility/error-handling');

jest.mock('../../dao/clash-teams-db-impl');
jest.mock('../../services/teams-service-impl');
jest.mock('../../services/tentative-service-impl');
jest.mock('../../utility/error-handling');

describe('Retrieve Teams', () => {
    test('When a team is passed back, it should be populated as a field in the embedded property of the reply.', async () => {
        let messagePassed = '';
        let msg = {
            reply: (value) => messagePassed = value,
            author: {
                username: 'TestPlayer'
            },
            guild: {
                name: 'TestServer'
            }
        };
        const sampleTeamTwoPlayers = [
            {
                teamName: 'Team Abra',
                playersDetails: [
                    {
                        name: 'Roïdräge',
                        champions: ['Volibear', 'Ornn', 'Sett'],
                        role: 'Top'
                    },
                    {
                        name: 'TheIncentive',
                        champions: ['Lucian'],
                        role: 'ADC'
                    },
                    {
                        name: 'Pepe Conrad',
                        champions: ['Lucian'],
                        role: 'Jg'
                    }
                ],
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '1'
                }
            }
        ];
        clashBotTeamsServiceImpl.retrieveActiveTeamsForServer.mockResolvedValue(JSON.parse(JSON.stringify(sampleTeamTwoPlayers)));
        await teams.execute(msg);
        expect(messagePassed.embed.fields.length).toEqual(2);
        expect(messagePassed.embed.fields[0].name).toEqual(sampleTeamTwoPlayers[0].teamName);
        expect(messagePassed.embed.fields[0].value).toEqual(sampleTeamTwoPlayers[0].playersDetails.map(record => record.name));
        expect(messagePassed.embed.fields[1].name).toEqual('Tournament Details');
        expect(messagePassed.embed.fields[1].value).toEqual(`${sampleTeamTwoPlayers[0].tournamentDetails.tournamentName} Day ${sampleTeamTwoPlayers[0].tournamentDetails.tournamentDay}`);
    })

    test('When multiple teams are passed back, they should be populated as individual fields in the embedded property of the reply with their corresponding tournaments.', async () => {
        let messagePassed = '';
        let msg = {
            reply: (value) => messagePassed = value,
            author: {
                username: 'TestPlayer'
            },
            guild: {
                name: 'TestServer'
            }
        };
        const sampleTeamTwoPlayers = [
            {
                teamName: 'Team Abra',
                playersDetails: [
                    {
                        name: 'Roïdräge',
                        champions: ['Volibear', 'Ornn', 'Sett'],
                        role: 'Top'
                    },
                    {
                        name: 'TheIncentive',
                        champions: ['Lucian'],
                        role: 'ADC'
                    },
                    {
                        name: 'Pepe Conrad',
                        champions: ['Lucian'],
                        role: 'Jg'
                    }
                ],
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '1'
                }
            },
            {
                teamName: 'Team Charizard',
                playersDetails: [
                    {
                        name: 'Shiragaku',
                        champions: ['Volibear', 'Ornn', 'Sett'],
                        role: 'Top'
                    }
                ],
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '1'
                }
            }
        ];
        clashBotTeamsServiceImpl.retrieveActiveTeamsForServer.mockResolvedValue(JSON.parse(JSON.stringify(sampleTeamTwoPlayers)));
        await teams.execute(msg);
        expect(messagePassed.embed.fields.length).toEqual(5);
        expect(messagePassed.embed.fields[0].name).toEqual(sampleTeamTwoPlayers[0].teamName);
        expect(messagePassed.embed.fields[0].value).toEqual(sampleTeamTwoPlayers[0].playersDetails.map(record => record.name));
        expect(messagePassed.embed.fields[1].name).toEqual('Tournament Details');
        expect(messagePassed.embed.fields[1].value).toEqual(`${sampleTeamTwoPlayers[0].tournamentDetails.tournamentName} Day ${sampleTeamTwoPlayers[0].tournamentDetails.tournamentDay}`);
        expect(messagePassed.embed.fields[2].name).toEqual('\u200B');
        expect(messagePassed.embed.fields[2].value).toEqual('\u200B');
        expect(messagePassed.embed.fields[3].name).toEqual(sampleTeamTwoPlayers[1].teamName);
        expect(messagePassed.embed.fields[3].value).toEqual(sampleTeamTwoPlayers[1].playersDetails.map(record => record.name));
        expect(messagePassed.embed.fields[4].name).toEqual('Tournament Details');
        expect(messagePassed.embed.fields[4].value).toEqual(`${sampleTeamTwoPlayers[1].tournamentDetails.tournamentName} Day ${sampleTeamTwoPlayers[1].tournamentDetails.tournamentDay}`);
        expect(messagePassed.embed.fields[5]).toBeFalsy();
    })

    test('When no teams are passed back, it should be populate the not existing teams message.', async () => {
        let messagePassed = '';
        let msg = {
            reply: (value) => messagePassed = value,
            author: {
                username: 'TestPlayer'
            },
            guild: {
                name: 'TestServer'
            }
        };
        const sampleTeamTwoPlayers = [];
        clashBotTeamsServiceImpl.retrieveActiveTeamsForServer.mockResolvedValue(sampleTeamTwoPlayers);
        await teams.execute(msg);
        expect(messagePassed.embed.fields.length).toEqual(1);
        expect(messagePassed.embed.fields[0].name).toEqual('No Existing Teams. Please register!');
        expect(messagePassed.embed.fields[0].value).toEqual('Emptay');
    })

    test('When tentative players and no teams are passed back, it should populate the tentative list with an empty teams message.', async () => {
        let messagePassed = '';
        let msg = {
            reply: (value) => messagePassed = value,
            author: {
                username: 'TestPlayer'
            },
            guild: {
                name: 'TestServer'
            }
        };
        const sampleTeamTwoPlayers = [];
        const sampleTentativeList = [{
            serverName: msg.guild.name,
            tournamentDetails: {
                tournamentName: 'awesome_sauce',
                tournamentDay: '1'
            },
            tentativePlayers: ['Roidrage']
        }];
        clashBotTeamsServiceImpl.retrieveActiveTeamsForServer.mockResolvedValue(sampleTeamTwoPlayers);
        tentativeServiceImpl.retrieveTentativeListForServer.mockResolvedValue(sampleTentativeList);
        await teams.execute(msg);
        expect(tentativeServiceImpl.retrieveTentativeListForServer).toBeCalledWith(msg.guild.name);
        expect(messagePassed.embed.fields.length).toEqual(2);
        expect(messagePassed.embed.fields[0].name).toEqual('No Existing Teams. Please register!');
        expect(messagePassed.embed.fields[0].value).toEqual('Emptay');
        expect(messagePassed.embed.fields[1].name).toEqual('Tentative Queue');
        expect(messagePassed.embed.fields[1].value).toEqual(`${sampleTentativeList[0].tournamentDetails.tournamentName} - ${sampleTentativeList[0].tournamentDetails.tournamentDay} -> ${sampleTentativeList[0].tentativePlayers}`);
    })

    test('When multiple tentative players and a team are passed back, it should populate the tentative list with the existing team based on all the tournaments.', async () => {
        let messagePassed = '';
        let msg = {
            reply: (value) => messagePassed = value,
            author: {
                username: 'TestPlayer'
            },
            guild: {
                name: 'TestServer'
            }
        };
        const sampleTeamTwoPlayers = [
            {
                teamName: 'Team Abra',
                playersDetails: [
                    {
                        name: 'Roïdräge',
                        champions: ['Volibear', 'Ornn', 'Sett'],
                        role: 'Top'
                    },
                    {
                        name: 'TheIncentive',
                        champions: ['Lucian'],
                        role: 'ADC'
                    },
                    {
                        name: 'Pepe Conrad',
                        champions: ['Lucian'],
                        role: 'Jg'
                    }
                ],
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '1'
                }
            }
        ];
        const sampleTentativeList = [{
            serverName: msg.guild.name,
            tournamentDetails: {
                tournamentName: 'awesome_sauce',
                tournamentDay: '1'
            },
            tentativePlayers: ['Roidrage']
        }, {
            serverName: msg.guild.name,
            tournamentDetails: {
                tournamentName: 'awesome_sauce',
                tournamentDay: '2'
            },
            tentativePlayers: ['TheIncentive']
        }];
        clashBotTeamsServiceImpl.retrieveActiveTeamsForServer.mockResolvedValue(sampleTeamTwoPlayers);
        tentativeServiceImpl.retrieveTentativeListForServer.mockReturnValue(sampleTentativeList);
        await teams.execute(msg);
        let expectedMessage = '';
        const reduce = sampleTentativeList.reduce((acc, value) => {
            if (!acc[`${value.tournamentDetails.tournamentName} - ${value.tournamentDetails.tournamentDay}`]) {
                acc[`${value.tournamentDetails.tournamentName} - ${value.tournamentDetails.tournamentDay}`] = []
            }
            acc[`${value.tournamentDetails.tournamentName} - ${value.tournamentDetails.tournamentDay}`].push(value.tentativePlayers);
            return acc;
        }, {});
        const keys = Object.keys(reduce);
        for (let i = 0; i < keys.length; i++) {
            expectedMessage = expectedMessage.concat(`${keys[i]} -> ${reduce[keys[i]]}`);
            if (i < keys.length - 1) {
                expectedMessage = expectedMessage.concat('\n');
            }
        }
        expect(tentativeServiceImpl.retrieveTentativeListForServer).toBeCalledWith(msg.guild.name);
        expect(messagePassed.embed.fields.length).toEqual(3);
        expect(messagePassed.embed.fields[0].name).toEqual(sampleTeamTwoPlayers[0].teamName);
        expect(messagePassed.embed.fields[0].value).toEqual(sampleTeamTwoPlayers[0].playersDetails.map(record => record.name));
        expect(messagePassed.embed.fields[1].name).toEqual('Tournament Details');
        expect(messagePassed.embed.fields[1].value).toEqual(`${sampleTeamTwoPlayers[0].tournamentDetails.tournamentName} Day ${sampleTeamTwoPlayers[0].tournamentDetails.tournamentDay}`);
        expect(messagePassed.embed.fields[2].name).toEqual('Tentative Queue');
        expect(messagePassed.embed.fields[2].value).toEqual(expectedMessage);
    })

    test('When multiple tentative players and a team are passed back and some have empty Tentative Player lists, it should populate the tentative list with the existing team based on all the tournaments.', async () => {
        let messagePassed = '';
        let msg = {
            reply: (value) => messagePassed = value,
            author: {
                username: 'TestPlayer'
            },
            guild: {
                name: 'TestServer'
            }
        };
        const sampleTeamTwoPlayers = [
            {
                teamName: 'Team Abra',
                playersDetails: [
                    {
                        name: 'Roïdräge',
                        champions: ['Volibear', 'Ornn', 'Sett'],
                        role: 'Top'
                    },
                    {
                        name: 'TheIncentive',
                        champions: ['Lucian'],
                        role: 'ADC'
                    },
                    {
                        name: 'Pepe Conrad',
                        champions: ['Lucian'],
                        role: 'Jg'
                    }
                ],
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '1'
                }
            }
        ];
        let sampleTentativeList = [{
            serverName: msg.guild.name,
            tournamentDetails: {
                tournamentName: 'awesome_sauce',
                tournamentDay: '1'
            },
            tentativePlayers: ['Roidrage']
        }, {
            serverName: msg.guild.name,
            tournamentDetails: {
                tournamentName: 'awesome_sauce',
                tournamentDay: '2'
            },
            tentativePlayers: ['TheIncentive']
        }, {
            serverName: msg.guild.name,
            tournamentDetails: {
                tournamentName: 'awesome_sauce',
                tournamentDay: '2'
            },
            tentativePlayers: []
        }];
        clashBotTeamsServiceImpl.retrieveActiveTeamsForServer.mockResolvedValue(sampleTeamTwoPlayers);
        tentativeServiceImpl.retrieveTentativeListForServer.mockReturnValue(sampleTentativeList);
        sampleTentativeList = JSON.parse(JSON.stringify(sampleTentativeList.filter(record => record.tentativePlayers.length > 0)));
        await teams.execute(msg);
        let expectedMessage = '';
        const reduce = sampleTentativeList.reduce((acc, value) => {
            const key = `${value.tournamentDetails.tournamentName} - ${value.tournamentDetails.tournamentDay}`;
            if (!acc[key]) {
                acc[key] = []
            }
            acc[key].push(value.tentativePlayers);
            return acc;
        }, {});
        const keys = Object.keys(reduce);
        for (let i = 0; i < keys.length; i++) {
            expectedMessage = expectedMessage.concat(`${keys[i]} -> ${reduce[keys[i]]}`);
            if (i < keys.length - 1) {
                expectedMessage = expectedMessage.concat('\n');
            }
        }
        expect(tentativeServiceImpl.retrieveTentativeListForServer).toBeCalledWith(msg.guild.name);
        expect(messagePassed.embed.fields.length).toEqual(3);
        expect(messagePassed.embed.fields[0].name).toEqual(sampleTeamTwoPlayers[0].teamName);
        expect(messagePassed.embed.fields[0].value).toEqual(sampleTeamTwoPlayers[0].playersDetails.map(record => record.name));
        expect(messagePassed.embed.fields[1].name).toEqual('Tournament Details');
        expect(messagePassed.embed.fields[1].value).toEqual(`${sampleTeamTwoPlayers[0].tournamentDetails.tournamentName} Day ${sampleTeamTwoPlayers[0].tournamentDetails.tournamentDay}`);
        expect(messagePassed.embed.fields[2].name).toEqual('Tentative Queue');
        expect(messagePassed.embed.fields[2].value).toEqual(expectedMessage);
    })
})

test('Error - clashBotTeamsServiceImpl.retrieveActiveTeamsForServer - If an error occurs, the error handler will be invoked.', async () => {
    errorHandling.handleError = jest.fn();
    let messagePassed = '';
    let msg = {
        reply: (value) => messagePassed = value,
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    clashBotTeamsServiceImpl.retrieveActiveTeamsForServer.mockRejectedValue('Some error occurred.');
    await teams.execute(msg);
    expect(errorHandling.handleError.mock.calls.length).toEqual(1);
})

test('Error - tentativeServiceImpl.retrieveTentativeListForServer - If an error occurs, the error handler will be invoked.', async () => {
    errorHandling.handleError = jest.fn();
    let messagePassed = '';
    let msg = {
        reply: (value) => messagePassed = value,
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    tentativeServiceImpl.retrieveTentativeListForServer.mockRejectedValue('Some error occurred.');
    await teams.execute(msg);
    expect(errorHandling.handleError.mock.calls.length).toEqual(1);
})
