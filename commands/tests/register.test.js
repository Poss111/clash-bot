const register = require('../register');
const dynamoDBUtils = require('../../dao/dynamo-db-impl');
const errorHandling = require('../../utility/error-handling');
const leagueApi = require('../../dao/clashtime-db-impl');
const commandArgumentParser = require('../command-argument-parser');

jest.mock('../../dao/dynamo-db-impl');
jest.mock('../../utility/error-handling');
jest.mock('../../dao/clashtime-db-impl');
jest.mock('../command-argument-parser');

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

describe('Register', () => {
    test('If a user is successfully registered, then a reply stating the Team that the User has been registered to should be returned.', async () => {
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
        commandArgumentParser.parse.mockReturnValue({});
        leagueApi.findTournament = jest.fn().mockResolvedValue(leagueTimes);
        const sampleRegisterReturn = {
            teamName: 'SampleTeam',
            players: [msg.author.username, 'Player2'],
            tournamentName: 'msi2021',
            tournamentDay: '3'
        };
        dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
        await register.execute(msg);

        expect(dynamoDBUtils.registerPlayer).toBeCalledWith(msg.author.username, msg.guild.name, leagueTimes);
        expect(sendMessage).toEqual(`Registering ${msg.author.username} for the first available tournament you are not already registered to...`);
        verifyReply(messagePassed, sampleRegisterReturn);
    })

    test('If a user is successfully registered with an empty array for args, then a reply stating the Team that the User has been registered to should be returned.', async () => {
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
        commandArgumentParser.parse.mockReturnValue({});
        leagueApi.findTournament = jest.fn().mockResolvedValue(leagueTimes);
        const sampleRegisterReturn = {
            teamName: 'SampleTeam',
            players: [msg.author.username, 'Player2'],
            tournamentName: 'msi2021',
            tournamentDay: '3'
        };
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
        const sampleRegisterReturn = {
            teamName: 'SampleTeam',
            players: [msg.author.username, 'Player2'],
            tournamentName: 'msi2021',
            tournamentDay: '3'
        };
        const args = ['dne'];
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[0]});
        dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
        leagueApi.findTournament = jest.fn().mockResolvedValue(undefined);
        await register.execute(msg, args);
        expect(sendMessage).toEqual(`Registering ${msg.author.username} for Tournament ${args[0]}...`);
        expect(messagePassed).toEqual(`We were unable to find a Tournament with '${args[0]}'. Please try again.`)
    })

    test('If a user requests a specific tournament that does not exist and the list is empty, they should receive a response letting them know we were unable to find a tournament.', async () => {
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
        const sampleRegisterReturn = {
            teamName: 'SampleTeam',
            players: [msg.author.username, 'Player2'],
            tournamentName: 'msi2021',
            tournamentDay: '3'
        };
        const args = ['dne'];
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[0]});
        dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
        leagueApi.findTournament = jest.fn().mockResolvedValue([]);
        await register.execute(msg, args);
        expect(sendMessage).toEqual(`Registering ${msg.author.username} for Tournament ${args[0]}...`);
        expect(messagePassed).toEqual(`We were unable to find a Tournament with '${args[0]}'. Please try again.`)
    })

    test('If a user requests a specific tournament name and day that does not exist and the list is empty, they should receive a response letting them know we were unable to find a tournament.', async () => {
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
        const sampleRegisterReturn = {
            teamName: 'SampleTeam',
            players: [msg.author.username, 'Player2'],
            tournamentName: 'msi2021',
            tournamentDay: '3'
        };
        const args = ['dne', '1'];
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[0], tournamentDay: args[1]});
        dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
        leagueApi.findTournament = jest.fn().mockResolvedValue([]);
        await register.execute(msg, args);
        expect(sendMessage).toEqual(`Registering ${msg.author.username} for Tournament ${args[0]} on day ${args[1]}...`);
        expect(messagePassed).toEqual(`We were unable to find a Tournament with '${args[0]}' and '${args[1]}'. Please try again.`)
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
                tournamentDay: "3",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            }
        ];
        const args = ['msi2021'];
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[0]});
        leagueApi.findTournament = jest.fn().mockResolvedValue(leagueApi.leagueTimes);
        const sampleRegisterReturn = {
            teamName: 'SampleTeam',
            players: [msg.author.username, 'Player2'],
            tournamentName: 'msi2021',
            tournamentDay: 'day_3'
        };
        dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
        await register.execute(msg, args);
        expect(sendMessage).toEqual(`Registering ${msg.author.username} for Tournament ${args[0]}...`);
        verifyReply(messagePassed, sampleRegisterReturn);
    })

    test('The user should be able to pass the tournament and day that they want to be registered towards.', async () => {
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
        const args = ['shurima2021', '1'];
        leagueApi.leagueTimes = [
            {
                tournamentName: "shurima2021",
                tournamentDay: "1",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            }
        ];
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[0], tournamentDay: args[1]});
        leagueApi.findTournament = jest.fn().mockResolvedValue(leagueApi.leagueTimes);
        const sampleRegisterReturn = {
            teamName: 'SampleTeam',
            players: [msg.author.username, 'Player2'],
            tournamentName: args[0],
            tournamentDay: args[1]
        };
        dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
        await register.execute(msg, args);

        expect(sendMessage).toEqual(`Registering ${msg.author.username} for Tournament ${args[0]} on day ${args[1]}...`);
        verifyReply(messagePassed, sampleRegisterReturn);
    })

    test('If a user is already on a team, then a reply stating the Team that the User has been registered to should be returned.', async () => {
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
        let leagueTime = [
            {
                tournamentName: "msi2021",
                tournamentDay: "day_3",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            }
        ];
        const args = ['shurima2021', '1'];
        const sampleRegisterReturn = [{
            exist: true,
            teamName: 'ExistingTeam',
            players: [msg.author.username, 'Player2'],
            tournamentName: args[0],
            tournamentDay: args[1]
        }];
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[0], tournamentDay: args[1]});

        dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
        leagueApi.findTournament = jest.fn().mockResolvedValue(leagueTime)
        await register.execute(msg, args);

        expect(sendMessage).toEqual(`Registering ${msg.author.username} for Tournament ${args[0]} on day ${args[1]}...`);
        verifyRedundantRegistration(messagePassed, sampleRegisterReturn);
    })

    test('If a user is registered already on multiple teams, then a reply stating all of the Teams that the User has been registered to should be returned.', async () => {
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
            }, {
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
        commandArgumentParser.parse.mockReturnValue({});
        dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
        leagueApi.findTournament = jest.fn().mockResolvedValue(leagueTime);
        await register.execute(msg, args);

        expect(sendMessage).toEqual(`Registering ${msg.author.username} for the first available tournament you are not already registered to...`);
        verifyRedundantRegistration(messagePassed, sampleRegisterReturn);
    })
})

