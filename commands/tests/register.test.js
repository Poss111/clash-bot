const register = require('../register');
const dynamoDBUtils = require('../../dao/dynamo-db-impl');
const errorHandling = require('../../utility/error-handling');
const leagueApi = require('../../utility/LeagueApi');

jest.mock('../../dao/dynamo-db-impl');
jest.mock('../../utility/error-handling');
jest.mock('../../utility/LeagueApi');

test('If a user is successfully register, then a reply stating the Team that the User has been registered to should be returned.', async () => {
    let messagePassed = '';
    let sendMessage = '';
    let msg = {
        reply: (value) => messagePassed = value,
        channel: {
            send: (value) => sendMessage = value
        },
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    LeagueApi.leagueTimes = [
        {
            "name": "msi2021",
            "nameSecondary": "day_3",
            "startTime": "May 29 2021 07:00 pm PDT",
            "registrationTime": "May 29 2021 04:15 pm PDT"
        },
        {
            "name": "msi2021",
            "nameSecondary": "day_4",
            "startTime": "May 30 2021 07:00 pm PDT",
            "registrationTime": "May 30 2021 04:15 pm PDT"
        }
    ];
    const sampleRegisterReturn = {teamName: 'SampleTeam', players: [msg.author.username, 'Player2'], tournament: 'msi2021', tournamentDay: '3'};
    dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
    await register.execute(msg);
    expect(sendMessage).toEqual(`Registering ${msg.author.username}...`);
    expect(messagePassed.embed.fields[0].name).toEqual(sampleRegisterReturn.tournament);
    expect(messagePassed.embed.fields[0].value).toEqual(sampleRegisterReturn.tournamentDay);
    expect(messagePassed.embed.fields[1].name).toEqual(sampleRegisterReturn.teamName);
    expect(messagePassed.embed.fields[1].value).toEqual(sampleRegisterReturn.players);
})

test('If a user requests a specific tournament that does not exist, they should receive a response letting them know we were unable to find a tournament.', async () => {
    let messagePassed = '';
    let sendMessage = '';
    let msg = {
        reply: (value) => messagePassed = value,
        channel: {
            send: (value) => sendMessage = value
        },
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    leagueApi.leagueTimes = [
        {
            "name": "msi2021",
            "nameSecondary": "day_3",
            "startTime": "May 29 2021 07:00 pm PDT",
            "registrationTime": "May 29 2021 04:15 pm PDT"
        },
        {
            "name": "msi2021",
            "nameSecondary": "day_4",
            "startTime": "May 30 2021 07:00 pm PDT",
            "registrationTime": "May 30 2021 04:15 pm PDT"
        }
    ];
    const sampleRegisterReturn = {teamName: 'SampleTeam', players: [msg.author.username, 'Player2'], tournament: 'msi2021', tournamentDay: '3'};
    dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
    const args = ['dne'];
    await register.execute(msg, args);
    expect(sendMessage).toEqual(`Registering ${msg.author.username} for Tournament ${args[0]}...`);
    expect(messagePassed).toEqual(`We were unable to find a tournament for the following name given => ${args[0]}. Please try again.`)
})

test('If a user requests a specific tournament that exists, they should be signed up for that specific tournament.', async () => {
    let messagePassed = '';
    let sendMessage = '';
    let msg = {
        reply: (value) => messagePassed = value,
        channel: {
            send: (value) => sendMessage = value
        },
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    leagueApi.leagueTimes = [
        {
            "name": "msi2021",
            "nameSecondary": "day_3",
            "startTime": "May 29 2021 07:00 pm PDT",
            "registrationTime": "May 29 2021 04:15 pm PDT"
        },
        {
            "name": "msi2021",
            "nameSecondary": "day_4",
            "startTime": "May 30 2021 07:00 pm PDT",
            "registrationTime": "May 30 2021 04:15 pm PDT"
        }
    ];
    leagueApi.findTournament = jest.fn().mockReturnValue(leagueApi.leagueTimes[0]);
    const sampleRegisterReturn = {teamName: 'SampleTeam', players: [msg.author.username, 'Player2'], tournament: 'msi2021', tournamentDay: 'day_3'};
    dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
    const args = ['msi2021'];
    await register.execute(msg, args);
    expect(sendMessage).toEqual(`Registering ${msg.author.username} for Tournament ${args[0]}...`);
    expect(messagePassed.embed.fields[0].name).toEqual(sampleRegisterReturn.tournament);
    expect(messagePassed.embed.fields[0].value).toEqual(sampleRegisterReturn.tournamentDay);
    expect(messagePassed.embed.fields[1].name).toEqual(sampleRegisterReturn.teamName);
    expect(messagePassed.embed.fields[1].value).toEqual(sampleRegisterReturn.players);
})

test('The user should be able to pass the tournament and day that they want to be registered towards.', async() => {
    let messagePassed = '';
    let sendMessage = '';
    let msg = {
        reply: (value) => messagePassed = value,
        channel: {
            send: (value) => sendMessage = value
        },
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    const args = ['shurima2021','1'];
    const sampleRegisterReturn = { teamName: 'SampleTeam', players: [msg.author.username, 'Player2'], tournament: args[0], tournamentDay: args[1]};
    dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
    await register.execute(msg, args);
    expect(sendMessage).toEqual(`Registering ${msg.author.username}...`);
    expect(messagePassed.embed.fields[0].name).toEqual(args[0]);
    expect(messagePassed.embed.fields[0].value).toEqual(args[1]);
    expect(messagePassed.embed.fields[1].name).toEqual(sampleRegisterReturn.teamName);
    expect(messagePassed.embed.fields[1].value).toEqual(sampleRegisterReturn.players);
})

test('If a user is already on a team, then a reply stating the Team that the User has been registered to should be returned.',  async () => {
    let messagePassed = '';
    let sendMessage = '';
    let msg = {
        reply: (value) => messagePassed = value,
        channel: {
            send: (value) => sendMessage = value
        },
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    const args = ['shurima2021','1'];
    const sampleRegisterReturn = { exist: true, teamName: 'ExistingTeam', players: [msg.author.username, 'Player2'], tournament: args[0], tournamentDay: args[1]};
    dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
    await register.execute(msg);
    expect(sendMessage).toEqual(`Registering ${msg.author.username}...`);
    expect(messagePassed).toEqual(`You are already registered to ${sampleRegisterReturn.teamName} for Tournament ${sampleRegisterReturn.tournament} Day ${sampleRegisterReturn.tournamentDay} your Team consists so far of ${sampleRegisterReturn.players}`);
})

test('If an error occurs, the error handler will be invoked.',  async () => {
    let messagePassed = '';
    let sendMessage = '';
    errorHandling.handleError = jest.fn();
    let msg = {
        reply: (value) => messagePassed = value,
        channel: {
            send: (value) => sendMessage = value
        },
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    dynamoDBUtils.registerPlayer.mockRejectedValue('Some error occurred.');
    await register.execute(msg);
    expect(sendMessage).toEqual(`Registering ${msg.author.username}...`);
    expect(errorHandling.handleError.mock.calls.length).toEqual(1);
})
