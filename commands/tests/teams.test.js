const teams = require('../teams');
const dynamoDBUtils = require('../../dao/dynamo-db-impl');
const errorHandling = require('../../utility/error-handling');

jest.mock('../../dao/dynamo-db-impl');
jest.mock('../../utility/error-handling');

test('When a team is passed back, it should be populated as a field in the embedded property of the reply.', (done) => {
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
    function callback() {
        try {
            expect(messagePassed.embed.fields.length).toEqual(1);
            expect(messagePassed.embed.fields[0].name).toEqual(sampleTeamTwoPlayers[0].teamName);
            expect(messagePassed.embed.fields[0].value).toEqual(sampleTeamTwoPlayers[0].players);
            done();
        } catch(error) {
            done(error);
        }
    }
    dynamoDBUtils.getTeams.mockResolvedValue(sampleTeamTwoPlayers);
    teams.execute(msg, callback);
})

test('When no teams are passed back, it should be populate the not existing teams message.', (done) => {
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
    function callback() {
        try {
            expect(messagePassed.embed.fields.length).toEqual(1);
            expect(messagePassed.embed.fields[0].name).toEqual('No Existing Teams. Please register!');
            expect(messagePassed.embed.fields[0].value).toEqual('Emptay');
            done();
        } catch(error) {
            done(error);
        }
    }
    dynamoDBUtils.getTeams.mockResolvedValue(sampleTeamTwoPlayers);
    teams.execute(msg, callback);
})

test('When undefined teams are passed back, it should be populate the not existing teams message.', (done) => {
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
    function callback() {
        try {
            expect(messagePassed.embed.fields.length).toEqual(1);
            expect(messagePassed.embed.fields[0].name).toEqual('No Existing Teams. Please register!');
            expect(messagePassed.embed.fields[0].value).toEqual('Emptay');
            done();
        } catch(error) {
            done(error);
        }
    }
    dynamoDBUtils.getTeams.mockResolvedValue(undefined);
    teams.execute(msg, callback);
})

test('When a team are passed back but no players, it should be populate the not existing teams message.', (done) => {
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
    function callback() {
        try {
            expect(messagePassed.embed.fields.length).toEqual(1);
            expect(messagePassed.embed.fields[0].name).toEqual('No Existing Teams. Please register!');
            expect(messagePassed.embed.fields[0].value).toEqual('Emptay');
            done();
        } catch(error) {
            done(error);
        }
    }
    dynamoDBUtils.getTeams.mockResolvedValue(sampleTeamTwoPlayers);
    teams.execute(msg, callback);
})

test('When tentative players and no teams are passed back, it should populate the tentative list with an empty teams message.', (done) => {
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
    function callback() {
        try {
            expect(messagePassed.embed.fields.length).toEqual(2);
            expect(messagePassed.embed.fields[0].name).toEqual('No Existing Teams. Please register!');
            expect(messagePassed.embed.fields[0].value).toEqual('Emptay');
            expect(messagePassed.embed.fields[1].name).toEqual('Tentative Queue');
            expect(messagePassed.embed.fields[1].value).toEqual(sampleTentativeList);
            done();
        } catch(error) {
            done(error);
        }
    }
    dynamoDBUtils.getTeams.mockResolvedValue(sampleTeamTwoPlayers);
    dynamoDBUtils.getTentative.mockReturnValue(sampleTentativeList);
    teams.execute(msg, callback);
})

test('When tentative players and a team are passed back, it should populate the tentative list with the existing team.', (done) => {
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
    function callback() {
        try {
            expect(messagePassed.embed.fields.length).toEqual(2);
            expect(messagePassed.embed.fields[0].name).toEqual(sampleTeamTwoPlayers[0].teamName);
            expect(messagePassed.embed.fields[0].value).toEqual(sampleTeamTwoPlayers[0].players);
            expect(messagePassed.embed.fields[1].name).toEqual('Tentative Queue');
            expect(messagePassed.embed.fields[1].value).toEqual(sampleTentativeList);
            done();
        } catch(error) {
            done(error);
        }
    }
    dynamoDBUtils.getTeams.mockResolvedValue(sampleTeamTwoPlayers);
    dynamoDBUtils.getTentative.mockReturnValue(sampleTentativeList);
    teams.execute(msg, callback);
})

test('If an error occurs, the error handler will be invoked.', (done) => {
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
    function callback() {
        try {
            done();
        } catch(error) {
            expect(errorHandling.mock.calls.length).toEqual(1);
            done(error);
        }
    }
    dynamoDBUtils.getTeams.mockRejectedValue('Some error occurred.');
    teams.execute(msg, callback);
})
