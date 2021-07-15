const clashSubscriptionDbImpl = require('../clash-subscription-db-impl');

describe('Subscribe', () => {
    test('Subscribe should be passed with a user id and a Server.', async () => {
        let id = '12345667';
        let server = 'TestServer';
        return clashSubscriptionDbImpl.subscribe(id, server).then(data => {
            expect(data).toBeTruthy();
        });
    })
})

describe('Unsubscribe', () => {
    test('Unsubscribe should be passed with a user id and a Server.', async () => {
        let id = '12345667';
        let server = 'TestServer';
        return clashSubscriptionDbImpl.unsubscribe(id, server).then(data => {
            expect(data).toBeTruthy();
        });
    })
})
