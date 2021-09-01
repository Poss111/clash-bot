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
    })

    describe('POST - Tentative Update', () => {
        test('When I call tentative update with user id, serverName, tournamentName, and tournamentDay I then should have my tentative status updated.', () => {
            const expectedPlayerId = '1';
            const expectedServerName = 'Goon Squad';
            const expectedTournamentName = 'awesome_sauce';
            const expectedTournamentDay = '1';
            const expectedApiResponse = {
                serverName: expectedServerName,
                tournamentDetails: {
                    tournamentName: expectedTournamentName,
                    tournamentDay: expectedTournamentDay
                },
                tentativePlayers: ['Roidrage']
            };
            nock('http://localhost')
                .post(`/api/tentative`, {id: expectedPlayerId, serverName: expectedServerName, tournamentDetails: { tournamentName: expectedTournamentName, tournamentDay: expectedTournamentDay }})
                .reply(200, expectedApiResponse);
            return tentativeServiceImpl.postTentativeUpdateForServerAndTournament(expectedPlayerId, expectedServerName, expectedTournamentName, expectedTournamentDay).then(response => {
                expect(response).toEqual(expectedApiResponse);
            });
        })
    })
})
