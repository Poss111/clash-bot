const userServiceImpl = require('../user-service-impl');
const nock = require('nock');

describe('User Service Impl', () => {
    describe('GET User Details', () => {
        test('When an id is passed, then the user details should be returned.', () => {
            const expectedPlayerId = '1';
            const expectedApiResponse = {
                id: expectedPlayerId,
                username: 'Roidrage',
                serverName: 'Goon Squad',
                preferredChampions: ['Sett'],
                subscriptions: {'UpcomingClashTournamentDiscordDM': true}
            }
            nock('http://localhost')
                .get(`/api/user`)
                .query({id: expectedPlayerId})
                .reply(200, expectedApiResponse);
            return userServiceImpl.getUserDetails(expectedPlayerId).then(response => {
                expect(response).toEqual(expectedApiResponse);
            })
        })
    })

    describe('Post User Details', () => {
        test('When an id, playerName, serverName, preferedChampions, and subscriptions are passed, then the user details should be persisted and returned.', () => {
            const expectedPlayerId = '1';
            const expectedPlayerName = 'Roidrage';
            const expectedServerName = 'Goon Squad';
            const expectedPreferredChampions = [];
            const expectedSubscriptions = { 'UpcomingClashTournamentDiscordDM': true };
            const payload = {
                id: expectedPlayerId,
                playerName: expectedPlayerName,
                serverName: expectedServerName,
                preferredChampions: expectedPreferredChampions,
                subscriptions: expectedSubscriptions
            };
            const expectedApiResponse = {
                id: expectedPlayerId,
                username: expectedPlayerName,
                serverName: expectedServerName,
                preferredChampions: expectedPreferredChampions,
                subscriptions: expectedSubscriptions
            };
            nock('http://localhost')
                .post(`/api/user`, payload)
                .reply(200, expectedApiResponse);
            return userServiceImpl.postUserDetails(expectedPlayerId, expectedPlayerName, expectedServerName, expectedPreferredChampions, expectedSubscriptions).then(response => {
                expect(response).toEqual(expectedApiResponse);
            })
        })
    })
})
