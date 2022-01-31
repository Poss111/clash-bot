const tentative = require('../tentative');
const tournamentsServiceImpl = require('../../services/tournaments-service-impl');
const tentativeServiceImpl = require('../../services/tentative-service-impl');
const errorHandling = require('../../utility/error-handling');
const commandArgumentParser = require('../command-argument-parser');
const {buildMockInteraction} = require('./shared-test-utilities/shared-test-utilities.test');

jest.mock('../../services/tournaments-service-impl');
jest.mock('../../services/tentative-service-impl');
jest.mock('../../utility/error-handling');
jest.mock('../command-argument-parser');

beforeEach(() => {
    jest.resetAllMocks();
})

describe('Tentative Command', () => {
    test('Should respond with user has been placed on tentative if the player name does not exist in the tentative list.', async () => {
        let msg = buildMockInteraction();
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
        let args = ['msi2021', '1'];
        commandArgumentParser.parse.mockReturnValue({
            tournamentName: args[0],
            tournamentDay: args[1],
            createNewTeam: false
        });
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(leagueTimes);
        tentativeServiceImpl.postTentativeUpdateForServerAndTournament.mockResolvedValue({
            tentativePlayers: [msg.user.username],
            serverName: 'TestServer',
            tournamentDetails: {
                tournamentName: leagueTimes[0].tournamentName,
                tournamentDay: leagueTimes[0].tournamentDay
            }
        });
        await tentative.execute(msg, args);
        expect(tentativeServiceImpl.postTentativeUpdateForServerAndTournament).toBeCalledWith(msg.user.id,
            msg.member.guild.name, args[0], args[1]);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith(`We placed you into the tentative queue. If you were on a team, you have been removed. tip: Use '!clash teams' to view current team status`);
    })

    test('Should respond with user has been taken off tentative if the player name does exist in the tentative list.', async () => {
        let msg = buildMockInteraction();
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
        let args = ['msi2021', '1'];
        commandArgumentParser.parse.mockReturnValue({
            tournamentName: args[0],
            tournamentDay: args[1],
            createNewTeam: false
        });
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(leagueTimes);
        tentativeServiceImpl.postTentativeUpdateForServerAndTournament.mockResolvedValue({
            tentativePlayers: [],
            serverName: msg.member.guild.name,
            tournamentDetails: {
                tournamentName: leagueTimes[0].tournamentName,
                tournamentDay: leagueTimes[0].tournamentDay
            }
        });
        await tentative.execute(msg, args);
        expect(tentativeServiceImpl.postTentativeUpdateForServerAndTournament).toBeCalledWith(msg.user.id,
            msg.member.guild.name, args[0], args[1]);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith(`We have taken you off of tentative queue. tip: Use '!clash teams' to view current team status`);
    })

    test('If tournament passed by user is not found and return as empty, the user should be notified.', async () => {
        let msg = buildMockInteraction();
        let args = ['msi2021', '1'];
        commandArgumentParser.parse.mockReturnValue({
            tournamentName: args[0],
            tournamentDay: args[1],
            createNewTeam: false
        });
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue([]);
        await tentative.execute(msg, args);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith('Cannot find the tournament passed. Please check !clash time ' +
            'for an appropriate list.');
    })

    test('Should require a tournament as an argument.', async () => {
        let msg = buildMockInteraction();
        let args = [];
        commandArgumentParser.parse.mockReturnValue({createNewTeam: false});
        await tentative.execute(msg, args);
        expect(msg.deferReply).not.toHaveBeenCalled();
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith("A Tournament Name to be tentative for is missing. Please " +
            "use !clash tentative 'tournament name' 'tournament day' to use tentative. i.e. !clash tentative msi2021 1");
    })

    test('Should require a single argument.', async () => {
        let msg = buildMockInteraction();
        let args = undefined;
        commandArgumentParser.parse.mockReturnValue({createNewTeam: false});
        await tentative.execute(msg, args);
        expect(msg.deferReply).not.toHaveBeenCalled();
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith("A Tournament Name to be tentative for is missing. Please use " +
            "!clash tentative 'tournament name' 'tournament day' to use tentative. i.e. !clash tentative msi2021 1");
    })

    test('Should require Tournament Day as a 2nd argument.', async () => {
        let msg = buildMockInteraction();
        let args = ['msi2021'];
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[0], createNewTeam: false});
        await tentative.execute(msg, args);
        expect(msg.deferReply).not.toHaveBeenCalled();
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith("A Tournament Day to be tentative for is missing. Please use " +
            "!clash tentative 'tournament name' 'tournament day' to use tentative. i.e. !clash tentative msi2021 1");
    })
})

describe('Error Handling', () => {
    test('If an error occurs, the error handler will be invoked.', async () => {
        errorHandling.handleError = jest.fn();
        let msg = buildMockInteraction();
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
        let args = ['msi2021', '1'];
        commandArgumentParser.parse.mockReturnValue({
            tournamentName: args[0],
            tournamentDay: args[1],
            createNewTeam: false
        });
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(leagueTimes);
        tentativeServiceImpl.postTentativeUpdateForServerAndTournament.mockRejectedValue('Some error occurred.');
        await tentative.execute(msg, args);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(tournamentsServiceImpl.retrieveAllActiveTournaments).toHaveBeenCalledTimes(1);
        expect(tentativeServiceImpl.postTentativeUpdateForServerAndTournament).toHaveBeenCalledTimes(1);
        expect(tentativeServiceImpl.postTentativeUpdateForServerAndTournament)
            .toHaveBeenCalledWith(msg.user.id, msg.member.guild.name, leagueTimes[0].tournamentName,
                leagueTimes[0].tournamentDay);
        expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
        expect(errorHandling.handleError).toHaveBeenCalledWith(tentative.name, 'Some error occurred.', msg,
            'Failed to place you on tentative.');
    })
})
