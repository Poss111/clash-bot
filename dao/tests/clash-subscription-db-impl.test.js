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
                        timeAdded: Joi.string(),
                        subscribed: Joi.boolean(),
                        preferredChampions: Joi.array()
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
            serverName: server,
            subscribed: true
        };
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.create = jest.fn().mockImplementation((sub, callback) => {
            callback(undefined, expectedResults)
        });
        return clashSubscriptionDbImpl.subscribe(id, server).then(data => {
            expect(data.key).toEqual(id);
            expect(data.serverName).toEqual(server);
            expect(data.timeAdded).toBeTruthy();
            expect(data.subscribed).toBeTruthy();
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
            serverName: server,
            timeAdded: 'Jan 20 2021 11:30 PM EST',
            subscribed: false
        };
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.update = jest.fn().mockImplementation((sub, callback) => {
            callback(undefined, expectedResults)
        });
        return clashSubscriptionDbImpl.unsubscribe(id, server).then(data => {
            expect(data.key).toEqual(id);
            expect(data.serverName).toEqual(server);
            expect(data.timeAdded).toBeTruthy();
            expect(data.subscribed).toBeFalsy();
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.update).toBeCalledTimes(1);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.update).toBeCalledWith(expect.anything(), expect.any(Function));
        });
    })
})

