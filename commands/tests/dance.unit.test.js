const dance = require('../dance');
const throttleHandling = require('../../utility/throttle-handling');
const {buildMockInteraction} = require('./shared-test-utilities/shared-test-utilities.test');

jest.mock('../../utility/throttle-handling');

afterAll(() => {
    jest.setTimeout(5000);
})

test('Should dance when not throttled.', async () => {
    jest.setTimeout(30000);
    const msg = buildMockInteraction();
    await dance.execute(msg);
    expect(msg.deferReply).toHaveBeenCalledTimes(1);
    expect(msg.editReply).toHaveBeenCalledTimes(9);
    expect(msg.editReply).toHaveBeenCalledWith('I');
    expect(msg.editReply).toHaveBeenCalledWith('want');
    expect(msg.editReply).toHaveBeenCalledWith('to');
    expect(msg.editReply).toHaveBeenCalledWith('dance!');
    expect(msg.editReply).toHaveBeenCalledWith('0.0');
    expect(msg.editReply).toHaveBeenCalledWith('|0.0/');
    expect(msg.editReply).toHaveBeenCalledWith('\\0.0|');
    expect(msg.editReply).toHaveBeenCalledWith('|0.0|');
    expect(msg.editReply).toHaveBeenCalledWith('_0.0|');
})

test('Should not dance when throttled and should not return a message if a notification has already gone out.', async () => {
    throttleHandling.isThrottled.mockReturnValue(true);
    throttleHandling.hasServerBeenNotified.mockReturnValue(false);
    const msg = buildMockInteraction();
    await dance.execute(msg);
    expect(msg.deferReply).not.toHaveBeenCalled();
    expect(msg.editReply).toHaveBeenCalledTimes(1);
    expect(msg.editReply).toHaveBeenCalledWith('I see you know the ways of the spam. ' +
        'If you want me to dance again, you must wait 30 seconds ;)');
    throttleHandling.hasServerBeenNotified.mockReturnValue(true);
    dance.execute(msg);
    expect(msg.deferReply).not.toHaveBeenCalled();
    expect(msg.editReply).toHaveBeenCalledTimes(1);
})
