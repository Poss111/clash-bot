const register = require('../register');
const dynamoDBUtils = require('../../dao/dynamo-db-impl');
const errorHandling = require('../../utility/error-handling');
const leagueApi = require('../../utility/LeagueApi');

jest.mock('../../dao/dynamo-db-impl');
jest.mock('../../utility/error-handling');
jest.mock('../../utility/LeagueApi');

function verifyReply(messagePassed, sampleRegisterReturn) {
    expect(messagePassed.embed.fields[0].name).toEqual(sampleRegisterReturn.teamName);
    expect(messagePassed.embed.fields[0].value).toEqual(sampleRegisterReturn.players);
    expect(messagePassed.embed.fields[1].name).toEqual('Tournament Details');
    expect(messagePassed.embed.fields[1].value).toEqual(`${sampleRegisterReturn.tournamentName} Day ${sampleRegisterReturn.tournamentDay}`);
}

function verifyRedundantRegistration(messagePassed, sampleRegisterReturn) {
    expect(messagePassed.embed.description).toEqual(`You are already registered to the following Teams.`);
    let counter;
    for (counter = 0; counter < sampleRegisterReturn.length * 3; counter += 3) {
        expect(messagePassed.embed.fields[counter].name).toEqual(sampleRegisterReturn[counter / 3].teamName);
        expect(messagePassed.embed.fields[counter].value).toEqual(sampleRegisterReturn[counter / 3].players);
        expect(messagePassed.embed.fields[counter + 1].name).toEqual('Tournament Details');
        expect(messagePassed.embed.fields[counter + 1].value).toEqual(`${sampleRegisterReturn[counter / 3].tournamentName} Day ${sampleRegisterReturn[counter / 3].tournamentDay}`);
        if (counter / 3 < sampleRegisterReturn.length - 1) {
            expect(messagePassed.embed.fields[counter + 2].name).toEqual('\u200B');
            expect(messagePassed.embed.fields[counter + 2].value).toEqual('\u200B');
        } else {
            expect(messagePassed.embed.fields[counter + 2]).toBeFalsy();
        }
    }
}

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
    let leagueTimes = [
        {
            tournamentName: "msi2021",
            tournamentDay: "day_3",
            "startTime": "May 29 2021 07:00 pm PDT",
            "registrationTime": "May 29 2021 04:15 pm PDT"
        },
        {
            tournamentName: "msi2021",
            tournamentDay: "day_4",
            "startTime": "May 30 2021 07:00 pm PDT",
            "registrationTime": "May 30 2021 04:15 pm PDT"
        }
    ];
    leagueApi.findTournament = jest.fn().mockReturnValue(leagueTimes);
    const sampleRegisterReturn = {teamName: 'SampleTeam', players: [msg.author.username, 'Player2'], tournamentName: 'msi2021', tournamentDay: '3'};
    dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
    await register.execute(msg);

    expect(dynamoDBUtils.registerPlayer).toBeCalledWith(msg.author.username, msg.guild.name, leagueTimes);
    expect(sendMessage).toEqual(`Registering ${msg.author.username} for the first available tournament you are not already registered to...`);
    verifyReply(messagePassed, sampleRegisterReturn);
})

