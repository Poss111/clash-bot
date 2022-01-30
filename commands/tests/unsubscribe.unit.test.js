const unsubscribe = require('../unsubscribe')
const userServiceImpl = require('../../services/user-service-impl');
const errorHandling = require('../../utility/error-handling');
const {buildMockInteraction} = require('./shared-test-utilities/shared-test-utilities.test');

jest.mock('../../services/user-service-impl');
jest.mock('../../utility/error-handling');

beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
})

describe('Unsubscribe', () => {

    test('When a user requests to unsubscribe, they should have their ServerName and Id passed along to be persisted then responded with a message letting them know it was successful.', async () => {
        const expectedPreferredChampions = [];
        const expectedSubscriptions = { 'UpcomingClashTournamentDiscordDM': true };
        const msg = buildMockInteraction();

        const mockGetUserResponse = {
            id: msg.user.id,
            playerName:  msg.user.username,
            serverName:  msg.member.guild.name,
            preferredChampions: expectedPreferredChampions,
            subscriptions: expectedSubscriptions
        };
        let updatedUserDetails = JSON.parse(JSON.stringify(mockGetUserResponse));
        updatedUserDetails.subscriptions.UpcomingClashTournamentDiscordDM = false;

        userServiceImpl.getUserDetails.mockResolvedValue(mockGetUserResponse);
        userServiceImpl.postUserDetails.mockResolvedValue(updatedUserDetails);

        await unsubscribe.execute(msg);

        expect(userServiceImpl.getUserDetails).toBeCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(msg.user.id);
        expect(userServiceImpl.postUserDetails).toBeCalledTimes(1);
        expect(userServiceImpl.postUserDetails).toBeCalledWith(msg.user.id, msg.user.username,
            msg.member.guild.name, expectedPreferredChampions, { UpcomingClashTournamentDiscordDM: false });
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith('You have successfully unsubscribed.');
    })

    test('When a user requests to unsubscribe and they were not subscribed to begin with, they should have a message letting them know they were not subscribed.', async () => {
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

        userServiceImpl.getUserDetails.mockResolvedValue(mockGetUserResponse);

        await unsubscribe.execute(msg);

        expect(userServiceImpl.getUserDetails).toBeCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(msg.user.id);
        expect(userServiceImpl.postUserDetails).not.toHaveBeenCalled();
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith('No subscription was found.');
    })
})

describe('Error', () => {

    test('When an error occurs while trying to subscribe, the user should be notified.', async () => {
        const msg = buildMockInteraction();

        userServiceImpl.getUserDetails.mockRejectedValue('Something went wrong.');

        await unsubscribe.execute(msg);

        expect(userServiceImpl.getUserDetails).toBeCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(msg.user.id);
        expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
        expect(errorHandling.handleError).toHaveBeenCalledWith(unsubscribe.name, 'Something went wrong.',
            msg, 'Failed to unsubscribe.');
    })
})
