const { httpCall } = require('./httpHelper');
const { getUrl } = require('./service-helper');

class HealthCheckServiceImpl {
    checkServiceHealth() {
        return httpCall(getUrl(), '/api/health', 'GET');
    }
}

module.exports = new HealthCheckServiceImpl;
