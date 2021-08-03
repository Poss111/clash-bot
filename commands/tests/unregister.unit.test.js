const unregister = require('../unregister');
const dynamoDbUtils = require('../../dao/clash-teams-db-impl');
const errorHandling = require('../../utility/error-handling');
const leagueApi = require('../../dao/clash-time-db-impl');
const commandArgumentParser = require('../command-argument-parser');

jest.mock('../../dao/clash-teams-db-impl');
jest.mock('../../utility/error-handling');
jest.mock('../../dao/clash-time-db-impl');
jest.mock('../command-argument-parser');

describe('Unregister', () => {
    test('When a player exists on a team is unregistered, the player should be notified that we have successfully removed them.', async () => {
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
        let args = ['shurima', '3'];
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
        commandArgumentParser.parse.mockReturnValue({tournamentDay: args[1], tournamentName: args[0], createNewTeam: false});
        leagueApi.findTournament.mockResolvedValue(leagueTimes);
        dynamoDbUtils.deregisterPlayer.mockResolvedValue(true);
        await unregister.execute(msg, args);
        expect(dynamoDbUtils.deregisterPlayer).toBeCalledWith(msg.author.username, msg.guild.name, leagueTimes);
        expect(sendMessage).toEqual(`Unregistering ${msg.author.username} from Tournament ${leagueTimes[0].tournamentName} on Day ${leagueTimes[0].tournamentDay}...`);
        expect(messagePassed).toEqual(`Removed you from your Team. Please use !clash register if you would like to join again. Thank you!`);
    })

    test('When a player does not exist on a team is unregistered, the player should be notified that we have not successfully removed them.', async () => {
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
        let args = ['shurima', '3'];
        let leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "3",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                tournamentName: "msi2021",
                tournamentDay: "4",
                "startTime": "May 30 2021 07:00 pm PDT",
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[0], tournamentDay: args[1], createNewTeam: false});
        leagueApi.findTournament.mockResolvedValue(leagueTimes);
        dynamoDbUtils.deregisterPlayer.mockResolvedValue(false);
        await unregister.execute(msg, args);
        expect(sendMessage).toEqual(`Unregistering ${msg.author.username} from Tournament ${leagueTimes[0].tournamentName} on Day ${leagueTimes[0].tournamentDay}...`);
        expect(messagePassed).toEqual(`We did not find you on an existing Team. Please use !clash register if you would like to join again. Thank you!`);
    })

    test('When a player does not give which tournament and day to unregister for, the player will be sent back an invalid input message.', async () => {
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
        commandArgumentParser.parse.mockReturnValue({createNewTeam: false});
        await unregister.execute(msg);
        expect(messagePassed).toEqual('Please pass the tournament and day to unregister for i.e. !clash unregister msi2021 2');
    })

    test('When a player does not give which tournament and day that is available to unregister for, the player will be sent back an invalid input message.', async () => {
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
        let args = ['shurima', '3'];
        let leagueTimes = [];
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[0], tournamentDay: args[1], createNewTeam: false});
        leagueApi.findTournament.mockResolvedValue(leagueTimes);
        await unregister.execute(msg, args);
        expect(messagePassed).toEqual(`Please provide an existing tournament and day to unregister for. Use '!clash team' to print a teams.`);
    })

    test('When find tournament returns undefined, the player will be sent back an invalid input message.', async () => {
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
        let args = ['shurima', '3'];
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[0], tournamentDay: args[1], createNewTeam: false});
        leagueApi.findTournament.mockResolvedValue(undefined);
        await unregister.execute(msg, args);
        expect(messagePassed).toEqual(`Please provide an existing tournament and day to unregister for. Use '!clash team' to print a teams.`);
    })
})

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
    dynamoDbUtils.deregisterPlayer.mockRejectedValue('Some error occurred.');
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
    let args = ['shurima', '3'];
    commandArgumentParser.parse.mockReturnValue({tournamentName: args[0], tournamentDay: args[1], createNewTeam: false});
    leagueApi.findTournament.mockResolvedValue(leagueTimes);
    await unregister.execute(msg, args);
    expect(sendMessage).toEqual(`Unregistering ${msg.author.username} from Tournament ${leagueTimes[0].tournamentName} on Day ${leagueTimes[0].tournamentDay}...`);
    expect(errorHandling.handleError.mock.calls.length).toEqual(1);
})
