const dance = require('../dance');
const throttleHandling = require('../../utility/throttle-handling');
const {buildMockInteraction} = require('./shared-test-utilities/shared-test-utilities.test');

jest.mock('../../utility/throttle-handling');

afterAll(() => {
    jest.setTimeout(5000);
})

test('Should dance when not throttled.', async () => {
    jest.setTimeout(30000);
    const msg = {
        deferReply: jest.fn(),
        reply: jest.fn().mockResolvedValue({}),
        followUp: jest.fn().mockResolvedValue({}),
        user: {
            id: '1',
            username: 'TestPlayer'
        },
        member: {
            guild: {
                name: 'TestServer'
            }
        }
    };
    await dance.execute(msg);
    expect(msg.deferReply).toHaveBeenCalledTimes(1);
    expect(msg.reply).toHaveBeenCalledTimes(1);
    expect(msg.reply).toHaveBeenCalledWith('I');
    expect(msg.followUp).toHaveBeenCalledTimes(8);
    expect(msg.followUp).toHaveBeenCalledWith('want');
    expect(msg.followUp).toHaveBeenCalledWith('to');
    expect(msg.followUp).toHaveBeenCalledWith('dance!');
    expect(msg.followUp).toHaveBeenCalledWith('0.0');
    expect(msg.followUp).toHaveBeenCalledWith('|0.0/');
    expect(msg.followUp).toHaveBeenCalledWith('\\0.0|');
    expect(msg.followUp).toHaveBeenCalledWith('|0.0|');
    expect(msg.followUp).toHaveBeenCalledWith('_0.0|');
})

test('Should not dance when throttled and should not return a message if a notification has already gone out.', async () => {
    throttleHandling.isThrottled.mockReturnValue(true);
    throttleHandling.hasServerBeenNotified.mockReturnValue(false);
    const msg = buildMockInteraction();
    await dance.execute(msg);
    expect(msg.deferReply).not.toHaveBeenCalled();
    expect(msg.reply).toHaveBeenCalledTimes(1);
    expect(msg.reply).toHaveBeenCalledWith('I see you know the ways of the spam. ' +
        'If you want me to dance again, you must wait 30 seconds ;)');
    throttleHandling.hasServerBeenNotified.mockReturnValue(true);
    dance.execute(msg);
    expect(msg.deferReply).not.toHaveBeenCalled();
    expect(msg.reply).toHaveBeenCalledTimes(1);
})
