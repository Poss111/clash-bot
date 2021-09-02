const subscribe = require('../subscribe');
const userServiceImpl = require('../../services/user-service-impl');
const errorHandling = require('../../utility/error-handling');

jest.mock('../../services/user-service-impl');
jest.mock('../../utility/error-handling');

beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
})

describe('Subscribe', () => {
    test('When a user requests to subscribe, they should have their ServerName and Id passed along to be persisted then responded with a message letting them know it was succesful.', async () => {
        let messagePassed = undefined;
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
        let updatedUserDetails = JSON.parse(JSON.stringify(mockGetUserResponse));
        updatedUserDetails.subscriptions.UpcomingClashTournamentDiscordDM = true;

        userServiceImpl.getUserDetails.mockResolvedValue(mockGetUserResponse);
        userServiceImpl.postUserDetails.mockResolvedValue(updatedUserDetails);

        await subscribe.execute(msg);

        expect(userServiceImpl.getUserDetails).toBeCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(expectedPlayerId);
        expect(userServiceImpl.postUserDetails).toBeCalledTimes(1);
        expect(userServiceImpl.postUserDetails).toBeCalledWith(msg.author.id, msg.author.username, expectedServerName, expectedPreferredChampions, { UpcomingClashTournamentDiscordDM: true });
        expect(messagePassed).toEqual('You have subscribed. You will receive a notification the Monday before ' +
            'a Clash Tournament weekend. If you want to unsubscribe at any time please use !clash unsubscribe');
    })

    test('When a user requests to subscribe and the subscription returns true initially, they should have their ServerName and Id passed along to be persisted then responded with a message letting them know it was faild.', async () => {
        let messagePassed = undefined;
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

        userServiceImpl.getUserDetails.mockResolvedValue(mockGetUserResponse);

        await subscribe.execute(msg);

        expect(userServiceImpl.getUserDetails).toBeCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(expectedPlayerId);
        expect(userServiceImpl.postUserDetails).not.toHaveBeenCalled();
        expect(messagePassed).toEqual('You are already subscribed.');
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
        errorHandling.handleError = jest.fn();

        await subscribe.execute(msg);
        expect(userServiceImpl.getUserDetails).toBeCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(msg.author.id);
        expect(errorHandling.handleError.mock.calls.length).toEqual(1);
    })
})
