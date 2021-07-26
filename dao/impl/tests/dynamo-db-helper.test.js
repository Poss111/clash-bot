const dynamoDbHepler = require('../dynamo-db-helper');
const dynamodb = require('dynamodb');
const Joi = require('joi');

jest.mock('dynamodb');

beforeEach(() => {
    delete dynamoDbHepler.setupConfig;
    delete process.env.LOCAL;
    delete process.env.INTEGRATION_TEST;
    jest.resetAllMocks();
})

describe('Initialize Table connection', () => {
    test('Initialize the table connection to be used.', async () => {
        const tableData = { created: true };
        dynamodb.define = jest.fn().mockReturnValue(tableData);
        const expectedTableName = 'TableName';
        const expectedTableDef = {
            hashKey: 'key',
            timestamps: true,
            schema: {
                key: Joi.string(),
                serverName: Joi.string(),
                timeAdded: Joi.string()
            }
        };
        return dynamoDbHepler.initialize(expectedTableName, expectedTableDef).then((data) => {
            expect(dynamodb.AWS.config.loadFromPath.mock.calls.length).toEqual(0);
            expect(dynamodb.AWS.config.update.mock.calls.length).toEqual(1);
            expect(dynamodb.define).toBeCalledTimes(1);
            expect(dynamodb.define).toBeCalledWith(expectedTableName, expectedTableDef);
            expect(data).toEqual(tableData);
            expect(dynamoDbHepler.setupConfig).toBeTruthy();
        });
    })

    test('Initialize the table connection to be used with Local.', async () => {
        process.env.LOCAL = true;
        const tableData = { created: true };
        dynamodb.define = jest.fn().mockReturnValue(tableData);
        const expectedTableName = 'TableName';
        const expectedTableDef = {
            hashKey: 'key',
            timestamps: true,
            schema: {
                key: Joi.string(),
                serverName: Joi.string(),
                timeAdded: Joi.string()
            }
        };
        return dynamoDbHepler.initialize(expectedTableName, expectedTableDef).then((data) => {
            expect(dynamodb.AWS.config.loadFromPath.mock.calls.length).toEqual(1);
            expect(dynamodb.AWS.config.update.mock.calls.length).toEqual(0);
            expect(dynamodb.define).toBeCalledTimes(1);
            expect(dynamodb.define).toBeCalledWith(expectedTableName, expectedTableDef);
            expect(data).toEqual(tableData);
            expect(dynamoDbHepler.setupConfig).toBeTruthy();
        });
    })

    test('Initialize the table connection to be used with Integration Tests.', async () => {
        process.env.INTEGRATION_TEST = true;
        const tableData = { created: true };
        dynamodb.define = jest.fn().mockReturnValue(tableData);
        const expectedTableName = 'TableName';
        const expectedTableDef = {
            hashKey: 'key',
            timestamps: true,
            schema: {
                key: Joi.string(),
                serverName: Joi.string(),
                timeAdded: Joi.string()
            }
        };
        return dynamoDbHepler.initialize(expectedTableName, expectedTableDef).then((data) => {
            expect(dynamodb.AWS.config.loadFromPath).toBeCalledTimes(1);
            expect(dynamodb.AWS.config.loadFromPath).toBeCalledWith('./credentials.json');
            expect(dynamodb.AWS.config.update).toBeCalledWith({endpoint: "http://localhost:8000"});
            expect(dynamodb.define).toBeCalledTimes(1);
            expect(dynamodb.define).toBeCalledWith(expectedTableName, expectedTableDef);
            expect(data).toEqual(tableData);
            expect(dynamoDbHepler.setupConfig).toBeTruthy();
        });
    })

    test('Initialize should only setup AWS config once.', async () => {
        process.env.LOCAL = true;
        const tableData = { created: true };
        dynamodb.define = jest.fn().mockReturnValue(tableData);
        const expectedTableName = 'TableName';
        const expectedTableDef = {
            hashKey: 'key',
            timestamps: true,
            schema: {
                key: Joi.string(),
                serverName: Joi.string(),
                timeAdded: Joi.string()
            }
        };
        expect(dynamoDbHepler.setupConfig).toBeFalsy();
        await dynamoDbHepler.initialize(expectedTableName, expectedTableDef).then((data) => {
            expect(dynamodb.AWS.config.loadFromPath.mock.calls.length).toEqual(1);
            expect(dynamodb.AWS.config.update.mock.calls.length).toEqual(0);
            expect(dynamodb.define).toBeCalledTimes(1);
            expect(dynamodb.define).toBeCalledWith(expectedTableName, expectedTableDef);
            expect(data).toEqual(tableData);
            expect(dynamoDbHepler.setupConfig).toBeTruthy();
        });
        return dynamoDbHepler.initialize(expectedTableName, expectedTableDef).then((data) => {
            expect(dynamodb.AWS.config.loadFromPath).not.toBeCalledTimes(2);
            expect(dynamodb.AWS.config.update).toBeCalledTimes(0);
            expect(data).toEqual(tableData);
            expect(dynamoDbHepler.setupConfig).toBeTruthy();
        });
    })
})