describe('Update preferred Champion', () => {
    test('Should be able to create a new record of the Users preferred champions if the user does not exist.', () => {
        let id = '12345667';
        let server = 'TestServer';
        let championToAdd = 'Akali';
        let expectedResults = {
            key: id,
            serverName: server,
            preferredChampions: ['Akali'],
            subscribed: false,
            timeAdded: expect.any(String)
        };
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.query = jest.fn().mockImplementation((id, callback) => callback());
        clashSubscriptionDbImpl.clashSubscriptionTable.create = jest.fn().mockImplementation((sub, callback) => {
            callback(undefined, expectedResults)
        });
        return clashSubscriptionDbImpl.updatePreferredChampions(id, championToAdd).then(data => {
            expect(data).toEqual(expectedResults);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.create).toBeCalledTimes(1);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.create).toBeCalledWith(expectedResults, expect.any(Function));
        });
    })

    test('Should be returned with emptyChampionArray as true if user is trying to remove a champion from their list and they do not exist.', () => {
        let id = '12345667';
        let championToAdd = 'Akali';
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.query = jest.fn().mockImplementation((id, callback) => callback());
        clashSubscriptionDbImpl.clashSubscriptionTable.create = jest.fn();
        return clashSubscriptionDbImpl.updatePreferredChampions(id, championToAdd, true).then(data => {
            expect(data).toEqual({emptyChampionArray: true});
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.create).toBeCalledTimes(0);
        });
    })

    test('Should be able to update a record of the Users preferred champions if the user does exist.', () => {
        let id = '12345667';
        let server = 'TestServer';
        let championToAdd = 'Aatrox';
        let initialData = {
            key: id,
            serverName: server,
            preferredChampions: ['Akali'],
            subscribed: false,
            timeAdded: expect.any(String)
        };
        let expectedData = JSON.parse(JSON.stringify(initialData));
        expectedData.preferredChampions.push(championToAdd);
        expectedData.timeAdded = expect.any(String)
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.query = jest.fn().mockImplementation((data, callback) => {
            if (data && data === id) {
                callback(undefined, initialData);
            }
            callback(new Error('Failed to retrieve'));
        })
        clashSubscriptionDbImpl.clashSubscriptionTable.update = jest.fn().mockImplementation((sub, callback) => {
            if (sub.id === expectedData.id) {
                callback(undefined, expectedData);
            }
            callback();
        });
        return clashSubscriptionDbImpl.updatePreferredChampions(id, championToAdd).then(data => {
            expect(data).toEqual(expectedData);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.update).toBeCalledTimes(1);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.update).toBeCalledWith(expectedData, expect.any(Function));
        });
    })

    test('Should be able to remove a found champion of the Users preferred champions if the user does exist and the user requets it.', () => {
        let id = '12345667';
        let server = 'TestServer';
        let championToRemove = 'Aatrox';
        let initialData = {
            key: id,
            serverName: server,
            preferredChampions: ['Akali', 'Aatrox'],
            subscribed: false,
            timeAdded: expect.any(String)
        };
        let expectedData = JSON.parse(JSON.stringify(initialData));
        expectedData.preferredChampions = expectedData.preferredChampions.filter(record => record !== championToRemove);
        expectedData.timeAdded = expect.any(String);
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.query = jest.fn().mockImplementation((data, callback) => {
            if (data && data === id) {
                callback(undefined, initialData);
            }
            callback(new Error('Failed to retrieve'));
        })
        clashSubscriptionDbImpl.clashSubscriptionTable.update = jest.fn().mockImplementation((sub, callback) => {
            if (sub.id === expectedData.id) {
                callback(undefined, expectedData);
            }
            callback();
        });
        return clashSubscriptionDbImpl.updatePreferredChampions(id, championToRemove, true).then(data => {
            expect(data).toEqual(expectedData);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.update).toBeCalledTimes(1);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.update).toBeCalledWith(expectedData, expect.any(Function));
        });
    })

    test('If the user is requesting to add a champion and the champion array is undefined, they should be able to still add.', () => {
        let id = '12345667';
        let server = 'TestServer';
        let championToAdd = 'Aatrox';
        let initialData = {
            key: id,
            serverName: server,
            subscribed: false,
            timeAdded: expect.any(String)
        };
        let expectedData = JSON.parse(JSON.stringify(initialData));
        expectedData.preferredChampions = [championToAdd];
        expectedData.timeAdded = expect.any(String);
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.query = jest.fn().mockImplementation((data, callback) => {
            if (data && data === id) {
                callback(undefined, initialData);
            }
            callback(new Error('Failed to retrieve'));
        })
        clashSubscriptionDbImpl.clashSubscriptionTable.update = jest.fn().mockImplementation((sub, callback) => {
            if (sub.id === expectedData.id) {
                callback(undefined, expectedData);
            }
            callback();
        });
        return clashSubscriptionDbImpl.updatePreferredChampions(id, championToAdd).then(data => {
            expect(data).toEqual(expectedData);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.update).toBeCalledTimes(1);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.update).toBeCalledWith(expectedData, expect.any(Function));
        });
    })

    test('If the user is requesting to remove a champion and the champion array is undefined, they should be returned with emptyChampionArray as true.', () => {
        let id = '12345667';
        let server = 'TestServer';
        let championToRemove = 'Aatrox';
        let initialData = {
            key: id,
            serverName: server,
            subscribed: false,
            timeAdded: expect.any(String)
        };
        let expectedData = JSON.parse(JSON.stringify(initialData));
        expectedData.preferredChampions = [];
        expectedData.timeAdded = expect.any(String);
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.query = jest.fn().mockImplementation((data, callback) => {
            if (data && data === id) {
                callback(undefined, initialData);
            }
            callback(new Error('Failed to retrieve'));
        })
        clashSubscriptionDbImpl.clashSubscriptionTable.update = jest.fn().mockImplementation((sub, callback) => {
            if (sub.id === expectedData.id) {
                callback(undefined, expectedData);
            }
            callback();
        });
        return clashSubscriptionDbImpl.updatePreferredChampions(id, championToRemove, true).then(data => {
            expect(data).toEqual({emptyChampionArray: true});
        });
    })

    test('Should return an error if update throws one when requesting to update champion suggestions.', () => {
        let id = '12345667';
        let server = 'TestServer';
        let championToRemove = 'Aatrox';
        let initialData = {
            key: id,
            serverName: server,
            preferredChampions: ['Akali', 'Aatrox'],
            subscribed: false,
            timeAdded: expect.any(String)
        };
        let expectedData = JSON.parse(JSON.stringify(initialData));
        expectedData.preferredChampions = expectedData.preferredChampions.filter(record => record !== championToRemove);
        expectedData.timeAdded = expect.any(String);
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.query = jest.fn().mockImplementation((data, callback) => {
            if (data && data === id) {
                callback(undefined, initialData);
            }
            callback(new Error('Failed to retrieve'));
        })
        clashSubscriptionDbImpl.clashSubscriptionTable.update = jest.fn().mockImplementation((sub, callback) => {
            callback(new Error('Failed to update.'));
        });
        return clashSubscriptionDbImpl.updatePreferredChampions(id, championToRemove, true).then(data => {
            expect(data).toEqual(expectedData);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.update).toBeCalledTimes(1);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.update).toBeCalledWith(expectedData, expect.any(Function));
        }).catch(err => expect(err).toEqual(new Error('Failed to update.')));
    })

    test('Should return an error if create throws one when requesting to update champion suggestions.', () => {
        let id = '12345667';
        let server = 'TestServer';
        let championToRemove = 'Aatrox';
        let initialData = {
            key: id,
            serverName: server,
            preferredChampions: ['Akali', 'Aatrox'],
            subscribed: false,
            timeAdded: expect.any(String)
        };
        let expectedData = JSON.parse(JSON.stringify(initialData));
        expectedData.preferredChampions = expectedData.preferredChampions.filter(record => record !== championToRemove);
        expectedData.timeAdded = expect.any(String);
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.query = jest.fn().mockImplementation((data, callback) => callback());
        clashSubscriptionDbImpl.clashSubscriptionTable.create = jest.fn().mockImplementation((sub, callback) => callback(new Error('Failed to create.')));
        return clashSubscriptionDbImpl.updatePreferredChampions(id, championToRemove).then(data => {
            expect(data).toEqual(expectedData);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.create).toBeCalledTimes(1);
            expect(clashSubscriptionDbImpl.clashSubscriptionTable.create).toBeCalledWith(expectedData, expect.any(Function));
        }).catch(err => expect(err).toEqual(new Error('Failed to create.')));
    })
})

