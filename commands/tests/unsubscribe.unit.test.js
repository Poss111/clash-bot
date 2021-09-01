const unsubscribe = require('../unsubscribe')
const userServiceImpl = require('../../services/user-service-impl');
const errorHandling = require('../../utility/error-handling');

jest.mock('../../services/user-service-impl');
jest.mock('../../utility/error-handling');

beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
})

describe('Unsubscribe', () => {

    test('When a user requests to unsubscribe, they should have their ServerName and Id passed along to be persisted then responded with a message letting them know it was successful.', async () => {
        let messagePassed = '';
        const expectedPlayerId = '1';
        const expectedPlayerName = 'Roidrage';
        const expectedServerName = 'Goon Squad';
        const expectedPreferredChampions = [];
        const expectedSubscriptions = { 'UpcomingClashTournamentDiscordDM': true };
        let msg = {
            reply: (value) => messagePassed = value,
            author: {
                username: expectedPlayerName,
                id: expectedPlayerId
            },
            guild: {
                name: expectedServerName
            }
        };

        const mockGetUserResponse = {
            id: expectedPlayerId,
            playerName: expectedPlayerName,
            serverName: expectedServerName,
            preferredChampions: expectedPreferredChampions,
            subscriptions: expectedSubscriptions
        };
        let updatedUserDetails = JSON.parse(JSON.stringify(mockGetUserResponse));
        updatedUserDetails.subscriptions.UpcomingClashTournamentDiscordDM = false;

        userServiceImpl.getUserDetails.mockResolvedValue(mockGetUserResponse);
        userServiceImpl.postUserDetails.mockResolvedValue(updatedUserDetails);

        await unsubscribe.execute(msg);

        expect(userServiceImpl.getUserDetails).toBeCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(expectedPlayerId);
        expect(userServiceImpl.postUserDetails).toBeCalledTimes(1);
        expect(userServiceImpl.postUserDetails).toBeCalledWith(msg.author.id, msg.author.username, expectedServerName, expectedPreferredChampions, { UpcomingClashTournamentDiscordDM: false });
        expect(messagePassed).toEqual('You have successfully unsubscribed.');
    })

    test('When a user requests to unsubscribe and they were not subscribed to begin with, they should have a message letting them know they were not subscribed.', async () => {
        let messagePassed = '';
        const expectedPlayerId = '1';
        const expectedPlayerName = 'Roidrage';
        const expectedServerName = 'Goon Squad';
        const expectedPreferredChampions = [];
        const expectedSubscriptions = { 'UpcomingClashTournamentDiscordDM': false };
        let msg = {
            reply: (value) => messagePassed = value,
            author: {
                username: expectedPlayerName,
                id: expectedPlayerId
            },
            guild: {
                name: expectedServerName
            }
        };

        const mockGetUserResponse = {
            id: expectedPlayerId,
            playerName: expectedPlayerName,
            serverName: expectedServerName,
            preferredChampions: expectedPreferredChampions,
            subscriptions: expectedSubscriptions
        };

        userServiceImpl.getUserDetails.mockResolvedValue(mockGetUserResponse);

        await unsubscribe.execute(msg);

        expect(userServiceImpl.getUserDetails).toBeCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(expectedPlayerId);
        expect(userServiceImpl.postUserDetails).not.toHaveBeenCalled();
        expect(messagePassed).toEqual('No subscription was found.');
    })
})

describe('Error', () => {

    test('When an error occurs while trying to subscribe, the user should be notified.', async () => {
        let messagePassed;
        let msg = {
            reply: (value) => messagePassed = value,
            author: {
                username: 'TestPlayer',
                id: '123456789'
            },
            guild: {
                name: 'TestServer'
            }
        };

        userServiceImpl.getUserDetails.mockRejectedValue('Something went wrong.');

        await unsubscribe.execute(msg);

        expect(userServiceImpl.getUserDetails).toBeCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(msg.author.id);
        expect(errorHandling.handleError.mock.calls.length).toEqual(1);
    })
})
