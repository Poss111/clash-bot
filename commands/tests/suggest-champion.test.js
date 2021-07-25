const suggestChampion = require('../suggest-champion');
const clashSubscriptionDb = require('../../dao/clash-subscription-db-impl');
const errorHandler = require('../../utility/error-handling');
const riotApi = require('@fightmegg/riot-api');

jest.mock('../../dao/clash-subscription-db-impl');
jest.mock('../../utility/error-handling');
jest.mock('@fightmegg/riot-api');

describe('Suggest Champion Command', () => {
    test('A User should be able to pass in a champion name as an argument to be added to their preferred champions list.', async () => {
        let msg = {
            author: {
                username: 'Sample User',
                id: '123456'
            },
            guild: {
                name: 'Good Squad'
            },
            send: jest.fn(),
            reply: jest.fn()
        }
        let args = ['Ahri'];
        let expectedResults = {
            key: msg.author.id,
            serverName: msg.guild.name,
            preferredChampions: args,
            subscribed: false,
            timeAdded: expect.any(String)
        };
        prepareDDragonApiData();
        clashSubscriptionDb.updatePreferredChampions = jest.fn().mockResolvedValue(expectedResults);
        await suggestChampion.execute(msg, args)
        expect(msg.reply).toBeCalledWith(`Successfully updated your preferred champions list, here are your current Champions: '${expectedResults.preferredChampions}'`);
        expect(clashSubscriptionDb.updatePreferredChampions).toBeCalledWith(msg.author.id, args[0]);
    })

    describe('Should validate user input', () => {
        test('A champion should be required to be passed as the first argument.', async () => {
            let msg = {
                author: {
                    username: 'Sample User',
                    id: '123456'
                },
                guild: {
                    name: 'Good Squad'
                },
                send: jest.fn(),
                reply: jest.fn()
            }
            let args = [];
            clashSubscriptionDb.updatePreferredChampions = jest.fn();
            await suggestChampion.execute(msg, args)
            expect(msg.reply).toBeCalledWith('no champion name was passed. Please pass one.');
            expect(clashSubscriptionDb.updatePreferredChampions).toBeCalledTimes(0);
        })

        test('The champion passed should be a valid League of Legends champion name.', async () => {
            let msg = {
                author: {
                    username: ' Sample User',
                    id: '123456'
                },
                guild: {
                    name: 'Good Squad'
                },
                send: jest.fn(),
                reply: jest.fn()
            }
            let args = ['DNE'];
            prepareDDragonApiData();
            clashSubscriptionDb.updatePreferredChampions = jest.fn();
            await suggestChampion.execute(msg, args)
            expect(msg.reply).toBeCalledWith(`Champion name passed does not exist. Please validate with !clash champions ${args[0]}`);
            expect(clashSubscriptionDb.updatePreferredChampions).toBeCalledTimes(0);
        })
    })
})

test('If an error occurs, the error handler will be invoked.', async () => {
    errorHandler.handleError = jest.fn();
    let msg = {
        author: {
            username: 'Sample User',
            id: '123456'
        },
        guild: {
            name: 'Good Squad'
        },
        send: jest.fn(),
        reply: jest.fn()
    }
    prepareDDragonApiData();
    clashSubscriptionDb.updatePreferredChampions = jest.fn().mockRejectedValue(new Error('Failed to update.'));
    errorHandler.handleError = jest.fn();
    await suggestChampion.execute(msg, ['Ahri']);
    expect(errorHandler.handleError.mock.calls.length).toEqual(1);
})

function prepareDDragonApiData() {
    let expectedChampionsData = {
        data: {
            'Ahri': {
                id: 'Ahri'
            },
            'Aatrox': {
                id: 'Aatrox'
            }
        }
    }
    riotApi.DDragon = {
        champion: {
            all: jest.fn().mockReturnValue(expectedChampionsData)
        }
    };
}

