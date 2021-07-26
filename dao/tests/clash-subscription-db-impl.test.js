const clashSubscriptionDbImpl = require('../clash-subscription-db-impl');
const dynamoDbHelper = require('../impl/dynamo-db-helper');
const Joi = require('joi');

jest.mock('dynamodb');
jest.mock('../impl/dynamo-db-helper');

beforeEach(() => {
    jest.resetModules();
});

describe('Initialize Table connection', () => {
    test('Initialize the table connection to be used.', async () => {
        let expectedTableObject = { setupTable: true};
        dynamoDbHelper.initialize = jest.fn().mockResolvedValue(expectedTableObject);
        return clashSubscriptionDbImpl.initialize().then(() => {
            expect(clashSubscriptionDbImpl.clashSubscriptionTable).toEqual(expectedTableObject);
            expect(dynamoDbHelper.initialize).toBeCalledWith(clashSubscriptionDbImpl.tableName,
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
