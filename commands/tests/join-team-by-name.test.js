const joinTeamByName = require('../join-team-by-name');
const leagueApi = require('../../dao/clashtime-db-impl');
const dynamoDBUtils = require('../../dao/dynamo-db-impl');
const errorHandling = require('../../utility/error-handling');

jest.mock('../../dao/clashtime-db-impl');
jest.mock('../../dao/dynamo-db-impl');
jest.mock('../../utility/error-handling');

function verifyReply(messagePassed, sampleRegisterReturn) {
    expect(messagePassed.embed.fields[0].name).toEqual(sampleRegisterReturn.teamName);
    expect(messagePassed.embed.fields[0].value).toEqual(sampleRegisterReturn.players);
    expect(messagePassed.embed.fields[1].name).toEqual('Tournament Details');
    expect(messagePassed.embed.fields[1].value).toEqual(`${sampleRegisterReturn.tournamentName} Day ${sampleRegisterReturn.tournamentDay}`);
}

describe('Join an existing Team', () => {

    test('When a user requests to join a team, they are required to pass the tournament and Team Name.', async () => {
        let messagePassed = '';
        let msg = {
            reply: (value) => messagePassed = value
        };
        await joinTeamByName.execute(msg);
        expect(messagePassed).toBe("Please pass a Tournament name first and second a Team name to join. You can use '!clash teams' to find existing teams.");
    })

    test('When a user requests to join a team with only the tournament, they are required to pass the tournament and Team Name.', async () => {
        let messagePassed = '';
        let msg = {
            reply: (value) => messagePassed = value
        };
        let args = ['msi2021']
        await joinTeamByName.execute(msg, args);
        expect(messagePassed).toBe("Please pass a Team name to join. You can use '!clash teams' to find existing teams.");
    })

    test('When a user requests to join a team and they pass a Tournament that does not exist, they should be notified.', async () => {
        let messagePassed = '';
        let msg = {
            reply: (value) => messagePassed = value
        };
        let args = ['dne', 'Sample Team'];
        leagueApi.findTournament = jest.fn().mockResolvedValue([]);
        await joinTeamByName.execute(msg, args);
        expect(messagePassed).toBe(`The tournament you are trying to join does not exist ('${args[0]}'). Please use '!clash times' to see valid tournaments.`);
    })

    test('When a user requests to join a team and they pass a Tournament and a Team they should be notified that they have successfully joined a Team.', async () => {
        let messagePassed = '';
        let msg = {
            reply: (value) => messagePassed = value,
            author: {
                username: 'TestPlayer'
            }
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
        const sampleRegisterReturn = {
            teamName: 'SampleTeam',
            players: [msg.author.username, 'Player2'],
            tournamentName: 'msi2021',
            tournamentDay: '3'
        };
        leagueApi.findTournament = jest.fn().mockResolvedValue(leagueApi.leagueTimes);
        dynamoDBUtils.registerWithSpecificTeam = jest.fn().mockResolvedValue(sampleRegisterReturn);
        await joinTeamByName.execute(msg, args);
        expect(dynamoDBUtils.registerWithSpecificTeam).toBeCalledWith(msg.author.username, leagueApi.leagueTimes, args[1]);
        verifyReply(messagePassed, sampleRegisterReturn);
    })

    test('When a user requests to join a team and they pass a Tournament and a Team and no Team exists with that name, they should have a message specifying that we were unable to find one matching the criteria.', async () => {
        let messagePassed = '';
        let msg = {
            reply: (value) => messagePassed = value,
            author: {
                username: 'TestPlayer'
            }
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
        dynamoDBUtils.registerWithSpecificTeam = jest.fn().mockResolvedValue(undefined);
        await joinTeamByName.execute(msg, args);
        expect(dynamoDBUtils.registerWithSpecificTeam).toBeCalledWith(msg.author.username, leagueApi.leagueTimes, args[1]);
        expect(messagePassed.embed.description).toEqual(`Failed to find an available team with the following criteria Tournament ('${args[0]}') Team Name ('${args[1]}')`)
    })

})

describe('Join Team Error', () => {
    test('If an error occurs, the error handled will be invoked.', async() => {
        let messagePassed = '';
        let msg = {
            reply: (value) => messagePassed = value,
            author: {
                username: 'TestPlayer'
            }
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
        dynamoDBUtils.registerWithSpecificTeam = jest.fn().mockRejectedValue('Failed to find team.');
        await joinTeamByName.execute(msg, args);
        expect(errorHandling.handleError.mock.calls.length).toEqual(1);
    })
})