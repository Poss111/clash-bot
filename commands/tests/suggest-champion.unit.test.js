const suggestChampion = require('../suggest-champion');
const userServiceImpl = require('../../services/user-service-impl');
const errorHandler = require('../../utility/error-handling');
const riotApi = require('@fightmegg/riot-api');

jest.mock('../../services/user-service-impl');
jest.mock('../../utility/error-handling');
jest.mock('@fightmegg/riot-api');

beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
})

describe('Suggest Champion Command', () => {
    test('A User should be able to pass in a champion name as an argument to be added to their preferred champions list.', async () => {
        const expectedPlayerId = '1';
        const expectedPlayerName = 'Roidrage';
        const expectedServerName = 'Goon Squad';
        const expectedSubscriptions = { 'UpcomingClashTournamentDiscordDM': false };
        let msg = {
            author: {
                username: 'Sample User',
                id: '123456'
            },
            guild: {
                name: 'Goon Squad'
            },
            send: jest.fn(),
            reply: jest.fn()
        }
        const mockGetUserResponse = {
            id: expectedPlayerId,
            playerName: expectedPlayerName,
            serverName: expectedServerName,
            preferredChampions: undefined,
            subscriptions: expectedSubscriptions
        };

        let args = ['Ahri'];
        let mockPostUserResponse = JSON.parse(JSON.stringify(mockGetUserResponse));
        mockPostUserResponse.preferredChampions = [];
        mockPostUserResponse.preferredChampions.push(args[0]);

        prepareDDragonApiData();
        userServiceImpl.getUserDetails.mockResolvedValue(mockGetUserResponse);
        userServiceImpl.postUserDetails.mockResolvedValue(mockPostUserResponse)
        await suggestChampion.execute(msg, args)
        expect(msg.reply).toBeCalledWith(`Successfully updated your preferred champions list, here are your current Champions: '${mockPostUserResponse.preferredChampions}'`);
        expect(userServiceImpl.getUserDetails).toHaveBeenCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(msg.author.id);
        expect(userServiceImpl.postUserDetails).toHaveBeenCalledTimes(1);
        expect(userServiceImpl.postUserDetails).toBeCalledWith(msg.author.id, msg.author.username, expectedServerName, mockPostUserResponse.preferredChampions, mockGetUserResponse.subscriptions);
    })

    test('A User should be able to pass in a champion name as an argument to be added to their preferred champions list if their list is already populated.', async () => {
        const expectedPlayerId = '1';
        const expectedPlayerName = 'Roidrage';
        const expectedServerName = 'Goon Squad';
        const expectedSubscriptions = { 'UpcomingClashTournamentDiscordDM': false };
        let msg = {
            author: {
                username: 'Sample User',
                id: '123456'
            },
            guild: {
                name: 'Goon Squad'
            },
            send: jest.fn(),
            reply: jest.fn()
        }
        const mockGetUserResponse = {
            id: expectedPlayerId,
            playerName: expectedPlayerName,
            serverName: expectedServerName,
            preferredChampions: ['Sett'],
            subscriptions: expectedSubscriptions
        };

        let args = ['Ahri'];
        let mockPostUserResponse = JSON.parse(JSON.stringify(mockGetUserResponse));
        mockPostUserResponse.preferredChampions.push(args[0]);

        prepareDDragonApiData();
        userServiceImpl.getUserDetails.mockResolvedValue(mockGetUserResponse);
        userServiceImpl.postUserDetails.mockResolvedValue(mockPostUserResponse)
        await suggestChampion.execute(msg, args)
        expect(msg.reply).toBeCalledWith(`Successfully updated your preferred champions list, here are your current Champions: '${mockPostUserResponse.preferredChampions}'`);
        expect(userServiceImpl.getUserDetails).toHaveBeenCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(msg.author.id);
        expect(userServiceImpl.postUserDetails).toHaveBeenCalledTimes(1);
        expect(userServiceImpl.postUserDetails).toBeCalledWith(msg.author.id, msg.author.username, expectedServerName, mockPostUserResponse.preferredChampions, mockGetUserResponse.subscriptions);
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
            await suggestChampion.execute(msg, args)
            expect(msg.reply).toBeCalledWith('no champion name was passed. Please pass one.');
            expect(userServiceImpl.getUserDetails).not.toBeCalled();
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
            await suggestChampion.execute(msg, args)
            expect(msg.reply).toBeCalledWith(`Champion name passed does not exist. Please validate with !clash champions ${args[0]}`);
            expect(userServiceImpl.getUserDetails).not.toBeCalled();
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
    userServiceImpl.getUserDetails.mockRejectedValue(new Error('Failed to update.'));
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
    riotApi.DDragon = jest.fn().mockImplementation(() => {
        return {
            champion: {
                all: jest.fn().mockReturnValue(expectedChampionsData)
            }
        }
    });
}

