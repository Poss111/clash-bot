const subscribe = require('../subscribe')
const clashSubscriptionDbImpl = require('../../dao/clash-subscription-db-impl');
const errorHandling = require('../../utility/error-handling');

jest.mock('../../dao/clash-subscription-db-impl');
jest.mock('../../utility/error-handling');

describe('Subscribe', () => {

    test('When a user requests to subscribe, they should have their ServerName and Id passed along to be persisted then responded with a message letting them know it was succesful.', async () => {
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

        clashSubscriptionDbImpl.subscribe = jest.fn().mockResolvedValue({ id: '1234566', server: msg.guild.name });

        await subscribe.execute(msg);
        expect(clashSubscriptionDbImpl.subscribe).toBeCalledTimes(1);
        expect(clashSubscriptionDbImpl.subscribe).toBeCalledWith(msg.author.id, msg.guild.name);
        expect(messagePassed).toEqual('You have subscribed. You will receive a notification the Monday before ' +
            'a Clash Tournament weekend. If you want to unsubscribe at any time please use !clash unsubscribe');
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

        clashSubscriptionDbImpl.subscribe = jest.fn().mockRejectedValue('Something went wrong.');
        errorHandling.handleError = jest.fn();

        await subscribe.execute(msg);
        expect(clashSubscriptionDbImpl.subscribe).toBeCalledTimes(1);
        expect(clashSubscriptionDbImpl.subscribe).toBeCalledWith(msg.author.id, msg.guild.name);
        expect(errorHandling.handleError.mock.calls.length).toEqual(1);
    })
})
