const time = require('../time');
const leagueApi = require('../../dao/clash-time-db-impl');

jest.mock('../../dao/clash-time-db-impl');

describe('League Clash Times', () => {

    test('When league times returns successfully, there should be a formatted time for each available clash and tier returned.', async () => {
        let messagePassed = '';
        let msg = {
            channel: {
                send: (value) => messagePassed = value
            }
        };
        let sampleTime = [{
            tournamentName: 'Sample Tournament',
            nameSecondary: 'sampleTournament',
            startTime: 'June 26 2021 07:00 pm PDT',
            registrationTime: 'June 26 2021 04:15 pm PDT',
            tournamentDay: '3'
        }]
        leagueApi.findTournament.mockResolvedValue(sampleTime);
        let expectedFormat = {
            name: `${sampleTime[0].tournamentName} Day ${sampleTime[0].tournamentDay} - June 26 2021`,
            value: "Tier IV - 4:15 pm PDT\nTier III - 5:00 pm PDT\nTier II - 5:45 pm PDT\nTier I - 6:30 pm PDT"
        }
        await time.execute(msg);
        expect(messagePassed.embed.fields.length).toEqual(1);
        expect(messagePassed.embed.fields[0]).toEqual(expectedFormat);
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
