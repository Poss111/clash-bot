const { httpCall } = require('./httpHelper');

class HealthCheckServiceImpl {
    checkServiceHealth() {
        return httpCall('localhost', '/api/health', 'GET');
    }
}

module.exports = new HealthCheckServiceImpl;
