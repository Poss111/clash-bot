const subscribe = require('../subscribe');
const errorHandling = require('../../utility/error-handling');
const {buildMockInteraction} = require('./shared-test-utilities/shared-test-utilities.test');
const clashBotRestClient = require('clash-bot-rest-client');

jest.mock('../../utility/error-handling');
jest.mock('clash-bot-rest-client');

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
})

function setupExpectedSuccessfulSubscription(expectedSubscriptions, expectedSubscriptionResponse) {
  let retrieveUserSubscriptionsMock = jest.fn();
  let subscribeUserMock = jest.fn();
  clashBotRestClient.UserApi.mockReturnValue({
    retrieveUserSubscriptions: retrieveUserSubscriptionsMock.mockResolvedValue(
      expectedSubscriptions),
    subscribeUser            : subscribeUserMock.mockResolvedValue(expectedSubscriptionResponse)
  });
  return {retrieveUserSubscriptionsMock, subscribeUserMock};
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

function setupFailedSubscribe(expectedSubscriptions) {
  let retrieveUserSubscriptionsMock = jest.fn();
  let subscribeUserMock = jest.fn();
  clashBotRestClient.UserApi.mockReturnValue({

    retrieveUserSubscriptions: retrieveUserSubscriptionsMock.mockResolvedValue(
      expectedSubscriptions),
    subscribeUser            : subscribeUserMock.mockRejectedValue(
      new Error('Something went wrong.'))
  });
  errorHandling.handleError = jest.fn();
  return {retrieveUserSubscriptionsMock, subscribeUserMock};
}

describe('Subscribe', () => {
  describe('Happy Path and edge', () => {
    test(
      'When a user requests to subscribe, they should have their ServerName and Id passed along to be persisted then responded with a message letting them know it was succesful.',
      async () => {
        const expectedSubscriptions = [
          {
            key : 'UpcomingClashTournamentDiscordDM',
            isOn: false
          }
        ];
        const expectedSubscriptionResponse = [
          {
            key : 'UpcomingClashTournamentDiscordDM',
            isOn: true
          }
        ];
        const msg = buildMockInteraction();
        let {
          retrieveUserSubscriptionsMock,
          subscribeUserMock,
        } = setupExpectedSuccessfulSubscription(expectedSubscriptions,
          expectedSubscriptionResponse);

        await subscribe.execute(msg);

        expect(retrieveUserSubscriptionsMock).toBeCalledTimes(1);
        expect(retrieveUserSubscriptionsMock).toBeCalledWith(msg.user.id);
        expect(subscribeUserMock).toBeCalledTimes(1);
        expect(retrieveUserSubscriptionsMock).toBeCalledWith(msg.user.id);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith(
          'You have subscribed. You will receive a notification the Monday before ' +
          'a Clash Tournament weekend. If you want to unsubscribe at any time please use /unsubscribe');
      })

    test(
      'When a user requests to subscribe and the subscription returns true initially, they should have their '
      +
      'ServerName and Id passed along to be persisted then responded with a message letting them know '
      +
      'it was failed.', async () => {
        const msg = buildMockInteraction();
        let {
          retrieveUserSubscriptionsMock,
          subscribeUserMock,
        } = setupExpectedSuccessfulSubscription([], []);

        await subscribe.execute(msg);

        expect(retrieveUserSubscriptionsMock).toBeCalledTimes(1);
        expect(retrieveUserSubscriptionsMock).toBeCalledWith(msg.user.id);
        expect(subscribeUserMock).not.toHaveBeenCalled();
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith('You are already subscribed.');
      })
  })

  describe('Error', () => {
    test(
      'When an error occurs while trying to retrieve user subscriptions, the user should be notified.',
      async () => {
        const msg = buildMockInteraction();
        let retrieveUserSubscriptionsMock = setupFailedRetrieveSubscriptions();
        await subscribe.execute(msg);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(retrieveUserSubscriptionsMock).toBeCalledTimes(1);
        expect(retrieveUserSubscriptionsMock).toBeCalledWith(msg.user.id);
        expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
        expect(errorHandling.handleError)
          .toHaveBeenCalledWith(subscribe.name, new Error('Something went wrong.'),
            msg, 'Failed to subscribe.');
      });

    test('When an error occurs while trying to subscribe, the user should be notified.',
      async () => {
        const msg = buildMockInteraction();
        let {
          retrieveUserSubscriptionsMock,
          subscribeUserMock,
        } = setupFailedSubscribe([
          {
            key : 'UpcomingClashTournamentDiscordDM',
            isOn: false
          }
        ]);
        await subscribe.execute(msg);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(retrieveUserSubscriptionsMock).toBeCalledTimes(1);
        expect(retrieveUserSubscriptionsMock).toBeCalledWith(msg.user.id);
        expect(subscribeUserMock).toBeCalledTimes(1);
        expect(subscribeUserMock).toBeCalledWith(msg.user.id);
        expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
        expect(errorHandling.handleError)
          .toHaveBeenCalledWith(subscribe.name, new Error('Something went wrong.'),
            msg, 'Failed to subscribe.');
      });
  });
});
