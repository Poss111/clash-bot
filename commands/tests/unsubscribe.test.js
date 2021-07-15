const unsubscribe = require('../unsubscribe')
const clashSubscriptionDbImpl = require('../../dao/clash-subscription-db-impl');
const errorHandling = require('../../utility/error-handling');

jest.mock('../../dao/clash-subscription-db-impl');
jest.mock('../../utility/error-handling');

describe('Unsubscribe', () => {

    test('When a user requests to unsubscribe, they should have their ServerName and Id passed along to be persisted then responded with a message letting them know it was successful.', async () => {
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

        clashSubscriptionDbImpl.unsubscribe = jest.fn().mockResolvedValue({ id: '1234566', server: msg.guild.name });

        await unsubscribe.execute(msg);
        expect(messagePassed).toEqual('You have successfully unsubscribed.');
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

        clashSubscriptionDbImpl.unsubscribe = jest.fn().mockRejectedValue('Something went wrong.');
        errorHandling.handleError = jest.fn();

        await unsubscribe.execute(msg);
        expect(clashSubscriptionDbImpl.unsubscribe).toBeCalledTimes(1);
        expect(clashSubscriptionDbImpl.unsubscribe).toBeCalledWith(msg.author.id, msg.guild.name);
        expect(errorHandling.handleError.mock.calls.length).toEqual(1);
    })
})
