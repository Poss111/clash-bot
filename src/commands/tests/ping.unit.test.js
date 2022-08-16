const ping = require('../ping');
const { buildMockInteraction } = require('./shared-test-utilities/shared-test-utilities.test');

test('ping will return with a pong for the message.', () => {
    let msg = buildMockInteraction();
    ping.execute(msg);
    expect(msg.reply).toHaveBeenCalledTimes(1);
    expect(msg.reply).toHaveBeenCalledWith('pong');
});
