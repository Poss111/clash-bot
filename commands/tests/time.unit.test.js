const time = require('../time');
const tournamentsServiceImpl = require('../../services/tournaments-service-impl');

jest.mock('../../dao/clash-time-db-impl');
jest.mock('../../services/tournaments-service-impl');

describe('League Clash Times', () => {

    test('When league times returns successfully, there should be a formatted time for each available clash and tier returned.', async () => {
        let messagePassed = '';
        let msg = {
            channel: {
                send: (value) => messagePassed = value
            }
        };
        let sampleTime =  [
            {
                tournamentName: 'awesome_sauce',
                tournamentDay: '1',
                startTime: 'June 26 2021 07:00 pm PDT',
                registrationTime: 'June 26 2021 04:15 pm PDT'
            }];
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(sampleTime);
        let expectedFormat = {
            name: `${sampleTime[0].tournamentName} Day ${sampleTime[0].tournamentDay} - June 26 2021`,
            value: "Tier IV - 4:15 pm PDT\nTier III - 5:00 pm PDT\nTier II - 5:45 pm PDT\nTier I - 6:30 pm PDT"
        }
        await time.execute(msg);
        expect(tournamentsServiceImpl.retrieveAllActiveTournaments).toHaveBeenCalledTimes(1);
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
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(undefined);
        await time.execute(msg);
        expect(tournamentsServiceImpl.retrieveAllActiveTournaments).toHaveBeenCalledTimes(1);
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
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue([]);
        await time.execute(msg);
        expect(messagePassed.embed.fields.length).toEqual(1);
        expect(messagePassed.embed.fields[0].name).toEqual('No times available');
        expect(messagePassed.embed.fields[0].value).toEqual('N/A');
        expect(messagePassed.embed.fields[0].inline).toBeFalsy();
    })

})
