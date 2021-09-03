const { getUrl } = require('../service-helper');

beforeEach(() => {
    delete process.env.SERVICE_URL;
})

describe('Service Helper', () => {
    describe('Get Url', () => {
        test('When I call get url and the service url is not set, it should default to localhost.', () => {
            expect(getUrl()).toEqual('http://localhost');
        })
    })
    describe('Get Url - Set', () => {
        test('When I call get url and the service url is set, it should return the set value.', () => {
            process.env.SERVICE_URL = 'iam.anawesomeurl.com';
            expect(getUrl()).toEqual('iam.anawesomeurl.com');
        })
    })
})
