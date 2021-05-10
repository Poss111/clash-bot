const help = require('./help');

test('help should return an embedded object to be posted in discord.', () => {
    let messagePassed = '';
    let msg = {};
    msg.channel = {
        send: (value) => messagePassed = value
    };
    help.execute(msg);
    expect(messagePassed.embed).toBeTruthy();
});
