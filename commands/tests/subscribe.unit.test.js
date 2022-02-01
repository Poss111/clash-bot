const subscribe = require('../subscribe');
const userServiceImpl = require('../../services/user-service-impl');
const errorHandling = require('../../utility/error-handling');
const {buildMockInteraction} = require('./shared-test-utilities/shared-test-utilities.test');

jest.mock('../../services/user-service-impl');
jest.mock('../../utility/error-handling');

beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
})

describe('Subscribe', () => {
    test('When a user requests to subscribe, they should have their ServerName and Id passed along to be persisted then responded with a message letting them know it was succesful.', async () => {
        const expectedPreferredChampions = [];
        const expectedSubscriptions = { 'UpcomingClashTournamentDiscordDM': false };
        const msg = buildMockInteraction();
        const mockGetUserResponse = {
            id: msg.user.id,
            playerName: msg.user.username,
            serverName: msg.member.guild.name,
            preferredChampions: expectedPreferredChampions,
            subscriptions: expectedSubscriptions
        };
        let updatedUserDetails = JSON.parse(JSON.stringify(mockGetUserResponse));
        updatedUserDetails.subscriptions.UpcomingClashTournamentDiscordDM = true;

        userServiceImpl.getUserDetails.mockResolvedValue(mockGetUserResponse);
        userServiceImpl.postUserDetails.mockResolvedValue(updatedUserDetails);

        await subscribe.execute(msg);

        expect(userServiceImpl.getUserDetails).toBeCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(msg.user.id);
        expect(userServiceImpl.postUserDetails).toBeCalledTimes(1);
        expect(userServiceImpl.postUserDetails).toBeCalledWith(msg.user.id, msg.user.username,
            msg.member.guild.name, expectedPreferredChampions, { UpcomingClashTournamentDiscordDM: true });
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith('You have subscribed. You will receive a notification the Monday before ' +
            'a Clash Tournament weekend. If you want to unsubscribe at any time please use /unsubscribe');
    })

    test('When a user requests to subscribe and the subscription returns true initially, they should have their ' +
        'ServerName and Id passed along to be persisted then responded with a message letting them know ' +
        'it was failed.', async () => {
        const expectedSubscriptions = { 'UpcomingClashTournamentDiscordDM': true };
        const expectedPreferredChampions = [];
        const msg = buildMockInteraction();
        const mockGetUserResponse = {
            id: msg.user.id,
            playerName: msg.user.username,
            serverName: msg.member.guild.name,
            preferredChampions: expectedPreferredChampions,
            subscriptions: expectedSubscriptions
        };

        userServiceImpl.getUserDetails.mockResolvedValue(mockGetUserResponse);

        await subscribe.execute(msg);

        expect(userServiceImpl.getUserDetails).toBeCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(msg.user.id);
        expect(userServiceImpl.postUserDetails).not.toHaveBeenCalled();
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith('You are already subscribed.');
    })
})

describe('Error', () => {
    test('When an error occurs while trying to subscribe, the user should be notified.', async () => {
        const msg = buildMockInteraction();

        userServiceImpl.getUserDetails.mockRejectedValue('Something went wrong.');
        errorHandling.handleError = jest.fn();

        await subscribe.execute(msg);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(msg.user.id);
        expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
        expect(errorHandling.handleError).toHaveBeenCalledWith(subscribe.name, 'Something went wrong.',
            msg, 'Failed to subscribe.');
    })
})