test('If a user is successfully register with an empty array for args, then a reply stating the Team that the User has been registered to should be returned.', async () => {
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
    let leagueTimes = [
        {
            tournamentName: "msi2021",
            tournamentDay: "day_3",
            "startTime": "May 29 2021 07:00 pm PDT",
            "registrationTime": "May 29 2021 04:15 pm PDT"
        },
        {
            tournamentName: "msi2021",
            tournamentDay: "day_4",
            "startTime": "May 30 2021 07:00 pm PDT",
            "registrationTime": "May 30 2021 04:15 pm PDT"
        }
    ];
    leagueApi.findTournament = jest.fn().mockReturnValue(leagueTimes);
    const sampleRegisterReturn = {teamName: 'SampleTeam', players: [msg.author.username, 'Player2'], tournamentName: 'msi2021', tournamentDay: '3'};
    dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
    await register.execute(msg, []);

    expect(dynamoDBUtils.registerPlayer).toBeCalledWith(msg.author.username, msg.guild.name, leagueTimes);
    expect(sendMessage).toEqual(`Registering ${msg.author.username} for the first available tournament you are not already registered to...`);
    verifyReply(messagePassed, sampleRegisterReturn);
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
    const sampleRegisterReturn = {teamName: 'SampleTeam', players: [msg.author.username, 'Player2'], tournamentName: 'msi2021', tournamentDay: '3'};
    dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
    leagueApi.findTournament = jest.fn().mockReturnValue(undefined);
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
            tournamentName: "msi2021",
            tournamentDay: "day_3",
            "startTime": "May 29 2021 07:00 pm PDT",
            "registrationTime": "May 29 2021 04:15 pm PDT"
        },
        {
            tournamentName: "msi2021",
            tournamentDay: "day_4",
            "startTime": "May 30 2021 07:00 pm PDT",
            "registrationTime": "May 30 2021 04:15 pm PDT"
        }
    ];
    leagueApi.findTournament = jest.fn().mockReturnValue(leagueApi.leagueTimes[0]);
    const sampleRegisterReturn = {teamName: 'SampleTeam', players: [msg.author.username, 'Player2'], tournamentName: 'msi2021', tournamentDay: 'day_3'};
    dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
    const args = ['msi2021'];
    await register.execute(msg, args);
    expect(sendMessage).toEqual(`Registering ${msg.author.username} for Tournament ${args[0]}...`);
    verifyReply(messagePassed, sampleRegisterReturn);
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
    const sampleRegisterReturn = { teamName: 'SampleTeam', players: [msg.author.username, 'Player2'], tournamentName: args[0], tournamentDay: args[1]};
    dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
    await register.execute(msg, args);

    expect(sendMessage).toEqual(`Registering ${msg.author.username} for Tournament ${args[0]}...`);
    verifyReply(messagePassed, sampleRegisterReturn);
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
    let leagueTime =
        {
            tournamentName: "msi2021",
            tournamentDay: "day_3",
            "startTime": "May 29 2021 07:00 pm PDT",
            "registrationTime": "May 29 2021 04:15 pm PDT"
        };
    const args = ['shurima2021','1'];
    const sampleRegisterReturn = [{ exist: true, teamName: 'ExistingTeam', players: [msg.author.username, 'Player2'], tournamentName: args[0], tournamentDay: args[1]}];
    dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
    leagueApi.findTournament = jest.fn().mockReturnValue(leagueTime)
    await register.execute(msg, args);

    expect(sendMessage).toEqual(`Registering ${msg.author.username} for Tournament ${args[0]}...`);
    verifyRedundantRegistration(messagePassed, sampleRegisterReturn);
})

test('If a user is registered already on multiple teams, then a reply stating all of the Teams that the User has been registered to should be returned.',  async () => {
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
    let leagueTime =
        [{
            tournamentName: "msi2021",
            tournamentDay: "2",
            "startTime": "May 29 2021 07:00 pm PDT",
            "registrationTime": "May 29 2021 04:15 pm PDT"
        },{
            tournamentName: "msi2021",
            tournamentDay: "3",
            "startTime": "May 30 2021 07:00 pm PDT",
            "registrationTime": "May 30 2021 04:15 pm PDT"
        }];
    const args = [];
    const sampleRegisterReturn = [{
        exist: true,
        teamName: 'ExistingTeam',
        players: [msg.author.username, 'Player2'],
        tournamentName: leagueTime[0].tournamentName,
        tournamentDay: leagueTime[0].tournamentDay
    },
    {
        exist: true,
        teamName: 'ExistingTeam2',
        players: [msg.author.username, 'Player2'],
        tournamentName: leagueTime[1].tournamentName,
        tournamentDay: leagueTime[1].tournamentDay
    }];
    dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
    leagueApi.findTournament = jest.fn().mockReturnValue(leagueTime);
    await register.execute(msg, args);

    expect(sendMessage).toEqual(`Registering ${msg.author.username} for the first available tournament you are not already registered to...`);
    verifyRedundantRegistration(messagePassed, sampleRegisterReturn);
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
    let leagueTime =
        {
            tournamentName: "msi2021",
            tournamentDay: "day_3",
            "startTime": "May 29 2021 07:00 pm PDT",
            "registrationTime": "May 29 2021 04:15 pm PDT"
        };
    const args = ['shurima2021','1'];
    dynamoDBUtils.registerPlayer.mockRejectedValue('Some error occurred.');
    leagueApi.findTournament = jest.fn().mockReturnValue(leagueTime);
    await register.execute(msg, args);

    expect(sendMessage).toEqual(`Registering ${msg.author.username} for Tournament ${args[0]}...`);
    expect(errorHandling.handleError.mock.calls.length).toEqual(1);
})
