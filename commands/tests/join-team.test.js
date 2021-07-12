const joinTeam = require('../join-team');
const leagueApi = require('../../dao/clashtime-db-impl');

jest.mock('../../dao/clashtime-db-impl');

describe('Join an existing Team', () => {

    test('When a user requests to join a team, they are required to pass the tournament and Team Name', async () => {
        let messagePassed = '';
        let msg = {
            reply: (value) => messagePassed = value
        };
        await joinTeam.execute(msg);
        expect(messagePassed).toBe("Please pass a tournament and team to join. You can use '!clash teams' to find existing teams.");
    })

    test('When a user requests to join a team and they pass a Tournament and a Team they should be notified that they have successfully joined a Team.', async () => {
        let messagePassed = '';
        let msg = {
            reply: (value) => messagePassed = value
        };
        let args = ['msi2021', 'Sample Team']
        leagueApi.leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "3",
                startTime: "May 29 2021 07:00 pm PDT",
                registrationTime: "May 29 2021 04:15 pm PDT"
            }
        ];
        leagueApi.findTournament = jest.fn().mockResolvedValue(leagueApi.leagueTimes);
        await joinTeam.execute(msg, args);
        expect(messagePassed).toBe("You have successfully joined a Team.");
    })

    test('When a user requests to join a team and they pass a Tournament that does not exist, they should be notified.', async () => {
        let messagePassed = '';
        let msg = {
            reply: (value) => messagePassed = value
        };
        let args = ['dne', 'Sample Team'];
        leagueApi.findTournament = jest.fn().mockResolvedValue([]);
        await joinTeam.execute(msg, args);
        expect(messagePassed).toBe(`The tournament you are trying to join does not exist ('${args[0]}'). Please use '!clash times' to see valid tournaments.`);
    })
})
