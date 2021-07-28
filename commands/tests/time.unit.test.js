const time = require('../time');
const leagueApi = require('../../dao/clash-time-db-impl');

jest.mock('../../dao/clash-time-db-impl');

describe('League Clash Times', () => {

    test('When league times returns successfully, there should be a formatted time for each available clash returned.', async () => {
        let messagePassed = '';
        let msg = {
            channel: {
                send: (value) => messagePassed = value
            }
        };
        let sampleTime = [{
            tournamentName: 'Sample Tournament',
            nameSecondary: 'sampleTournament',
            startTime: 'Monday April 1st, 2021 @ 1',
            registrationTime: 'Monday April 1st, 2021 @ 2',
            tournamentDay: '3'
        }]
        leagueApi.findTournament.mockResolvedValue(sampleTime);
        await time.execute(msg);
        expect(messagePassed.embed.fields.length).toEqual(4);
        expect(messagePassed.embed.fields[0].name).toEqual('Tournament Name');
        expect(messagePassed.embed.fields[0].value).toEqual(sampleTime[0].tournamentName);
        expect(messagePassed.embed.fields[0].inline).toBeFalsy();
        expect(messagePassed.embed.fields[1].name).toEqual('Day');
        expect(messagePassed.embed.fields[1].value).toEqual(sampleTime[0].tournamentDay);
        expect(messagePassed.embed.fields[1].inline).toBeTruthy();
        expect(messagePassed.embed.fields[2].name).toEqual('Registration Time');
        expect(messagePassed.embed.fields[2].value).toEqual(sampleTime[0].registrationTime);
        expect(messagePassed.embed.fields[2].inline).toBeTruthy();
        expect(messagePassed.embed.fields[3].name).toEqual('Start Time');
        expect(messagePassed.embed.fields[3].value).toEqual(sampleTime[0].startTime);
        expect(messagePassed.embed.fields[3].inline).toBeTruthy();
    })

    test('When league times returns as undefined, there should be a no times available message returned.', async () => {
        let messagePassed = '';
        let msg = {
            channel: {
                send: (value) => messagePassed = value
            }
        };
        leagueApi.findTournament.mockResolvedValue(undefined);
        await time.execute(msg);
        expect(messagePassed.embed.fields.length).toEqual(1);
        expect(messagePassed.embed.fields[0].name).toEqual('No times available');
        expect(messagePassed.embed.fields[0].value).toEqual('N/A');
        expect(messagePassed.embed.fields[0].inline).toBeFalsy();
    })

    test('When league times returns as empty, there should be a no times available message returned.', async () => {
        let messagePassed = '';
        let msg = {
            channel: {
                send: (value) => messagePassed = value
            }
        };
        leagueApi.findTournament.mockResolvedValue([]);
        await time.execute(msg);
        expect(messagePassed.embed.fields.length).toEqual(1);
        expect(messagePassed.embed.fields[0].name).toEqual('No times available');
        expect(messagePassed.embed.fields[0].value).toEqual('N/A');
        expect(messagePassed.embed.fields[0].inline).toBeFalsy();
    })

})