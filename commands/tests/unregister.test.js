const unregister = require('../unregister');
const dynamoDbUtils = require('../../dao/dynamo-db-impl');
const errorHandling = require('../../utility/error-handling');

jest.mock('../../dao/dynamo-db-impl');
jest.mock('../../utility/error-handling');

test('When a player exists on a team is unregistered, the player should be notified that we have successfully removed them.', async () => {
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
    dynamoDbUtils.deregisterPlayer.mockResolvedValue(true);
    await unregister.execute(msg);
    expect(sendMessage).toEqual(`Unregistering ${msg.author.username}...`);
    expect(messagePassed).toEqual(`Removed you from your Team. Please use !clash register if you would like to join again. Thank you!`);
})

test('When a player does not exist on a team is unregistered, the player should be notified that we have not successfully removed them.', async () => {
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
    dynamoDbUtils.deregisterPlayer.mockResolvedValue(false);
    await unregister.execute(msg);
    expect(sendMessage).toEqual(`Unregistering ${msg.author.username}...`);
    expect(messagePassed).toEqual(`We did not find you on an existing Team. Please use !clash register if you would like to join again. Thank you!`);
})

test('If an error occurs, the error handler will be invoked.', async () => {
    let messagePassed = '';
    let sendMessage = '';
    errorHandling.handleError = jest.fn();
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
    dynamoDbUtils.deregisterPlayer.mockRejectedValue('Some error occurred.');
    await unregister.execute(msg);
    expect(sendMessage).toEqual(`Unregistering ${msg.author.username}...`);
    expect(errorHandling.handleError.mock.calls.length).toEqual(1);
})
