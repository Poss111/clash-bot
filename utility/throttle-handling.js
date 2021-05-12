class ThrottleHandling {

    resourceThrottling = new Map();

    constructor() {}

    isThrottled(resourceName) {
        const resourceThrottlingElement = this.resourceThrottling.get(resourceName);
        return resourceThrottlingElement
            && Date.now() - resourceThrottlingElement.startTime <= resourceThrottlingElement.timeout;
    }

    placeThrottle(resourceName, timeInMilliseconds) {
        this.resourceThrottling.set(resourceName, { startTime: Date.now(), timeout: timeInMilliseconds});
    }
}

module.exports = new ThrottleHandling;
