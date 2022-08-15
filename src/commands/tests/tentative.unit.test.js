const tentative = require('../tentative');
const errorHandling = require('../../utility/error-handling');
const commandArgumentParser = require('../command-argument-parser');
const {buildMockInteraction, create500HttpError} = require('./shared-test-utilities/shared-test-utilities.test');
const clashBotRestClient = require('clash-bot-rest-client');

jest.mock('../../utility/error-handling');
jest.mock('../command-argument-parser');
jest.mock('clash-bot-rest-client');

function setupGetTournamentsMock(sampleTime) {
    let getTournamentsMock = jest.fn();
    clashBotRestClient.TournamentApi.mockReturnValue({
        getTournaments: getTournamentsMock.mockResolvedValue(sampleTime)
    });
    return getTournamentsMock;
}

beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
})

function setupTournamentError() {
    let getTournamentsMock = jest.fn();
    clashBotRestClient.TournamentApi.mockReturnValue({
        getTournaments: getTournamentsMock.mockRejectedValue(create500HttpError())
    });
    return getTournamentsMock;
}

describe('Tentative Command', () => {
    describe('Happy Path and edge cases', () => {
        test('Should respond with user has been placed on tentative if the player name does not exist in the tentative list.', async () => {
            let msg = buildMockInteraction();
            let leagueTimes = [
                {
                    tournamentName: "msi2021",
                    tournamentDay: "1",
                    startTime: "May 29 2021 07:00 pm PDT",
                    registrationTime: "May 29 2021 04:15 pm PDT"
                },
                {
                    tournamentName: "msi2021",
                    tournamentDay: "2",
                    startTime: "May 30 2021 07:00 pm PDT",
                    registrationTime: "May 30 2021 04:15 pm PDT"
                }
            ];
            let args = ['msi2021', '1'];
            commandArgumentParser.parse.mockReturnValue({
                tournamentName: args[0],
                tournamentDay: args[1],
                createNewTeam: false
            });
            const getTournamentsMock = setupGetTournamentsMock(leagueTimes);
            const getTentativeMock = jest.fn();
            const placePlayerOnTentativeMock = jest.fn();
            const removePlayerFromTentativeMock = jest.fn();
            const expectedRequest = {
                placePlayerOnTentativeRequest: {
                    serverName: msg.member.guild.name,
                    tournamentDetails: {
                        tournamentName: args[0],
                        tournamentDay: args[1],
                    },
                    playerId: msg.user.id
                }
            }
            const getTentativeDetailsResponse = [{
                serverName: msg.member.guild.name,
                tournamentDetails: {
                    tournamentName: args[0],
                    tournamentDay: args[1],
                },
                tentativePlayers: []
            }];
            const placedOnTentativeResponse = {
                serverName: msg.member.guild.name,
                tournamentDetails: {
                    tournamentName: args[0],
                    tournamentDay: args[1],
                },
                tentativePlayers: [{
                    id: msg.user.id,
                    name: msg.user.username,
                }]
            };
            clashBotRestClient
              .PlacePlayerOnTentativeRequest
              .mockReturnValue(expectedRequest.placePlayerOnTentativeRequest);
            clashBotRestClient.TentativeApi.mockReturnValue(
              {
                  getTentativeDetails: getTentativeMock
                    .mockResolvedValue(getTentativeDetailsResponse),
                  placePlayerOnTentative: placePlayerOnTentativeMock
                    .mockResolvedValue(placedOnTentativeResponse),
                  removePlayerFromTentative: removePlayerFromTentativeMock
                    .mockResolvedValue({}),
              }
            );
            await tentative.execute(msg, args);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[0],
                day: args[1],
            });
            expect(getTentativeMock).toHaveBeenCalledTimes(1);
            expect(getTentativeMock).toHaveBeenCalledWith({
                tournamentName: args[0],
                tournamentDay: args[1],
            });
            expect(placePlayerOnTentativeMock).toHaveBeenCalledTimes(1);
            expect(placePlayerOnTentativeMock)
              .toHaveBeenCalledWith(expectedRequest);
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply)
              .toHaveBeenCalledWith(`We placed you into the tentative queue. If you were on a team, you have been removed. tip: Use '/teams' to view current team status`);
        });

        test('Should respond with user has been taken off tentative if the player name does exist in the tentative list.', async () => {
            let msg = buildMockInteraction();
            let leagueTimes = [
                {
                    tournamentName: "msi2021",
                    tournamentDay: "1",
                    "startTime": "May 29 2021 07:00 pm PDT",
                    "registrationTime": "May 29 2021 04:15 pm PDT"
                },
                {
                    tournamentName: "msi2021",
                    tournamentDay: "2",
                    "startTime": "May 30 2021 07:00 pm PDT",
                    "registrationTime": "May 30 2021 04:15 pm PDT"
                }
            ];
            let args = ['msi2021', '1'];
            commandArgumentParser.parse.mockReturnValue({
                tournamentName: args[0],
                tournamentDay: args[1],
                createNewTeam: false
            });
            const getTournamentsMock = setupGetTournamentsMock(leagueTimes);
            const getTentativeMock = jest.fn();
            const placePlayerOnTentativeMock = jest.fn();
            const removePlayerFromTentativeMock = jest.fn();
            const getTentativeDetailsResponse = [{
                serverName: msg.member.guild.name,
                tournamentDetails: {
                    tournamentName: args[0],
                    tournamentDay: args[1],
                },
                tentativePlayers: [{
                    id: msg.user.id,
                    name: msg.user.username,
                }]
            }];
            const removedFromTentativeResponse = {
                serverName: msg.member.guild.name,
                tournamentDetails: {
                    tournamentName: args[0],
                    tournamentDay: args[1],
                },
                tentativePlayers: []
            };
            clashBotRestClient.TentativeApi.mockReturnValue(
              {
                  getTentativeDetails: getTentativeMock
                    .mockResolvedValue(getTentativeDetailsResponse),
                  placePlayerOnTentative: placePlayerOnTentativeMock
                    .mockResolvedValue({}),
                  removePlayerFromTentative: removePlayerFromTentativeMock
                    .mockResolvedValue(removedFromTentativeResponse),
              }
            );
            await tentative.execute(msg, args);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[0],
                day: args[1],
            });
            expect(getTentativeMock).toHaveBeenCalledTimes(1);
            expect(getTentativeMock).toHaveBeenCalledWith({
                tournamentName: leagueTimes[0].tournamentName,
                tournamentDay: leagueTimes[0].tournamentDay,
            });
            expect(placePlayerOnTentativeMock)
              .not
              .toHaveBeenCalled();
            expect(removePlayerFromTentativeMock)
              .toHaveBeenCalledTimes(1);
            expect(removePlayerFromTentativeMock)
              .toHaveBeenCalledWith(
                msg.member.guild.name,
                msg.user.id,
                leagueTimes[0].tournamentName,
                leagueTimes[0].tournamentDay,
              );
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledWith(`We have taken you off of tentative queue. tip: Use '/teams' to view current team status`);
        })

        test('If tournament passed by user is not found and return as empty, the user should be notified.', async () => {
            let msg = buildMockInteraction();
            let args = ['msi2021', '1'];
            commandArgumentParser.parse.mockReturnValue({
                tournamentName: args[0],
                tournamentDay: args[1],
                createNewTeam: false
            });
            const getTournamentsMock = setupGetTournamentsMock([]);
            await tentative.execute(msg, args);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[0],
                day: args[1],
            });
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply)
              .toHaveBeenCalledWith('Cannot find the tournament passed. Please check /time for an appropriate list.');
        })

        test('Should require a tournament as an argument.', async () => {
            let msg = buildMockInteraction();
            let args = [];
            commandArgumentParser.parse.mockReturnValue({createNewTeam: false});
            await tentative.execute(msg, args);
            expect(msg.deferReply).not.toHaveBeenCalled();
            expect(msg.reply).toHaveBeenCalledTimes(1);
            expect(msg.reply).toHaveBeenCalledWith("A Tournament Name to be tentative for is missing. Please " +
                "use /tentative 'tournament name' 'tournament day' to use tentative. i.e. /tentative msi2021 1");
        })

        test('Should require a single argument.', async () => {
            let msg = buildMockInteraction();
            let args = undefined;
            commandArgumentParser.parse.mockReturnValue({createNewTeam: false});
            await tentative.execute(msg, args);
            expect(msg.deferReply).not.toHaveBeenCalled();
            expect(msg.reply).toHaveBeenCalledTimes(1);
            expect(msg.reply).toHaveBeenCalledWith("A Tournament Name to be tentative for is missing. Please use " +
                "/tentative 'tournament name' 'tournament day' to use tentative. i.e. /tentative msi2021 1");
        })

        test('Should require Tournament Day as a 2nd argument.', async () => {
            let msg = buildMockInteraction();
            let args = ['msi2021'];
            commandArgumentParser.parse.mockReturnValue({tournamentName: args[0], createNewTeam: false});
            await tentative.execute(msg, args);
            expect(msg.deferReply).not.toHaveBeenCalled();
            expect(msg.reply).toHaveBeenCalledTimes(1);
            expect(msg.reply).toHaveBeenCalledWith("A Tournament Day to be tentative for is missing. Please use " +
                "/tentative 'tournament name' 'tournament day' to use tentative. i.e. /tentative msi2021 1");
        })
    })

    describe('Error', () => {
        test('If an error occurs while retrieving Tournaments, the error handler will be invoked.', async () => {
            errorHandling.handleError = jest.fn();
            let msg = buildMockInteraction();
            let args = ['msi2021', '1'];
            commandArgumentParser.parse.mockReturnValue({
                tournamentName: args[0],
                tournamentDay: args[1],
                createNewTeam: false
            });
            let getTournamentsMock = setupTournamentError();
            await tentative.execute(msg, args);
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[0],
                day: args[1],
            });
            expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
            expect(errorHandling.handleError).toHaveBeenCalledWith(
              tentative.name,
              create500HttpError(),
              msg,
              'Failed to place you on tentative.',
              expect.anything(),
            );
        })

        test('If an error occurs while retrieving Tentative Details, the error handler will be invoked.', async () => {
            let msg = buildMockInteraction();
            let leagueTimes = [
                {
                    tournamentName: "msi2021",
                    tournamentDay: "1",
                    startTime: "May 29 2021 07:00 pm PDT",
                    registrationTime: "May 29 2021 04:15 pm PDT"
                },
                {
                    tournamentName: "msi2021",
                    tournamentDay: "2",
                    startTime: "May 30 2021 07:00 pm PDT",
                    registrationTime: "May 30 2021 04:15 pm PDT"
                }
            ];
            let args = ['msi2021', '1'];
            commandArgumentParser.parse.mockReturnValue({
                tournamentName: args[0],
                tournamentDay: args[1],
                createNewTeam: false
            });
            const getTournamentsMock = setupGetTournamentsMock(leagueTimes);
            const getTentativeMock = jest.fn();
            const placePlayerOnTentativeMock = jest.fn();
            const removePlayerFromTentativeMock = jest.fn();
            const expectedRequest = {
                placePlayerOnTentativeRequest: {
                    serverName: msg.member.guild.name,
                    tournamentDetails: {
                        tournamentName: args[0],
                        tournamentDay: args[1],
                    },
                    playerId: msg.user.id
                }
            }
            const placedOnTentativeResponse = {
                serverName: msg.member.guild.name,
                tournamentDetails: {
                    tournamentName: args[0],
                    tournamentDay: args[1],
                },
                tentativePlayers: [{
                    id: msg.user.id,
                    name: msg.user.username,
                }]
            };
            clashBotRestClient
              .PlacePlayerOnTentativeRequest
              .mockReturnValue(expectedRequest.placePlayerOnTentativeRequest);
            clashBotRestClient.TentativeApi.mockReturnValue(
              {
                  getTentativeDetails: getTentativeMock
                    .mockRejectedValue(create500HttpError()),
                  placePlayerOnTentative: placePlayerOnTentativeMock
                    .mockReturnValue(placedOnTentativeResponse),
                  removePlayerFromTentative: removePlayerFromTentativeMock
                    .mockResolvedValue({}),
              }
            );
            await tentative.execute(msg, args);
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[0],
                day: args[1],
            });
            expect(getTentativeMock).toHaveBeenCalledTimes(1);
            expect(getTentativeMock).toHaveBeenCalledWith({
                tournamentName: args[0],
                tournamentDay: args[1],
            });
            expect(placePlayerOnTentativeMock).not.toHaveBeenCalled();
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
            expect(errorHandling.handleError).toHaveBeenCalledWith(
              tentative.name,
              create500HttpError(),
              msg,
              'Failed to place you on tentative.',
              expect.anything(),
            );
        });

        test('If an error occurs while posting User for Tentative Details, the error handler will be invoked.', async () => {
            let msg = buildMockInteraction();
            let leagueTimes = [
                {
                    tournamentName: "msi2021",
                    tournamentDay: "1",
                    startTime: "May 29 2021 07:00 pm PDT",
                    registrationTime: "May 29 2021 04:15 pm PDT"
                },
                {
                    tournamentName: "msi2021",
                    tournamentDay: "2",
                    startTime: "May 30 2021 07:00 pm PDT",
                    registrationTime: "May 30 2021 04:15 pm PDT"
                }
            ];
            let args = ['msi2021', '1'];
            commandArgumentParser.parse.mockReturnValue({
                tournamentName: args[0],
                tournamentDay: args[1],
                createNewTeam: false
            });
            const getTournamentsMock = setupGetTournamentsMock(leagueTimes);
            const getTentativeDetailsResponse = [{
                serverName: msg.member.guild.name,
                tournamentDetails: {
                    tournamentName: args[0],
                    tournamentDay: args[1],
                },
                tentativePlayers: []
            }];
            const getTentativeMock = jest.fn();
            const placePlayerOnTentativeMock = jest.fn();
            const removePlayerFromTentativeMock = jest.fn();
            const expectedRequest = {
                placePlayerOnTentativeRequest: {
                    serverName: msg.member.guild.name,
                    tournamentDetails: {
                        tournamentName: args[0],
                        tournamentDay: args[1],
                    },
                    playerId: msg.user.id
                }
            }
            clashBotRestClient
              .PlacePlayerOnTentativeRequest
              .mockReturnValue(expectedRequest.placePlayerOnTentativeRequest);
            clashBotRestClient.TentativeApi.mockReturnValue(
              {
                  getTentativeDetails: getTentativeMock
                    .mockResolvedValue(getTentativeDetailsResponse),
                  placePlayerOnTentative: placePlayerOnTentativeMock
                    .mockRejectedValue(create500HttpError()),
                  removePlayerFromTentative: removePlayerFromTentativeMock
                    .mockResolvedValue({}),
              }
            );
            await tentative.execute(msg, args);
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[0],
                day: args[1],
            });
            expect(getTentativeMock).toHaveBeenCalledTimes(1);
            expect(getTentativeMock).toHaveBeenCalledWith({
                tournamentName: args[0],
                tournamentDay: args[1],
            });
            expect(placePlayerOnTentativeMock).toHaveBeenCalledTimes(1);
            expect(placePlayerOnTentativeMock)
              .toHaveBeenCalledWith(expectedRequest);
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
            expect(errorHandling.handleError).toHaveBeenCalledWith(
              tentative.name,
              create500HttpError(),
              msg,
              'Failed to place you on tentative.',
              expect.anything(),
            );
        });

        test('If an error occurs while removing User from Tentative Details, the error handler will be invoked.', async () => {
            let msg = buildMockInteraction();
            let leagueTimes = [
                {
                    tournamentName: "msi2021",
                    tournamentDay: "1",
                    startTime: "May 29 2021 07:00 pm PDT",
                    registrationTime: "May 29 2021 04:15 pm PDT"
                },
                {
                    tournamentName: "msi2021",
                    tournamentDay: "2",
                    startTime: "May 30 2021 07:00 pm PDT",
                    registrationTime: "May 30 2021 04:15 pm PDT"
                }
            ];
            let args = ['msi2021', '1'];
            commandArgumentParser.parse.mockReturnValue({
                tournamentName: args[0],
                tournamentDay: args[1],
                createNewTeam: false
            });
            const getTournamentsMock = setupGetTournamentsMock(leagueTimes);
            const getTentativeDetailsResponse = [{
                serverName: msg.member.guild.name,
                tournamentDetails: {
                    tournamentName: args[0],
                    tournamentDay: args[1],
                },
                tentativePlayers: [{
                    id: msg.user.id,
                    name: msg.user.username,
                }]
            }];
            const getTentativeMock = jest.fn();
            const placePlayerOnTentativeMock = jest.fn();
            const removePlayerFromTentativeMock = jest.fn();
            const expectedRequest = {
                placePlayerOnTentativeRequest: {
                    serverName: msg.member.guild.name,
                    tournamentDetails: {
                        tournamentName: args[0],
                        tournamentDay: args[1],
                    },
                    playerId: msg.user.id
                }
            }
            clashBotRestClient
              .PlacePlayerOnTentativeRequest
              .mockReturnValue(expectedRequest.placePlayerOnTentativeRequest);
            clashBotRestClient.TentativeApi.mockReturnValue(
              {
                  getTentativeDetails: getTentativeMock
                    .mockResolvedValue(getTentativeDetailsResponse),
                  placePlayerOnTentative: placePlayerOnTentativeMock
                    .mockResolvedValue({}),
                  removePlayerFromTentative: removePlayerFromTentativeMock
                    .mockRejectedValue(create500HttpError()),
              }
            );
            await tentative.execute(msg, args);
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[0],
                day: args[1],
            });
            expect(getTentativeMock).toHaveBeenCalledTimes(1);
            expect(getTentativeMock).toHaveBeenCalledWith({
                tournamentName: args[0],
                tournamentDay: args[1],
            });
            expect(placePlayerOnTentativeMock)
              .not.toHaveBeenCalled();
            expect(removePlayerFromTentativeMock)
              .toHaveBeenCalledTimes(1);
            expect(removePlayerFromTentativeMock)
              .toHaveBeenCalledWith(
                    msg.member.guild.name,
                    msg.user.id,
                    leagueTimes[0].tournamentName,
                    leagueTimes[0].tournamentDay,
                );
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
            expect(errorHandling.handleError).toHaveBeenCalledWith(
              tentative.name,
              create500HttpError(),
              msg,
              'Failed to place you on tentative.',
              expect.anything(),
            );
        });
    })
})


