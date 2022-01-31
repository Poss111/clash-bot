const joinTeamByName = require('../join-team-by-name');
const tournamentsServiceImpl = require('../../services/tournaments-service-impl');
const teamsServiceImpl = require('../../services/teams-service-impl');
const errorHandling = require('../../utility/error-handling');
const registerReply = require('../../templates/register-reply');
const { buildMockInteraction } = require('./shared-test-utilities/shared-test-utilities.test');

jest.mock('../../services/tournaments-service-impl');
jest.mock('../../services/teams-service-impl');
jest.mock('../../utility/error-handling');

function buildExpectedRegisterResponse(sampleRegisterReturn) {
    let copy = JSON.parse(JSON.stringify(registerReply));
    copy.fields.push({
        name: sampleRegisterReturn.teamName,
        value: Object.entries(sampleRegisterReturn.playersRoleDetails)
            .map(key => `${key[0]} - ${key[1]}`),
        inline: true
    });
    copy.fields.push({
        name: 'Tournament Details',
        value: `${sampleRegisterReturn.tournamentDetails.tournamentName} Day ${sampleRegisterReturn.tournamentDetails.tournamentDay}`,
        inline: true
    });
    return copy;
}

describe('Join an existing Team', () => {

    test('When a user requests to join a team, they are required to pass the role, tournament name, tournament day and Team Name.', async () => {
        let msg = buildMockInteraction();
        await joinTeamByName.execute(msg);
        expect(msg.deferReply).toHaveBeenCalledTimes(0);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith("Role, Tournament name, Tournament day, and Team are missing. You can use '!clash teams' to find existing teams. \n ***Usage***: !clash join ***Top*** ***msi2021*** ***1*** ***Pikachu***");
    })

    test('When a user requests to join a team, they are required to pass the tournament and Team Name and it is given and empty.', async () => {
        let msg = buildMockInteraction();
        await joinTeamByName.execute(msg, []);
        expect(msg.deferReply).toHaveBeenCalledTimes(0);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith("Role, Tournament name, Tournament day, and Team are missing. You can use '!clash teams' to find existing teams. \n ***Usage***: !clash join ***Top*** ***msi2021*** ***1*** ***Pikachu***");
    })

    test('When a user requests to join a team with only the role, they are required to pass the tournament name and day and Team Name.', async () => {
        let msg = buildMockInteraction();
        let args = ['Top'];
        await joinTeamByName.execute(msg, args);
        expect(msg.deferReply).toHaveBeenCalledTimes(0);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith(`Tournament name, Tournament day and Team are missing. You can use '!clash teams' to find existing teams. \n ***Usage***: !clash join ${args[0]} ***msi2021*** ***1*** ***Pikachu***`);
    })

    test('When a user requests to join a team with only the role and tournament name, they are required to pass the tournament day and Team Name.', async () => {
        let msg = buildMockInteraction();
        let args = ['Top', 'msi2021']
        await joinTeamByName.execute(msg, args);
        expect(msg.deferReply).toHaveBeenCalledTimes(0);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith(`Tournament day and Team are missing. You can use '!clash teams' to find existing teams. \n ***Usage***: !clash join ${args[0]} ${args[1]} ***1*** ***Pikachu***`);
    })

    test('When a user requests to join a team with only the role and tournament details, they are required to pass the Team Name.', async () => {
        let msg = buildMockInteraction();
        let args = ['Top', 'msi2021', '1']
        await joinTeamByName.execute(msg, args);
        expect(msg.deferReply).toHaveBeenCalledTimes(0);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith(`Team is missing. You can use '!clash teams' to find existing teams. \n ***Usage***: !clash join ${args[0]} ${args[1]} ${args[2]} ***Pikachu***`);
    })

    test('When a user requests to join a team and they pass a role, Tournament details that does not exist, they should be notified.', async () => {
        let msg = buildMockInteraction();
        let args = ['Top', 'dne', '1', 'Sample Team'];
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue([
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
        ]);
        await joinTeamByName.execute(msg, args);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith(`The tournament you are trying to join does not exist Name '${args[1]}' Day '${args[2]}'. Please use '!clash times' to see valid tournaments.`);
    })

    test('When a user requests to join a team and they pass a Tournament and a Team they should be notified that they have successfully joined a Team.', async () => {
        let msg = buildMockInteraction();
        let args = ['Top', 'msi2021', '1', 'Sample']
        const leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "1",
                startTime: "May 29 2021 07:00 pm PDT",
                registrationTime: "May 29 2021 04:15 pm PDT"
            }
        ];
        const sampleRegisterReturn = {
            teamName: 'Team Sample',
            serverName: msg.member.guild.name,
            playersDetails: [
                {
                    id: 1,
                    name: 'Roidrage'
                }
            ],
            playersRoleDetails: {
              Top: 'Roidrage'
            },
            tournamentDetails: {
                tournamentName: leagueTimes[0].tournamentName,
                tournamentDay: leagueTimes[0].tournamentDay,
            },
            startTime: leagueTimes[0].startTime
        }
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(leagueTimes);
        teamsServiceImpl.postForTeamRegistration.mockResolvedValue(sampleRegisterReturn);
        let copy = buildExpectedRegisterResponse(sampleRegisterReturn);
        await joinTeamByName.execute(msg, args);
        expect(teamsServiceImpl.postForTeamRegistration).toBeCalledWith(msg.user.id, args[0], args[3],
            msg.member.guild.name, leagueTimes[0].tournamentName, leagueTimes[0].tournamentDay);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith({ embeds: [copy]});
    })

    test('When a user requests to join a team and they pass a Tournament and a Team and no Team exists with that name, they should have a message specifying that we were unable to find one matching the criteria.', async () => {
        let msg = buildMockInteraction();
        let args = ['Top', 'msi2021', '1', 'Sample']
        const leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "1",
                startTime: "May 29 2021 07:00 pm PDT",
                registrationTime: "May 29 2021 04:15 pm PDT"
            }
        ];
        const sampleRegisterReturn = {error: 'Unable to find the Team requested to be persisted.'}
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(leagueTimes);
        teamsServiceImpl.postForTeamRegistration.mockResolvedValue(sampleRegisterReturn);
        let copy = JSON.parse(JSON.stringify(registerReply));
        copy.description = `Failed to find an available team with the following criteria, Role '${args[0]}' Tournament Name '${args[1]}' Tournament Day '${args[2]}' Team Name '${args[3]} or role is not available for that team`;

        await joinTeamByName.execute(msg, args);
        expect(teamsServiceImpl.postForTeamRegistration).toBeCalledWith(msg.user.id, args[0], args[3], msg.member.guild.name, leagueTimes[0].tournamentName, leagueTimes[0].tournamentDay);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]});
    })

})

describe('Join Team Error', () => {
    test('If an error occurs, the error handled will be invoked.', async () => {
        let msg = buildMockInteraction();
        let args = ['Top', 'msi2021', '1', 'Sample Team'];
        const leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: '1',
                startTime: "May 29 2021 07:00 pm PDT",
                registrationTime: "May 29 2021 04:15 pm PDT"
            }
        ];
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(leagueTimes);
        teamsServiceImpl.postForTeamRegistration.mockRejectedValue('Failed to find team.');
        await joinTeamByName.execute(msg, args);
        expect(teamsServiceImpl.postForTeamRegistration).toBeCalledWith(msg.user.id, args[0],
            args[3], msg.member.guild.name, leagueTimes[0].tournamentName, leagueTimes[0].tournamentDay);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
        expect(errorHandling.handleError).toHaveBeenCalledWith(joinTeamByName.name, 'Failed to find team.',
            msg, 'Failed to join the requested team.');
    })
})
