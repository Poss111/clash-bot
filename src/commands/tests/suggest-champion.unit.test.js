const suggestChampion = require('../suggest-champion');
const errorHandler = require('../../utility/error-handling');
const riotApi = require('@fightmegg/riot-api');
const {buildMockInteraction} = require('./shared-test-utilities/shared-test-utilities.test');
const clashBotRestClient = require('clash-bot-rest-client');

jest.mock('../../utility/error-handling');
jest.mock('@fightmegg/riot-api');
jest.mock('clash-bot-rest-client');
jest.mock('../../utility/rest-api-utilities');

beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
});

function create400HttpError() {
    return {
        error: 'Failed to make call.',
        headers: undefined,
        status: 400,
        statusText: 'Bad Request',
        url: 'https://localhost.com/api'
    };
}

function create500HttpError() {
    return {
        error: 'Failed to make call.',
        headers: undefined,
        status: 500,
        statusText: 'Bad Request',
        url: 'https://localhost.com/api'
    };
}

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
    };
    riotApi.DDragon = jest.fn().mockImplementation(() => {
        return {
            champion: {
                all: jest.fn().mockReturnValue(expectedChampionsData)
            }
        };
    });
}

function setupMockAddChampion(initialChampionList, args) {
    let addChampionMock = jest.fn();
    let retrieveChampions = jest.fn();
    let removeChampionMock = jest.fn();
    clashBotRestClient.AddToListOfPreferredChampionsRequest
      .mockReturnValue({championName: args[0]});
    clashBotRestClient.UserApi.mockReturnValue({
        retrieveListOfUserPreferredChampions: retrieveChampions
          .mockResolvedValue(initialChampionList),
        addToListOfPreferredChampions: addChampionMock
          .mockResolvedValue([ ...args ]),
        removeFromListOfPreferredChampions: removeChampionMock
          .mockResolvedValue([ ...args ]),
    });
    let expectedPayload = {
        'addToListOfPreferredChampionsRequest': {championName: args[0]}
    };
    return {
        retrieveChampions,
        addChampionMock,
        removeChampionMock,
        expectedPayload,
    };
}

function setupRetrieveChampionsListFailure(args) {
    let addChampionMock = jest.fn();
    let retrieveChampions = jest.fn();
    let removeChampionMock = jest.fn();
    clashBotRestClient.AddToListOfPreferredChampionsRequest
      .mockReturnValue({championName: args[0].toLowerCase()});
    clashBotRestClient.UserApi.mockReturnValue({
        retrieveListOfUserPreferredChampions: retrieveChampions
          .mockRejectedValue(create500HttpError()),
        addToListOfPreferredChampions       : addChampionMock
          .mockResolvedValue(['ahri']),
        removeFromListOfPreferredChampions  : removeChampionMock
          .mockResolvedValue(['ahri']),
    });
    return retrieveChampions;
}

function setupAddChampionsListFailure(args) {
    let addChampionMock = jest.fn();
    let retrieveChampions = jest.fn();
    let removeChampionMock = jest.fn();
    clashBotRestClient.AddToListOfPreferredChampionsRequest
      .mockReturnValue({
          championName: [ ...args ][0].toLowerCase()
      });
    clashBotRestClient.UserApi.mockReturnValue({
        retrieveListOfUserPreferredChampions: retrieveChampions
          .mockResolvedValue([]),
        addToListOfPreferredChampions       : addChampionMock
          .mockRejectedValue(create500HttpError()),
        removeFromListOfPreferredChampions  : removeChampionMock
          .mockResolvedValue(['ahri']),
    });
    let expectedPayload = {
        'addToListOfPreferredChampionsRequest': { championName: [ ...args][0].toLowerCase() }
    };
    return {
        retrieveChampions,
        addChampionMock,
        removeChampionMock,
        expectedPayload
    };
}

