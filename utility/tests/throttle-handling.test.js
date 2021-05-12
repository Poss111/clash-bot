const ThrottleHandling = require('../throttle-handling');

test('Should register a resource to timeout after 5 seconds.', () => {
    ThrottleHandling.placeThrottle('testing', 5000);
    expect(ThrottleHandling.isThrottled('testing')).toBeTruthy();
})

test('Should register a resource to timeout after 1 second.', () => {
    ThrottleHandling.placeThrottle('test', 1000);
    setTimeout(() => expect(ThrottleHandling.isThrottled('test')).toBeFalsy(), 2000);
})
