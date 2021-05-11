const teams = require('../teams');
const dynamoDBUtils = require('../../dao/dynamo-db-impl');
const errorHandling = require('../../utility/error-handling');

jest.mock('../../dao/dynamo-db-impl');
jest.mock('../../utility/error-handling');

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
        key: `TestTeam#${msg.guild.name}`,
        teamName: 'TestTeam',
        serverName: `${msg.guild.name}`,
        players: ['Player1', 'Player2']
    }];
    dynamoDBUtils.getTeams.mockResolvedValue(sampleTeamTwoPlayers);
    await teams.execute(msg);
    expect(messagePassed.embed.fields.length).toEqual(1);
    expect(messagePassed.embed.fields[0].name).toEqual(sampleTeamTwoPlayers[0].teamName);
    expect(messagePassed.embed.fields[0].value).toEqual(sampleTeamTwoPlayers[0].players);
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
    const sampleTentativeList = ['Player1'];
    dynamoDBUtils.getTeams.mockResolvedValue(sampleTeamTwoPlayers);
    dynamoDBUtils.getTentative.mockReturnValue(sampleTentativeList);
    await teams.execute(msg);
    expect(messagePassed.embed.fields.length).toEqual(2);
    expect(messagePassed.embed.fields[0].name).toEqual('No Existing Teams. Please register!');
    expect(messagePassed.embed.fields[0].value).toEqual('Emptay');
    expect(messagePassed.embed.fields[1].name).toEqual('Tentative Queue');
    expect(messagePassed.embed.fields[1].value).toEqual(sampleTentativeList);
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
    const sampleTentativeList = ['Player1'];
    dynamoDBUtils.getTeams.mockResolvedValue(sampleTeamTwoPlayers);
    dynamoDBUtils.getTentative.mockReturnValue(sampleTentativeList);
    await teams.execute(msg);
    expect(messagePassed.embed.fields.length).toEqual(2);
    expect(messagePassed.embed.fields[0].name).toEqual(sampleTeamTwoPlayers[0].teamName);
    expect(messagePassed.embed.fields[0].value).toEqual(sampleTeamTwoPlayers[0].players);
    expect(messagePassed.embed.fields[1].name).toEqual('Tentative Queue');
    expect(messagePassed.embed.fields[1].value).toEqual(sampleTentativeList);
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