describe('Get User Subscription', () => {
    test('I should be able to retrieve a user detail by an id.', () => {
        let id = '123456789';
        let server = 'Goon Squad';
        let expectedResults = {
            key: id,
            serverName: server,
            preferredChampions: ['Akali'],
            subscribed: false
        };
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.query = jest.fn().mockImplementation((data, callback) => {
            if (data && data === id) {
                callback(undefined, expectedResults);
            } else {
                callback(new Error('Failed to retrieve'));
            }
        })
        return clashSubscriptionDbImpl.retrieveUserDetails(id).then(data => {
            expect(data).toEqual(expectedResults)
        })
    })

    test('I should be returned an empty object if the user record does not exist.', () => {
        let id = '123456789';
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.query = jest.fn().mockImplementation((data, callback) => {
            if (data) {
                callback(undefined, {});
            } else {
                callback(new Error('Failed to retrieve'));
            }
        })
        return clashSubscriptionDbImpl.retrieveUserDetails(id).then(data => {
            expect(data).toEqual({});
        })
    })

    test('I should be returned an empty object if the user record does not exist and the object returned is undefined.', () => {
        let id = '123456789';
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.query = jest.fn().mockImplementation((data, callback) => {
            if (data) {
                callback();
            } else {
                callback(new Error('Failed to retrieve'));
            }
        })
        return clashSubscriptionDbImpl.retrieveUserDetails(id).then(data => {
            expect(data).toEqual({});
        })
    })

    test('I should be able to return the error if one occurs.', () => {
        let id = '123456789';
        clashSubscriptionDbImpl.clashSubscriptionTable = jest.fn();
        clashSubscriptionDbImpl.clashSubscriptionTable.query = jest.fn().mockImplementation((data, callback) => {
            callback(new Error('Failed to retrieve'));
        })
        return clashSubscriptionDbImpl.retrieveUserDetails(id)
            .then(data => expect(data).toBeTruthy())
            .catch(err => expect(err).toEqual(new Error('Failed to retrieve')))
    })
})
