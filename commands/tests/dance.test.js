const dance = require('../dance');
const throttleHandling = require('../../utility/throttle-handling');

jest.mock('../../utility/throttle-handling');

test('Should dance when not throttled.', (done) => {
    jest.setTimeout(8000);
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
    function callback() {
        try {
            expect(messagePassed.length).toEqual(9);
            done();
        } catch(error) {
            done(error);
        }
    }
    dance.execute(msg, callback);
})

test('Should not dance when throttled.', (done) => {
    throttleHandling.isThrottled.mockReturnValue(true);
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
    function callback() {
        try {
            expect(replyPassed).toEqual('I see you know the ways of the spam. If you want me to dance again, you must wait 30 seconds ;)');
            done();
        } catch(error) {
            done(error);
        }
    }
    dance.execute(msg, callback);
})
