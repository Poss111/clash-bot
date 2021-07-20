
class ThrottleHandling {

    resourceThrottling = new Map();
    notifiedServers = [];

    constructor() {}

    isThrottled(resourceName, serverName) {
        const resourceThrottlingElement = this.resourceThrottling.get(`${resourceName}#${serverName}`);
        return resourceThrottlingElement
            && Date.now() - resourceThrottlingElement.startTime <= resourceThrottlingElement.timeout;
    }

    placeThrottle(resourceName, serverName, timeInMilliseconds) {
        this.resourceThrottling.set(`${resourceName}#${serverName}`, { startTime: Date.now(), timeout: timeInMilliseconds});
    }

    hasServerBeenNotified(resourceName, serverName) {
        return this.notifiedServers.find(record => record === `${resourceName}#${serverName}`) !== undefined;
    }

    setServerNotified(resourceName, serverName) {
        this.notifiedServers.push(`${resourceName}#${serverName}`);
    }

    removeServerNotified(resourceName, serverName) {
        this.notifiedServers = this.notifiedServers.filter(record => record !==`${resourceName}#${serverName}`);
    }

}

module.exports = new ThrottleHandling;
