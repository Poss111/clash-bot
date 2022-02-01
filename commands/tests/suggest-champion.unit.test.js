const suggestChampion = require('../suggest-champion');
const userServiceImpl = require('../../services/user-service-impl');
const errorHandler = require('../../utility/error-handling');
const riotApi = require('@fightmegg/riot-api');
const {buildMockInteraction} = require('./shared-test-utilities/shared-test-utilities.test');

jest.mock('../../services/user-service-impl');
jest.mock('../../utility/error-handling');
jest.mock('@fightmegg/riot-api');

beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
})

describe('Suggest Champion Command', () => {
    test('A User should be able to pass in a champion name as an argument to be added to their preferred champions list.', async () => {
        const expectedSubscriptions = { 'UpcomingClashTournamentDiscordDM': false };
        const msg = buildMockInteraction();
        const mockGetUserResponse = {
            id: msg.user.id,
            playerName: msg.user.username,
            serverName: msg.member.guild.name,
            preferredChampions: undefined,
            subscriptions: expectedSubscriptions
        };

        let args = ['Ahri'];
        let mockPostUserResponse = JSON.parse(JSON.stringify(mockGetUserResponse));
        mockPostUserResponse.preferredChampions = [];
        mockPostUserResponse.preferredChampions.push(args[0]);

        prepareDDragonApiData();

        userServiceImpl.getUserDetails.mockResolvedValue(mockGetUserResponse);
        userServiceImpl.postUserDetails.mockResolvedValue(mockPostUserResponse);

        await suggestChampion.execute(msg, args);

        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toHaveBeenCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(msg.user.id);
        expect(userServiceImpl.postUserDetails).toHaveBeenCalledTimes(1);
        expect(userServiceImpl.postUserDetails).toBeCalledWith(msg.user.id, msg.user.username, msg.member.guild.name,
            mockPostUserResponse.preferredChampions, mockGetUserResponse.subscriptions);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toBeCalledWith(`Successfully updated your preferred champions list, here are your current Champions: '${mockPostUserResponse.preferredChampions}'`);
    })

    test('A User should be able to pass in a champion name as an argument to be removed from their preferred champions list.', async () => {
        const expectedSubscriptions = { 'UpcomingClashTournamentDiscordDM': false };
        const msg = buildMockInteraction();
        const mockGetUserResponse = {
            id: msg.user.id,
            playerName: msg.user.username,
            serverName: msg.member.guild.name,
            preferredChampions: ['Ahri'],
            subscriptions: expectedSubscriptions
        };

        let args = ['Ahri'];
        let mockPostUserResponse = JSON.parse(JSON.stringify(mockGetUserResponse));
        mockPostUserResponse.preferredChampions = [];

        prepareDDragonApiData();

        userServiceImpl.getUserDetails.mockResolvedValue(mockGetUserResponse);
        userServiceImpl.postUserDetails.mockResolvedValue(mockPostUserResponse);

        await suggestChampion.execute(msg, args);

        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toHaveBeenCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(msg.user.id);
        expect(userServiceImpl.postUserDetails).toHaveBeenCalledTimes(1);
        expect(userServiceImpl.postUserDetails).toBeCalledWith(msg.user.id, msg.user.username, msg.member.guild.name,
            [], mockGetUserResponse.subscriptions);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toBeCalledWith(`Successfully updated your preferred champions list, here are your current Champions: '${mockPostUserResponse.preferredChampions}'`);
    })

    test('A User should be able to pass in a champion name as an argument to be added to their preferred champions list if their list is already populated.', async () => {
        const expectedSubscriptions = { 'UpcomingClashTournamentDiscordDM': false };
        const msg = buildMockInteraction();
        const mockGetUserResponse = {
            id: msg.user.id,
            playerName: msg.user.username,
            serverName: msg.member.guild.name,
            preferredChampions: ['Sett'],
            subscriptions: expectedSubscriptions
        };

        let args = ['Ahri'];
        let mockPostUserResponse = JSON.parse(JSON.stringify(mockGetUserResponse));
        mockPostUserResponse.preferredChampions.push(args[0]);

        prepareDDragonApiData();
        userServiceImpl.getUserDetails.mockResolvedValue(mockGetUserResponse);
        userServiceImpl.postUserDetails.mockResolvedValue(mockPostUserResponse);

        await suggestChampion.execute(msg, args);

        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toHaveBeenCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(msg.user.id);
        expect(userServiceImpl.postUserDetails).toHaveBeenCalledTimes(1);
        expect(userServiceImpl.postUserDetails).toBeCalledWith(msg.user.id, msg.user.username,
            msg.member.guild.name, mockPostUserResponse.preferredChampions, mockGetUserResponse.subscriptions);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toBeCalledWith(`Successfully updated your preferred champions list, here are your current Champions: '${mockPostUserResponse.preferredChampions}'`);
    })

    test('A user should not be able to add more than 5 preferred champions to their list.', async () => {
        const expectedSubscriptions = { 'UpcomingClashTournamentDiscordDM': false };
        const msg = buildMockInteraction();
        const mockGetUserResponse = {
            id: msg.user.id,
            playerName: msg.user.username,
            serverName: msg.member.guild.name,
            preferredChampions: ['Sett','Gnar','Volibear','Anivia','Aatrox'],
            subscriptions: expectedSubscriptions
        };

        let args = ['Ahri'];
        let mockPostUserResponse = JSON.parse(JSON.stringify(mockGetUserResponse));
        mockPostUserResponse.preferredChampions.push(args[0]);

        prepareDDragonApiData();
        userServiceImpl.getUserDetails.mockResolvedValue(mockGetUserResponse);
        userServiceImpl.postUserDetails.mockResolvedValue(mockPostUserResponse);

        await suggestChampion.execute(msg, args);

        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toHaveBeenCalledTimes(1);
        expect(userServiceImpl.getUserDetails).toBeCalledWith(msg.user.id);
        expect(userServiceImpl.postUserDetails).not.toHaveBeenCalled();
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toBeCalledWith('Sorry! You cannot have more than 5 champions in your list. ' +
            'Please remove by passing a champion in your list and then try adding again. Thank you!');
    })

    describe('Should validate user input', () => {
        test('A champion should be required to be passed as the first argument.', async () => {
            const msg = buildMockInteraction();
            let args = [];
            await suggestChampion.execute(msg, args)
            expect(msg.deferReply).not.toHaveBeenCalled();
            expect(userServiceImpl.getUserDetails).not.toBeCalled();
            expect(msg.reply).toBeCalledWith('no champion name was passed. Please pass one.');
        })

        test('The champion passed should be a valid League of Legends champion name.', async () => {
            const msg = buildMockInteraction();
            let args = ['DNE'];
            prepareDDragonApiData();
            await suggestChampion.execute(msg, args)
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toBeCalledWith(`Champion name passed does not exist. Please validate with /champions ${args[0]}`);
            expect(userServiceImpl.getUserDetails).not.toBeCalled();
        })
    })
})

test('If an error occurs, the error handler will be invoked.', async () => {
    errorHandler.handleError = jest.fn();
    const msg = buildMockInteraction();
    prepareDDragonApiData();
    const errorReturned = new Error('Failed to update.')
    userServiceImpl.getUserDetails.mockRejectedValue(errorReturned);
    errorHandler.handleError = jest.fn();
    await suggestChampion.execute(msg, ['Ahri']);
    expect(msg.deferReply).toHaveBeenCalledTimes(1);
    expect(errorHandler.handleError).toHaveBeenCalledTimes(1);
    expect(errorHandler.handleError).toHaveBeenCalledWith(suggestChampion.name, errorReturned, msg, 'Failed to update ' +
        'the Users preferred Champions list.');
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

