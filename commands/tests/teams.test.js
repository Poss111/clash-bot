const teams = require('../teams');
const dynamoDBUtils = require('../../dao/dynamo-db-impl');
const errorHandling = require('../../utility/error-handling');

jest.mock('../../dao/dynamo-db-impl');
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
        const sampleTeamTwoPlayers = [{
            key: `TestTeam#${msg.guild.name}#msi2021#2`,
            teamName: 'TestTeam',
            serverName: `${msg.guild.name}`,
            players: ['Player1', 'Player2'],
            tournamentName: 'msi2021',
            tournamentDay: '2'
        }];
        dynamoDBUtils.getTeams.mockResolvedValue(sampleTeamTwoPlayers);
        await teams.execute(msg);
        expect(messagePassed.embed.fields.length).toEqual(2);
        expect(messagePassed.embed.fields[0].name).toEqual(sampleTeamTwoPlayers[0].teamName);
        expect(messagePassed.embed.fields[0].value).toEqual(sampleTeamTwoPlayers[0].players);
        expect(messagePassed.embed.fields[1].name).toEqual('Tournament Details');
        expect(messagePassed.embed.fields[1].value).toEqual(`${sampleTeamTwoPlayers[0].tournamentName} Day ${sampleTeamTwoPlayers[0].tournamentDay}`);
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
        const sampleTeamTwoPlayers = [{
            key: `TestTeam#${msg.guild.name}#msi2021#2`,
            teamName: 'TestTeam',
            serverName: `${msg.guild.name}`,
            players: ['Player1', 'Player2'],
            tournamentName: 'msi2021',
            tournamentDay: '2'
        }, {
            key: `TestTeam#${msg.guild.name}#msi2021#3`,
            teamName: 'TestTeam',
            serverName: `${msg.guild.name}`,
            players: ['Player1'],
            tournamentName: 'msi2021',
            tournamentDay: '3'
        }];
        dynamoDBUtils.getTeams.mockResolvedValue(sampleTeamTwoPlayers);
        await teams.execute(msg);
        expect(messagePassed.embed.fields.length).toEqual(5);
        expect(messagePassed.embed.fields[0].name).toEqual(sampleTeamTwoPlayers[0].teamName);
        expect(messagePassed.embed.fields[0].value).toEqual(sampleTeamTwoPlayers[0].players);
        expect(messagePassed.embed.fields[1].name).toEqual('Tournament Details');
        expect(messagePassed.embed.fields[1].value).toEqual(`${sampleTeamTwoPlayers[0].tournamentName} Day ${sampleTeamTwoPlayers[0].tournamentDay}`);
        expect(messagePassed.embed.fields[2].name).toEqual('\u200B');
        expect(messagePassed.embed.fields[2].value).toEqual('\u200B');
        expect(messagePassed.embed.fields[3].name).toEqual(sampleTeamTwoPlayers[1].teamName);
        expect(messagePassed.embed.fields[3].value).toEqual(sampleTeamTwoPlayers[1].players);
        expect(messagePassed.embed.fields[4].name).toEqual('Tournament Details');
        expect(messagePassed.embed.fields[4].value).toEqual(`${sampleTeamTwoPlayers[1].tournamentName} Day ${sampleTeamTwoPlayers[1].tournamentDay}`);
        expect(messagePassed.embed.fields[5]).toBeFalsy();
    })

    test('When multiple teams are passed back and one is an empty player list, they should be populated as individual fields in the embedded property of the reply with their corresponding tournaments.', async () => {
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
        const sampleTeamTwoPlayers = [{
            key: `TestTeam#${msg.guild.name}#msi2021#2`,
            teamName: 'TestTeam',
            serverName: `${msg.guild.name}`,
            players: ['Player1', 'Player2'],
            tournamentName: 'msi2021',
            tournamentDay: '2'
        }, {
            key: `TestTeam#${msg.guild.name}#msi2021#3`,
            teamName: 'TestTeam',
            serverName: `${msg.guild.name}`,
            tournamentName: 'msi2021',
            tournamentDay: '3'
        }];
        dynamoDBUtils.getTeams.mockResolvedValue(sampleTeamTwoPlayers);
        await teams.execute(msg);
        expect(messagePassed.embed.fields.length).toEqual(2);
        expect(messagePassed.embed.fields[0].name).toEqual(sampleTeamTwoPlayers[0].teamName);
        expect(messagePassed.embed.fields[0].value).toEqual(sampleTeamTwoPlayers[0].players);
        expect(messagePassed.embed.fields[1].name).toEqual('Tournament Details');
        expect(messagePassed.embed.fields[1].value).toEqual(`${sampleTeamTwoPlayers[0].tournamentName} Day ${sampleTeamTwoPlayers[0].tournamentDay}`);
        expect(messagePassed.embed.fields[2]).toBeFalsy();
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
        dynamoDBUtils.getTeams.mockResolvedValue(sampleTeamTwoPlayers);
        await teams.execute(msg);
        expect(messagePassed.embed.fields.length).toEqual(1);
        expect(messagePassed.embed.fields[0].name).toEqual('No Existing Teams. Please register!');
        expect(messagePassed.embed.fields[0].value).toEqual('Emptay');
    })

    test('When undefined teams are passed back, it should be populate the not existing teams message.', async () => {
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
        dynamoDBUtils.getTeams.mockResolvedValue(undefined);
        await teams.execute(msg);
        expect(messagePassed.embed.fields.length).toEqual(1);
        expect(messagePassed.embed.fields[0].name).toEqual('No Existing Teams. Please register!');
        expect(messagePassed.embed.fields[0].value).toEqual('Emptay');
    })

    test('When a team are passed back but no players, it should be populate the not existing teams message.', async () => {
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
        const sampleTeamTwoPlayers = [{
            key: `TestTeam#${msg.guild.name}`,
            teamName: 'TestTeam',
            serverName: `${msg.guild.name}`
        }];
        dynamoDBUtils.getTeams.mockResolvedValue(sampleTeamTwoPlayers);
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
            playerName: 'Player1',
            serverName: 'Simple Server',
            tournamentName: 'msi2021'
        }];
        dynamoDBUtils.getTeams.mockResolvedValue(sampleTeamTwoPlayers);
        dynamoDBUtils.getTentative.mockReturnValue(sampleTentativeList);
        await teams.execute(msg);
        expect(dynamoDBUtils.getTentative).toBeCalledWith(msg.guild.name);
        expect(messagePassed.embed.fields.length).toEqual(2);
        expect(messagePassed.embed.fields[0].name).toEqual('No Existing Teams. Please register!');
        expect(messagePassed.embed.fields[0].value).toEqual('Emptay');
        expect(messagePassed.embed.fields[1].name).toEqual('Tentative Queue');
        expect(messagePassed.embed.fields[1].value).toEqual(`${sampleTentativeList[0].tournamentName} -> ${sampleTentativeList[0].playerName}`);
    })

    test('When tentative players and a team are passed back, it should populate the tentative list with the existing team.', async () => {
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
        const sampleTeamTwoPlayers = [{
            key: `TestTeam#${msg.guild.name}`,
            teamName: 'TestTeam',
            serverName: `${msg.guild.name}`,
            players: ['Player1', 'Player2']
        }];        
        const sampleTentativeList = [{
            playerName: 'Player1',
            serverName: 'Simple Server',
            tournamentName: 'msi2021'
        }];
        dynamoDBUtils.getTeams.mockResolvedValue(sampleTeamTwoPlayers);
        dynamoDBUtils.getTentative.mockReturnValue(sampleTentativeList);
        await teams.execute(msg);
        expect(dynamoDBUtils.getTentative).toBeCalledWith(msg.guild.name);
        expect(messagePassed.embed.fields.length).toEqual(3);
        expect(messagePassed.embed.fields[0].name).toEqual(sampleTeamTwoPlayers[0].teamName);
        expect(messagePassed.embed.fields[0].value).toEqual(sampleTeamTwoPlayers[0].players);
        expect(messagePassed.embed.fields[1].name).toEqual('Tournament Details');
        expect(messagePassed.embed.fields[1].value).toEqual(`${sampleTeamTwoPlayers[0].tournamentName} Day ${sampleTeamTwoPlayers[0].tournamentDay}`);
        expect(messagePassed.embed.fields[2].name).toEqual('Tentative Queue');
        expect(messagePassed.embed.fields[2].value).toEqual(`${sampleTentativeList[0].tournamentName} -> ${sampleTentativeList[0].playerName}`);
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
        const sampleTeamTwoPlayers = [{
            key: `TestTeam#${msg.guild.name}`,
            teamName: 'TestTeam',
            serverName: `${msg.guild.name}`,
            players: ['Player1', 'Player2']
        }];
        const sampleTentativeList = [{
            playerName: 'Player1',
            serverName: 'Simple Server',
            tournamentName: 'msi2021'
        },{
            playerName: 'Player2',
            serverName: 'Simple Server',
            tournamentName: 'msi2021'
        },{
            playerName: 'Player1',
            serverName: 'Simple Server',
            tournamentName: 'msi2022'
        },{
            playerName: 'Player2',
            serverName: 'Simple Server',
            tournamentName: 'msi2023'
        }];
        dynamoDBUtils.getTeams.mockResolvedValue(sampleTeamTwoPlayers);
        dynamoDBUtils.getTentative.mockReturnValue(sampleTentativeList);
        await teams.execute(msg);
        let expectedMessage = '';
        const reduce = sampleTentativeList.reduce((acc, value) => {
            if (!acc[value.tournamentName]) {
                acc[value.tournamentName] = []
            }
            acc[value.tournamentName].push(value.playerName);
            return acc;
        }, {});
        const keys = Object.keys(reduce);
        for (let i = 0; i < keys.length; i++) {
            expectedMessage = expectedMessage.concat(`${keys[i]} -> ${reduce[keys[i]]}`);
            if (i < keys.length - 1) {
                expectedMessage = expectedMessage.concat('\n');
            }
        }
        expect(dynamoDBUtils.getTentative).toBeCalledWith(msg.guild.name);
        expect(messagePassed.embed.fields.length).toEqual(3);
        expect(messagePassed.embed.fields[0].name).toEqual(sampleTeamTwoPlayers[0].teamName);
        expect(messagePassed.embed.fields[0].value).toEqual(sampleTeamTwoPlayers[0].players);
        expect(messagePassed.embed.fields[1].name).toEqual('Tournament Details');
        expect(messagePassed.embed.fields[1].value).toEqual(`${sampleTeamTwoPlayers[0].tournamentName} Day ${sampleTeamTwoPlayers[0].tournamentDay}`);
        expect(messagePassed.embed.fields[2].name).toEqual('Tentative Queue');
        expect(messagePassed.embed.fields[2].value).toEqual(expectedMessage);
    })
})

test('If an error occurs, the error handler will be invoked.', async () => {
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
    dynamoDBUtils.getTeams.mockRejectedValue('Some error occurred.');
    await teams.execute(msg);
    expect(errorHandling.handleError.mock.calls.length).toEqual(1);
})
