const timeTracker = require('../time-tracker');

test('When a start time is passed then a time should be logged back out in milliseconds.', () => {
    expect(timeTracker.endExecution('sample command', (process.hrtime.bigint()-100000000n))).toBeTruthy();
})
