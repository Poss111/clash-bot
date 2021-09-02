const tournamentsServiceImpl = require('../tournaments-service-impl');
const nock = require('nock');

describe('Tournaments Service Impl', () => {
    describe('GET - Retrieve Active Tournaments', () => {
        test('When I call to retrieve all active Tournaments, I should be returned an array of available Tournaments.', () => {
            const expectedResponse = [
                {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '1',
                    startTime: new Date().toISOString(),
                    registrationTime: new Date().toISOString()
                }
            ];
            nock('http://localhost')
                .get(`/api/tournaments`)
                .reply(200, expectedResponse);
            return tournamentsServiceImpl.retrieveAllActiveTournaments().then((response) => expect(response).toEqual(expectedResponse));
        })
    })
})
