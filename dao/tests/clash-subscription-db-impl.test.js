const clashSubscriptionDbImpl = require('../clash-subscription-db-impl');
const streamTest = require('streamtest');
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
                    hashKey: 'userId',
                    timestamps: true,
                    schema: {userId: Joi.string(), serverName: Joi.string()}
                });
        });
    })

    test('Initialize the table connection to be used with Local.', () => {
        dynamodb.AWS.config.loadFromPath = jest.fn();
        dynamodb.AWS.config.update = jest.fn();
        dynamodb.define = jest.fn();
        process.env.LOCAL = true;
        return clashSubscriptionDbImpl.initialize().then((data) => {
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
            userId: id,
            serverName: server
        };
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.create = jest.fn().mockImplementation((sub, callback) => {
            callback(undefined, expectedResults)
        });
        return clashSubscriptionDbImpl.subscribe(id, server).then(data => {
            expect(data).toEqual(expectedResults);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.create).toBeCalledTimes(1);
        });
    })
})

describe('Unsubscribe', () => {
    test('Unsubscribe should be passed with a user id and a Server.', async () => {
        let id = '12345667';
        let server = 'TestServer';
        let expectedResults = {
            userId: id,
            serverName: server
        };
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.delete = jest.fn().mockImplementation((sub, callback) => {
            callback(undefined, expectedResults)
        });
        return clashSubscriptionDbImpl.unsubscribe(id, server).then(data => {
            expect(data).toEqual(expectedResults);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.delete).toBeCalledTimes(1);
        });
    })
})