describe('Register Error', () => {
    test('If an error occurs, the error handler will be invoked.', async () => {
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
        let leagueTime = [
            {
                tournamentName: "msi2021",
                tournamentDay: "day_3",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            }
        ];
        const args = ['shurima2021', '1'];
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[0], tournamentDay: args[1]});
        dynamoDBUtils.registerPlayer.mockRejectedValue('Some error occurred.');
        leagueApi.findTournament = jest.fn().mockResolvedValue(leagueTime);
        await register.execute(msg, args);

        expect(sendMessage).toEqual(`Registering ${msg.author.username} for Tournament ${args[0]} on day ${args[1]}...`);
        expect(errorHandling.handleError.mock.calls.length).toEqual(1);
    })

    test('If a user does not request a specific tournament that does not exist and the list is empty, they should receive a response letting them know we were unable to find a tournament.', async () => {
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
        const sampleRegisterReturn = {
            teamName: 'SampleTeam',
            players: [msg.author.username, 'Player2'],
            tournamentName: 'msi2021',
            tournamentDay: '3'
        };
        errorHandling.handleError = jest.fn();
        const args = [];
        commandArgumentParser.parse.mockReturnValue({});
        dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
        leagueApi.findTournament = jest.fn().mockResolvedValue([]);
        await register.execute(msg, args);
        expect(sendMessage).toEqual(`Registering ${msg.author.username} for the first available tournament you are not already registered to...`);
        expect(errorHandling.handleError.mock.calls.length).toEqual(1);
    })
})
