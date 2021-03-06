const {httpCall} = require('../httpHelper')
const nock = require('nock');

describe('Http Helper', () => {

    beforeAll(() => {
        process.env.HEADER_KEY = 'headerOfHeaders';
    })
    describe('Base Case', () => {
        test('Get - Should be able to make a simple get call.', () => {
            const expectedResponse = {message: 'success'};
            nock('http://localhost', {
                reqheaders: {
                    'headerOfHeaders': 'freljord'
                }
            })
                .get('/api/sample')
                .reply(200, {message: 'success'});
            return httpCall('http://localhost', '/api/sample', 'GET').then((response) => {
                expect(response).toEqual(expectedResponse);
            })
        })

        test('Post - Should be able to make a simple post call.', () => {
            const expectedResponse = {message: 'success'};
            const payload = {message: 'body'};
            nock('http://localhost', {
                reqheaders: {
                    'headerOfHeaders': 'freljord'
                }
            })
                .post('/api/sample', payload)
                .reply(200, {message: 'success'});
            return httpCall('http://localhost', '/api/sample', 'POST', payload).then((response) => {
                expect(response).toEqual(expectedResponse);
            })
        })

        test('Put - Should be able to make a simple post call.', () => {
            const expectedResponse = {message: 'success'};
            const payload = {message: 'body'};
            nock('http://localhost', {
                reqheaders: {
                    'headerOfHeaders': 'freljord'
                }
            })
                .put('/api/sample', payload)
                .reply(200, {message: 'success'});
            return httpCall('http://localhost', '/api/sample', 'PUT', payload).then((response) => {
                expect(response).toEqual(expectedResponse);
            })
        })

        test('Delete - Should be able to make a simple post call.', () => {
            const expectedResponse = {message: 'success'};
            const payload = {message: 'body'};
            nock('http://localhost', {
                reqheaders: {
                    'headerOfHeaders': 'freljord'
                }
            })
                .delete('/api/sample', payload)
                .reply(200, {message: 'success'});
            return httpCall('http://localhost', '/api/sample', 'DELETE', payload).then((response) => {
                expect(response).toEqual(expectedResponse);
            })
        })
    })

    describe('Error Handling', () => {
        test('400 - It should still respond the message for processing by the application.', () => {
            const expectedResponse = {error: 'Something unsuccessful happened.'};
            const payload = {message: 'body'};
            nock('http://localhost', {
                reqheaders: {
                    'headerOfHeaders': 'freljord'
                }
            })
                .post('/api/sample', payload)
                .reply(400, expectedResponse);
            return httpCall('http://localhost', '/api/sample', 'POST', payload).then((response) => {
                expect(response).toEqual(expectedResponse);
            })
        })

        test('500 - It should still respond the message for processing by the application.', () => {
            const expectedResponse = {error: 'Something unsuccessful happened.'};
            const payload = {message: 'body'};
            nock('http://localhost', {
                reqheaders: {
                    'headerOfHeaders': 'freljord'
                }
            })
                .post('/api/sample', payload)
                .reply(500, expectedResponse);
            return httpCall('http://localhost', '/api/sample', 'POST', payload).then(() => {
                expect(true).toBeFalsy();
            }).catch((err) => expect(err).toEqual("Request failed with status code 500"));
        })
    })
})
