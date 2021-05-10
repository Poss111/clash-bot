const ping = require('./ping');

test('ping will return with a pong for the message.', () => {
    let messagePassed = '';
    let msg = {
        reply: (value) => messagePassed = value
    };
    ping.execute(msg);
    expect(messagePassed).toBe('pong');
})
