const dance = require('../dance');
const throttleHandling = require('../../utility/throttle-handling');

jest.mock('../../utility/throttle-handling');

test('Should dance when not throttled.', async () => {
    jest.setTimeout(10000);
    let messagePassed = [];
    let msg = {
        channel: {
            send: (value) => messagePassed.push(value),
        },
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    dance.execute(msg);
    await new Promise(resolve => setTimeout(() => resolve(), 8000))
        .then(() => expect(messagePassed.length).toEqual(9));
})

test('Should not dance when throttled and should not return a message if a notification has already gone out.', () => {
    throttleHandling.isThrottled.mockReturnValue(true);
    throttleHandling.hasServerBeenNotified.mockReturnValue(false);
    let messagePassed = [];
    let replyPassed = '';
    let msg = {
        reply: (value) => replyPassed = value,
        channel: {
            send: (value) => messagePassed.push(value),
        },
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    dance.execute(msg);
    expect(replyPassed).toEqual('I see you know the ways of the spam. If you want me to dance again, you must wait 30 seconds ;)');
    throttleHandling.hasServerBeenNotified.mockReturnValue(true);
    replyPassed = '';
    msg = {
        reply: (value) => replyPassed = value,
        channel: {
            send: (value) => messagePassed.push(value),
        },
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    dance.execute(msg);
    expect(replyPassed).toEqual('');
})
