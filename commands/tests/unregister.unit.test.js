const unregister = require('../unregister');
const tournamentsServiceImpl = require('../../services/tournaments-service-impl');
const teamsServiceImpl = require('../../services/teams-service-impl');
const errorHandling = require('../../utility/error-handling');
const commandArgumentParser = require('../command-argument-parser');
const {buildMockInteraction} = require('./shared-test-utilities/shared-test-utilities.test');

jest.mock('../../services/tournaments-service-impl');
jest.mock('../../services/teams-service-impl');
jest.mock('../../utility/error-handling');
jest.mock('../command-argument-parser');

beforeEach(() => {
    jest.resetAllMocks();
})

describe('Unregister', () => {
    test('When a player exists on a team is unregistered, the player should be notified that we have successfully removed them.', async () => {
        const msg = buildMockInteraction();
        let args = ['msi2021', '3'];
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
        commandArgumentParser.parse.mockReturnValue({
            tournamentDay: args[1],
            tournamentName: args[0], createNewTeam: false
        });
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(leagueTimes);
        teamsServiceImpl.deleteFromTeam.mockResolvedValue({message: 'Successfully removed from Team.'});
        await unregister.execute(msg, args);
        expect(teamsServiceImpl.deleteFromTeam).toBeCalledWith(msg.user.id, msg.member.guild.name,
            leagueTimes[0].tournamentName, leagueTimes[0].tournamentDay);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith(`Unregistering '${msg.user.username}' from Tournament '${leagueTimes[0].tournamentName}' on day '${leagueTimes[0].tournamentDay}'...`);
        expect(msg.editReply).toHaveBeenCalledWith(`Removed you from your Team. Please use !clash join or !clash newTeam if you would like to join again. Thank you!`);
    })

    test('When a player does not exist on a team is unregistered, the player should be notified that we have not ' +
        'successfully removed them.', async () => {
        const msg = buildMockInteraction();
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
        commandArgumentParser.parse.mockReturnValue({
            tournamentName: args[0],
            tournamentDay: args[1], createNewTeam: false
        });
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(leagueTimes);
        teamsServiceImpl.deleteFromTeam.mockResolvedValue({error: 'User not found on requested Team.'});
        await unregister.execute(msg, args);
        expect(teamsServiceImpl.deleteFromTeam).toBeCalledWith(msg.user.id, msg.member.guild.name,
            leagueTimes[0].tournamentName, leagueTimes[0].tournamentDay);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith(`Unregistering '${msg.user.username}' from Tournament '${leagueTimes[0].tournamentName}' on day '${leagueTimes[0].tournamentDay}'...`);
        expect(msg.editReply).toHaveBeenCalledWith(`We did not find you on an existing Team. Please use !clash join or !clash newTeam if you would like to join again. Thank you!`);
    })

    test('When a player does not give which tournament and day to unregister for, the player will be sent back ' +
        'an invalid input message.', async () => {
        const msg = buildMockInteraction();
        commandArgumentParser.parse.mockReturnValue({createNewTeam: false});
        await unregister.execute(msg);
        expect(msg.deferReply).not.toHaveBeenCalled();
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith('Please pass the tournament and day to unregister for i.e. ' +
            '!clash unregister ***msi2021*** ***2***');
    })

    test('When a player gives a tournament and day that is unavailable to unregister for, ' +
        'the player will be sent back an invalid input message.', async () => {
        const msg = buildMockInteraction();
        let args = ['shurima', '3'];
        let leagueTimes = [];
        commandArgumentParser.parse.mockReturnValue({
            tournamentName: args[0],
            tournamentDay: args[1], createNewTeam: false
        });
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(leagueTimes);
        await unregister.execute(msg, args);
        expect(tournamentsServiceImpl.retrieveAllActiveTournaments).toHaveBeenCalledTimes(1);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith("Please provide an existing tournament and day to unregister for. " +
            "Use '!clash team' to print a team.");
    })
})

describe('Error Handling', () => {
    test('If an error occurs, the error handler will be invoked.', async () => {
        const msg = buildMockInteraction();
        errorHandling.handleError = jest.fn();
        teamsServiceImpl.deleteFromTeam.mockRejectedValue('Some error occurred.');
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
        commandArgumentParser.parse.mockReturnValue({
            tournamentName: args[0],
            tournamentDay: args[1],
            createNewTeam: false
        });
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(leagueTimes);
        await unregister.execute(msg, args);
        expect(tournamentsServiceImpl.retrieveAllActiveTournaments).toHaveBeenCalledTimes(1);
        expect(teamsServiceImpl.deleteFromTeam).toHaveBeenCalledTimes(1);
        expect(teamsServiceImpl.deleteFromTeam).toBeCalledWith(msg.user.id, msg.member.guild.name,
            leagueTimes[0].tournamentName, leagueTimes[0].tournamentDay);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith(`Unregistering '${msg.user.username}' from Tournament '${leagueTimes[0].tournamentName}' on day '${leagueTimes[0].tournamentDay}'...`);
        expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
        expect(errorHandling.handleError).toHaveBeenCalledWith(unregister.name, 'Some error occurred.', msg,
            'Failed to unregister you.');
    })
})
