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

        test('Error - Http Error - If an http error occurs, it should be rejected successfully.', () => {
            const expectedApiResponse = { error: 'Missing required detail.'};
            nock('http://localhost')
                .get(`/api/tournaments`)
                .reply(400, expectedApiResponse);
            return tournamentsServiceImpl.retrieveAllActiveTournaments().then(() => {
                expect(true).toBeFalsy();
            }).catch(err => {
                let expectedResponse = JSON.parse(JSON.stringify(expectedApiResponse));
                expectedResponse.statusCode = 400;
                expect(err).toEqual(expectedResponse);
            });
        })

        test('Error - Error with Call - If an http error occurs, it should be rejected successfully.', () => {
            nock('http://localhost')
                .get(`/api/tournaments`)
                .replyWithError({ message: 'Failed to make call.', code: 500 });
            return tournamentsServiceImpl.retrieveAllActiveTournaments().then(() => {
                expect(true).toBeFalsy();
            }).catch(err => {
                expect(err).toEqual({ message: 'Failed to make call.', code: 500 });
            });
        })
    })

})
