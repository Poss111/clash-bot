const unregister = require('../unregister');
const dynamoDbUtils = require('../../dao/dynamo-db-impl');
const errorHandler = require('../../utility/error-handling');

jest.mock('../../dao/dynamo-db-impl');
jest.mock('../../utility/error-handling');

test('When a player exists on a team is unregistered, the player should be notified that we have successfully removed them.', (done) => {
    let messagePassed = '';
    let sendMessage = '';
    let msg = {
        reply: (value) => messagePassed = value,
        channel: {
            send: (value) => sendMessage = value
        },
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    function callback() {
        try {
            expect(messagePassed).toEqual(`Removed you from your Team. Please use !clash register if you would like to join again. Thank you!`);
            done();
        } catch(error) {
            done(error);
        }
    }
    dynamoDbUtils.deregisterPlayer.mockResolvedValue(true);
    unregister.execute(msg, callback);
    expect(sendMessage).toEqual(`Unregistering ${msg.author.username}...`)
})

test('When a player does not exist on a team is unregistered, the player should be notified that we have not successfully removed them.', (done) => {
    let messagePassed = '';
    let sendMessage = '';
    let msg = {
        reply: (value) => messagePassed = value,
        channel: {
            send: (value) => sendMessage = value
        },
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    function callback() {
        try {
            expect(messagePassed).toEqual(`We did not find you on an existing Team. Please use !clash register if you would like to join again. Thank you!`);
            done();
        } catch(error) {
            done(error);
        }
    }
    dynamoDbUtils.deregisterPlayer.mockResolvedValue(false);
    unregister.execute(msg, callback);
    expect(sendMessage).toEqual(`Unregistering ${msg.author.username}...`)
})

test('If an error occurs, the error handler will be invoked.', (done) => {
    let messagePassed = '';
    let sendMessage = '';
    let msg = {
        reply: (value) => messagePassed = value,
        channel: {
            send: (value) => sendMessage = value
        },
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    function callback() {
        try {
            done();
        } catch(error) {
            expect(errorHandler.mock.calls.length).toEqual(1);
            done(error);
        }
    }
    dynamoDbUtils.deregisterPlayer.mockRejectedValue('Some error occurred.');
    unregister.execute(msg, callback);
    expect(sendMessage).toEqual(`Unregistering ${msg.author.username}...`)
})
