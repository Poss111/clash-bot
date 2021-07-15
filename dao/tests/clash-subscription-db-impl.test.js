const clashSubscriptionDbImpl = require('../clash-subscription-db-impl');
const dynamodb = require('dynamodb');
const Joi = require('joi');

jest.mock('dynamodb');

beforeEach(() => {
    jest.resetModules();
    delete process.env.LOCAL;
});

describe('Initialize Table connection', () => {
    test('Initialize the table connection to be used.', async () => {
        dynamodb.define = jest.fn();
        return clashSubscriptionDbImpl.initialize().then(() => {
            expect(dynamodb.AWS.config.loadFromPath.mock.calls.length).toEqual(0);
            expect(dynamodb.AWS.config.update.mock.calls.length).toEqual(1);
            expect(dynamodb.define).toBeCalledTimes(1);
            expect(dynamodb.define).toBeCalledWith(clashSubscriptionDbImpl.tableName,
                {
                    hashKey: 'key',
                    timestamps: true,
                    schema: {
                        key: Joi.string(),
                        serverName: Joi.string(),
                        timeAdded: Joi.string()
                    }
                });
        });
    })

    test('Initialize the table connection to be used with Local.', () => {
        dynamodb.AWS.config.loadFromPath = jest.fn();
        dynamodb.AWS.config.update = jest.fn();
        dynamodb.define = jest.fn();
        process.env.LOCAL = true;
        return clashSubscriptionDbImpl.initialize().then(() => {
                expect(dynamodb.AWS.config.loadFromPath.mock.calls.length).toEqual(1);
                expect(dynamodb.AWS.config.update.mock.calls.length).toEqual(0);
                expect(dynamodb.define.mock.calls.length).toEqual(1);
            }
        )
    })
})

describe('Subscribe', () => {
    test('Subscribe should be passed with a user id and a Server.', async () => {
        let id = '12345667';
        let server = 'TestServer';
        let expectedResults = {
            key: id,
            serverName: server
        };
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.create = jest.fn().mockImplementation((sub, callback) => {
            callback(undefined, expectedResults)
        });
        return clashSubscriptionDbImpl.subscribe(id, server).then(data => {
            expect(data.key).toEqual(id);
            expect(data.serverName).toEqual(server);
            expect(data.timeAdded).toBeTruthy();
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.create).toBeCalledTimes(1);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.create).toBeCalledWith(expect.anything(), expect.any(Function));
        });
    })
})

describe('Unsubscribe', () => {
    test('Unsubscribe should be passed with a user id and a Server.', async () => {
        let id = '12345667';
        let server = 'TestServer';
        let expectedResults = {
            key: id,
            serverName: server
        };
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.destroy = jest.fn().mockImplementation((sub, options, callback) => {
            callback(undefined, expectedResults)
        });
        return clashSubscriptionDbImpl.unsubscribe(id, server).then(data => {
            expect(data).toEqual(expectedResults);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.destroy).toBeCalledTimes(1);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.destroy).toBeCalledWith(id, {ReturnValues: 'ALL_OLD'}, expect.any(Function));
        });
    })
})
