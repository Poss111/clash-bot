const healthCheckServiceImpl = require('../health-check-service-impl');
const nock = require('nock');

describe('Health Check Service', () => {
    describe('GET - /api/health', () => {
        test('When I call the health check url for the dependent service, it should return with a successful response.', () => {
            const expectedResponse = {
                status: 'Healthy'
            };
            nock('http://localhost')
                .get(`/api/health`)
                .reply(200, expectedResponse);
            return healthCheckServiceImpl.checkServiceHealth().then(response => expect(response).toEqual(expectedResponse));
        })
    })
})
