const ThrottleHandling = require('../throttle-handling');

beforeEach(() => {
    ThrottleHandling.notifiedServers = [];
    ThrottleHandling.resourceThrottling = new Map();
})

test('Should register a resource to timeout after 5 seconds.', () => {
    ThrottleHandling.placeThrottle('testing', 'TestServer', 5000);
    expect(ThrottleHandling.isThrottled('testing', 'TestServer')).toBeTruthy();
})

test('Should register a resource to timeout after 1 second.', () => {
    ThrottleHandling.placeThrottle('test', 'TestServer', 1000);
    setTimeout(() => expect(ThrottleHandling.isThrottled('test', 'TestServer')).toBeFalsy(), 2000);
})

test('Should return if the server has been notified.', () => {
    let resourceName = 'test';
    let serverName = 'TestServer';
    expect(ThrottleHandling.hasServerBeenNotified(resourceName, serverName)).toBeFalsy();
    ThrottleHandling.notifiedServers.push(`${resourceName}#${serverName}`);
    expect(ThrottleHandling.hasServerBeenNotified(resourceName, serverName)).toBeTruthy();
})

test('Should set the server and resource name that has been notified', () => {
    let resourceName = 'test';
    let serverName = 'TestServer';
    ThrottleHandling.setServerNotified(resourceName, serverName);
    expect(ThrottleHandling.notifiedServers).toHaveLength(1);
})

test('Should remove the server and resource name that has been notified', () => {
    let resourceName = 'test';
    let serverName = 'TestServer';
    ThrottleHandling.notifiedServers.push(`${resourceName}#${serverName}`);
    ThrottleHandling.removeServerNotified(resourceName, serverName);
    expect(ThrottleHandling.notifiedServers).toHaveLength(0);
})
