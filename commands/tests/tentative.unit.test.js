const tentative = require('../tentative');
const dynamoDBUtils = require('../../dao/clash-teams-db-impl');
const errorHandling = require('../../utility/error-handling');
const leagueApi = require('../../dao/clash-time-db-impl');
const commandArgumentParser = require('../command-argument-parser');

jest.mock('../../dao/clash-teams-db-impl');
jest.mock('../../utility/error-handling');
jest.mock('../../dao/clash-time-db-impl');
jest.mock('../command-argument-parser');

test('Should respond with user has been placed on tentative if the player name does not exist in the tentative list.', async () => {
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
    let args = ['msi2021'];
    commandArgumentParser.parse.mockReturnValue({tournamentName: args[0], createNewTeam: false});
    leagueApi.findTournament.mockResolvedValue(leagueTimes);
    dynamoDBUtils.handleTentative.mockResolvedValue(false);
    await tentative.execute(msg, args);
    expect(dynamoDBUtils.handleTentative).toBeCalledWith(msg.author.username, msg.guild.name, args[0]);
    expect(messagePassed).toEqual(`We placed you into the tentative queue. If you were on a team, you have been removed. tip: Use '!clash teams' to view current team status`);
})

test('Should respond with user has been taken off tentative if the player name does exist in the tentative list.', async () => {
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
    let args = ['msi2021'];
    commandArgumentParser.parse.mockReturnValue({tournamentName: args[0], createNewTeam: false});
    leagueApi.findTournament.mockResolvedValue(leagueTimes);
    dynamoDBUtils.handleTentative.mockResolvedValue(true);
    await tentative.execute(msg, args);
    expect(dynamoDBUtils.handleTentative).toBeCalledWith(msg.author.username, msg.guild.name, args[0]);
    expect(messagePassed).toEqual(`We have taken you off of tentative queue. tip: Use '!clash teams' to view current team status`);
})

test('If tournament passed by user is not found and return as undefined, the user should be notified.', async () => {
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
    let args = ['msi2021'];
    commandArgumentParser.parse.mockReturnValue({tournamentName: args[0], createNewTeam: false});
    leagueApi.findTournament.mockResolvedValue(undefined);
    await tentative.execute(msg, args);
    expect(leagueApi.findTournament).toBeCalledWith(args[0]);
    expect(messagePassed).toEqual('Cannot find the tournament passed. Please check !clash time for an appropriate list.');
})

test('If tournament passed by user is not found and return as empty, the user should be notified.', async () => {
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
    let args = ['msi2021'];
    commandArgumentParser.parse.mockReturnValue({tournamentName: args[0], createNewTeam: false});
    leagueApi.findTournament.mockResolvedValue([]);
    await tentative.execute(msg, args);
    expect(leagueApi.findTournament).toBeCalledWith(args[0]);
    expect(messagePassed).toEqual('Cannot find the tournament passed. Please check !clash time for an appropriate list.');
})

test('Should require a tournament as an argument.', async () => {
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
    let args = [];
    commandArgumentParser.parse.mockReturnValue({createNewTeam: false});
    dynamoDBUtils.handleTentative.mockResolvedValue(true);
    await tentative.execute(msg, args);
    expect(messagePassed).toEqual(`A tournament name to be tentative for is missing. Please use !clash tentative 'tournament name' to use tentative. i.e. !clash tentative msi2021`);
})

test('Should require a single argument.', async () => {
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
    let args = undefined;
    commandArgumentParser.parse.mockReturnValue({createNewTeam: false});
    dynamoDBUtils.handleTentative.mockResolvedValue(true);
    await tentative.execute(msg, args);
    expect(messagePassed).toEqual(`A tournament name to be tentative for is missing. Please use !clash tentative 'tournament name' to use tentative. i.e. !clash tentative msi2021`);
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
    let args = ['msi2021'];
    commandArgumentParser.parse.mockReturnValue({tournamentName: args[0], createNewTeam: false});
    leagueApi.findTournament.mockResolvedValue(leagueTimes);
    dynamoDBUtils.handleTentative.mockRejectedValue('Some error occurred.');
    await tentative.execute(msg, args);
    expect(errorHandling.handleError.mock.calls.length).toEqual(1);
})