function setupRemoveFromChampionsListFailure(args) {
    let addChampionMock = jest.fn();
    let retrieveChampions = jest.fn();
    let removeChampionMock = jest.fn();
    const dupArgs = args.map(arg => arg.toLowerCase());
    clashBotRestClient.AddToListOfPreferredChampionsRequest
      .mockReturnValue({
          championName: dupArgs[0]
      });
    clashBotRestClient.UserApi.mockReturnValue({
        retrieveListOfUserPreferredChampions: retrieveChampions
          .mockResolvedValue(dupArgs),
        addToListOfPreferredChampions       : addChampionMock
          .mockResolvedValue(dupArgs),
        removeFromListOfPreferredChampions  : removeChampionMock
          .mockRejectedValue(create500HttpError()),
    });
    let expectedPayload = {
        'addToListOfPreferredChampionsRequest': { championName: [ ...args][0].toLowerCase() }
    };
    return {
        retrieveChampions,
        addChampionMock,
        removeChampionMock,
        expectedPayload
    };
}

describe('Suggest Champion Command', () => {
    describe('Happy Path and edge cases', () => {
        test('A User should be able to pass in a champion name as an argument to be added to their preferred champions list.', async () => {
            const msg = buildMockInteraction();
            let args = ['Ahri'];
            let {
                retrieveChampions,
                addChampionMock,
                expectedPayload,
            } = setupMockAddChampion([], args);
            prepareDDragonApiData();
            await suggestChampion.execute(msg, args);
            expect(errorHandler.handleError).not.toHaveBeenCalled();
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(retrieveChampions).toHaveBeenCalledTimes(1);
            expect(retrieveChampions).toHaveBeenCalledWith(msg.user.id);
            expect(addChampionMock).toHaveBeenCalledTimes(1);
            expect(addChampionMock).toBeCalledWith(msg.user.id, expectedPayload);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply)
              .toBeCalledWith(`Successfully updated your preferred champions list, here are your current Champions: '${[ ...args ]}'`);
        });

        test('A User should be able to pass in a champion name as an argument to be removed from their preferred champions list.', async () => {
            let args = ['ahri'];
            const msg = buildMockInteraction();
            let {
                retrieveChampions,
                addChampionMock,
                removeChampionMock,
            } = setupMockAddChampion([ ...args ], args);
            prepareDDragonApiData();
            await suggestChampion.execute(msg, args);
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(retrieveChampions).toHaveBeenCalledTimes(1);
            expect(retrieveChampions).toHaveBeenCalledWith(msg.user.id);
            expect(removeChampionMock).toHaveBeenCalledTimes(1);
            expect(removeChampionMock).toBeCalledWith(msg.user.id, args[0]);
            expect(addChampionMock).not.toHaveBeenCalled();
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply)
              .toBeCalledWith(`Successfully updated your preferred champions list, here are your current Champions: '${args}'`);
        });

        test('A user should not be able to add more than 5 preferred champions to their list.', async () => {
            const msg = buildMockInteraction();
            prepareDDragonApiData();
            let args = ['Ahri'];
            let addChampionMock = jest.fn();
            let retrieveChampions = jest.fn();
            let removeChampionMock = jest.fn();
            clashBotRestClient.AddToListOfPreferredChampionsRequest
              .mockReturnValue({ championName: args[0].toLowerCase() });
            clashBotRestClient.UserApi.mockReturnValue({
                retrieveListOfUserPreferredChampions: retrieveChampions
                  .mockRejectedValue(create400HttpError()),
                addToListOfPreferredChampions: addChampionMock
                  .mockResolvedValue([ ...args ]),
                removeFromListOfPreferredChampions: removeChampionMock
                  .mockResolvedValue([ ...args ]),
            });
            await suggestChampion.execute(msg, args);
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(retrieveChampions).toHaveBeenCalledTimes(1);
            expect(retrieveChampions).toBeCalledWith(msg.user.id);
            expect(addChampionMock).not.toHaveBeenCalled();
            expect(removeChampionMock).not.toHaveBeenCalled();
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toBeCalledWith('Sorry! You cannot have more than 5 champions in your list. ' +
                'Please remove by passing a champion in your list and then try adding again. Thank you!');
        });
    });

    describe('Should validate user input', () => {
        test('A champion should be required to be passed as the first argument.', async () => {
            const msg = buildMockInteraction();
            let args = [];
            await suggestChampion.execute(msg, args);
            expect(msg.deferReply).not.toHaveBeenCalled();
            expect(msg.reply).toBeCalledWith('no champion name was passed. Please pass one.');
        });

        test('The champion passed should be a valid League of Legends champion name.', async () => {
            const msg = buildMockInteraction();
            let args = ['DNE'];
            prepareDDragonApiData();
            await suggestChampion.execute(msg, args);
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toBeCalledWith(`Champion name passed does not exist. Please validate with /champions ${args[0]}`);
        });
    });

    describe('Error', () => {
        test('If an error occurs while retrieving Champion list, the error handler will be invoked.', async () => {
            errorHandler.handleError = jest.fn();
            const msg = buildMockInteraction();
            prepareDDragonApiData();
            let args = ['Ahri'];
            let retrieveChampions = setupRetrieveChampionsListFailure(args);
            errorHandler.handleError = jest.fn();
            await suggestChampion.execute(msg, ['Ahri']);
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(retrieveChampions).toHaveBeenCalledTimes(1);
            expect(retrieveChampions).toBeCalledWith(msg.user.id);
            expect(errorHandler.handleError).toHaveBeenCalledTimes(1);
            expect(errorHandler.handleError)
              .toHaveBeenCalledWith(
                suggestChampion.name,
                create500HttpError(),
                msg,
                'Failed to update the Users preferred Champions list.',
                expect.anything(),
              );
        });

        test('If an error occurs while adding Champion to list, the error handler will be invoked.', async () => {
            errorHandler.handleError = jest.fn();
            const msg = buildMockInteraction();
            let args = ['Ahri'];
            prepareDDragonApiData();
            let {
                addChampionMock,
                removeChampionMock,
                retrieveChampions,
                expectedPayload,
            } = setupAddChampionsListFailure(args);
            errorHandler.handleError = jest.fn();
            await suggestChampion.execute(msg, args);
            expect(removeChampionMock).not.toHaveBeenCalled();
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(retrieveChampions).toHaveBeenCalledTimes(1);
            expect(retrieveChampions).toBeCalledWith(msg.user.id);
            expect(addChampionMock).toHaveBeenCalledTimes(1);
            expect(addChampionMock).toHaveBeenCalledWith(
              msg.user.id,
              expectedPayload
            );
            expect(errorHandler.handleError).toHaveBeenCalledTimes(1);
            expect(errorHandler.handleError).toHaveBeenCalledWith(
              suggestChampion.name,
              create500HttpError(),
              msg,
              'Failed to update the Users preferred Champions list.',
              expect.anything(),
            );
        });

        test('If an error occurs while removing Champion to list, the error handler will be invoked.', async () => {
            errorHandler.handleError = jest.fn();
            const msg = buildMockInteraction();
            let args = ['Ahri'];
            prepareDDragonApiData();
            let {
                addChampionMock,
                removeChampionMock,
                retrieveChampions,
            } = setupRemoveFromChampionsListFailure(args);
            errorHandler.handleError = jest.fn();
            await suggestChampion.execute(msg, args);
            expect(addChampionMock).not.toHaveBeenCalled();
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(retrieveChampions).toHaveBeenCalledTimes(1);
            expect(retrieveChampions).toBeCalledWith(msg.user.id);
            expect(removeChampionMock).toHaveBeenCalledTimes(1);
            expect(removeChampionMock).toHaveBeenCalledWith(
              msg.user.id,
              args[0].toLowerCase(),
            );
            expect(errorHandler.handleError).toHaveBeenCalledTimes(1);
            expect(errorHandler.handleError).toHaveBeenCalledWith(
              suggestChampion.name,
              create500HttpError(),
              msg,
              'Failed to update the Users preferred Champions list.',
              expect.anything(),
            );
        });
    });
});

