const tentativeServiceImpl = require('../tentative-service-impl');
const nock = require('nock');

describe('Tentative Service Impl', () => {
    describe('Get Tentative for Server', () => {
        test('When I make a call to retrieve the tentative list for the server, I should be returned all available Tentative lists.', () => {
            const expectedServerName = 'Goon Squad';
            const expectedApiResponse = [{
                serverName: expectedServerName,
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '1'
                },
                tentativePlayers: ['Roidrage']
            }];
            nock('http://localhost')
                .get(`/api/tentative`)
                .query({serverName: expectedServerName})
                .reply(200, expectedApiResponse);
            return tentativeServiceImpl.retrieveTentativeListForServer(expectedServerName).then(response => {
                expect(response).toEqual(expectedApiResponse);
            });
        })

        test('Error - Http Error - If an http error occurs, it should be rejected successfully.', () => {
            const expectedServerName = 'Goon Squad';
            const expectedApiResponse = { error: 'Missing required detail.'};
            nock('http://localhost')
                .get(`/api/tentative`)
                .query({serverName: expectedServerName})
                .reply(400, expectedApiResponse);
            return tentativeServiceImpl.retrieveTentativeListForServer(expectedServerName).then(() => {
                expect(true).toBeFalsy();
            }).catch(err => {
                let expectedResponse = JSON.parse(JSON.stringify(expectedApiResponse));
                expectedResponse.statusCode = 400;
                expect(err).toEqual(expectedResponse);
            });
        })

        test('Error - Error with Call - If an http error occurs, it should be rejected successfully.', () => {
            const expectedServerName = 'Goon Squad';
            nock('http://localhost')
                .get(`/api/tentative`)
                .query({serverName: expectedServerName})
                .replyWithError({ message: 'Failed to make call.', code: 500 });
            return tentativeServiceImpl.retrieveTentativeListForServer(expectedServerName).then(() => {
                expect(true).toBeFalsy();
            }).catch(err => {
                expect(err).toEqual({ message: 'Failed to make call.', code: 500 });
            });
        })
    })
})
