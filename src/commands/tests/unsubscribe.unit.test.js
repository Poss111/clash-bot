const unsubscribe = require('../unsubscribe');
const errorHandling = require('../../utility/error-handling');
const {buildMockInteraction} = require('./shared-test-utilities/shared-test-utilities.test');
const clashBotRestClient = require('clash-bot-rest-client');

jest.mock('../../utility/error-handling');
jest.mock('clash-bot-rest-client');

beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
});

function setupExpectedSuccessfulUnsubscription(expectedSubscriptions, expectedSubscriptionResponse) {
    let retrieveUserSubscriptionsMock = jest.fn();
    let unsubscribeUserMock = jest.fn();
    clashBotRestClient.UserApi.mockReturnValue({
        retrieveUserSubscriptions: retrieveUserSubscriptionsMock.mockResolvedValue(
          expectedSubscriptions),
        unsubscribeUser            : unsubscribeUserMock.mockResolvedValue(expectedSubscriptionResponse)
    });
    return {retrieveUserSubscriptionsMock, unsubscribeUserMock};
}

function setupFailedRetrieveSubscriptions() {
    let retrieveUserSubscriptionsMock = jest.fn();
    clashBotRestClient.UserApi.mockReturnValue({
        retrieveUserSubscriptions: retrieveUserSubscriptionsMock.mockRejectedValue(
          new Error('Something went wrong.'))
    });
    errorHandling.handleError = jest.fn();
    return retrieveUserSubscriptionsMock;
}

function setupFailedUnsubscribe(expectedSubscriptions) {
    let retrieveUserSubscriptionsMock = jest.fn();
    let unsubscribeUserMock = jest.fn();
    clashBotRestClient.UserApi.mockReturnValue({
        retrieveUserSubscriptions: retrieveUserSubscriptionsMock.mockResolvedValue(
          expectedSubscriptions),
        unsubscribeUser            : unsubscribeUserMock.mockRejectedValue(
          new Error('Something went wrong.'))
    });
    errorHandling.handleError = jest.fn();
    return {retrieveUserSubscriptionsMock, unsubscribeUserMock};
}

describe('Unsubscribe', () => {
    describe('Happy Path and edge cases', () => {
        test('When a user requests to unsubscribe, they should have their ServerName and Id passed along to be persisted then responded with a message letting them know it was successful.', async () => {
            const expectedSubscriptions = [
              {
                  key: 'UpcomingClashTournamentDiscordDM',
                  isOn: true
              }
            ];
            const expectedSubscriptionsResponse = [
                {
                    key: 'UpcomingClashTournamentDiscordDM',
                    isOn: false
                }
            ];
            const msg = buildMockInteraction();
            let {
                retrieveUserSubscriptionsMock,
                unsubscribeUserMock
            } = setupExpectedSuccessfulUnsubscription(expectedSubscriptions, expectedSubscriptionsResponse);

            await unsubscribe.execute(msg);

            expect(retrieveUserSubscriptionsMock).toBeCalledTimes(1);
            expect(retrieveUserSubscriptionsMock).toBeCalledWith(msg.user.id);
            expect(unsubscribeUserMock).toBeCalledTimes(1);
            expect(unsubscribeUserMock).toBeCalledWith(msg.user.id);
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledWith('You have successfully unsubscribed.');
        });

        test('When a user requests to unsubscribe and they were not subscribed to begin with, they should have a message letting them know they were not subscribed.', async () => {
            const expectedSubscriptions = [
                {
                    key: 'UpcomingClashTournamentDiscordDM',
                    isOn: false
                }
            ];
            const msg = buildMockInteraction();

            let {
                retrieveUserSubscriptionsMock,
                unsubscribeUserMock
            } = setupExpectedSuccessfulUnsubscription(
              expectedSubscriptions,
              [],
            );

            await unsubscribe.execute(msg);

            expect(retrieveUserSubscriptionsMock).toBeCalledTimes(1);
            expect(retrieveUserSubscriptionsMock).toBeCalledWith(msg.user.id);
            expect(unsubscribeUserMock).not.toHaveBeenCalled();
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledWith('No subscription was found.');
        });
    });

    describe('Error', () => {
        test('When an error occurs while trying to retrieve subscriptions, the user should be notified.', async () => {
            const msg = buildMockInteraction();
            const retrieveUserSubscriptionsMock
              = setupFailedRetrieveSubscriptions();
            await unsubscribe.execute(msg);
            expect(retrieveUserSubscriptionsMock).toBeCalledTimes(1);
            expect(retrieveUserSubscriptionsMock).toBeCalledWith(msg.user.id);
            expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
            expect(errorHandling.handleError)
              .toHaveBeenCalledWith(
                unsubscribe.name,
                new Error('Something went wrong.'),
                msg,
                'Failed to unsubscribe.',
                expect.anything(),
              );
        });

        test('When an error occurs while trying to unsubscribe, the user should be notified.', async () => {
            const msg = buildMockInteraction();
            const {
                retrieveUserSubscriptionsMock,
                unsubscribeUserMock
            } = setupFailedUnsubscribe(
              [
                    {
                        key: 'UpcomingClashTournamentDiscordDM',
                        isOn: true
                    }]);
            await unsubscribe.execute(msg);
            expect(retrieveUserSubscriptionsMock).toBeCalledTimes(1);
            expect(retrieveUserSubscriptionsMock).toBeCalledWith(msg.user.id);
            expect(unsubscribeUserMock).toBeCalledTimes(1);
            expect(unsubscribeUserMock).toBeCalledWith(msg.user.id);
            expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
            expect(errorHandling.handleError)
              .toHaveBeenCalledWith(
                  unsubscribe.name,
                  new Error('Something went wrong.'),
                  msg,
                  'Failed to unsubscribe.',
                  expect.anything(),
              );
        });
    });
});