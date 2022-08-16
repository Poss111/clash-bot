const unregister = require('../unregister');
const errorHandling = require('../../utility/error-handling');
const commandArgumentParser = require('../command-argument-parser');
const {buildMockInteraction, create400HttpError, create500HttpError} = require('./shared-test-utilities/shared-test-utilities.test');
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
});

describe('Unregister', () => {
    describe('Happy Path and edge cases', () => {
        test('When a player exists on a team is unregistered, the player should be notified that we have successfully removed them.', async () => {
            const msg = buildMockInteraction();
            let args = ['msi2021', '3'];
            let leagueTimes = [
                {
                    tournamentName: 'msi2021',
                    tournamentDay: '3',
                    'startTime': 'May 29 2021 07:00 pm PDT',
                    'registrationTime': 'May 29 2021 04:15 pm PDT'
                },
                {
                    tournamentName: 'msi2021',
                    tournamentDay: '4',
                    'startTime': 'May 30 2021 07:00 pm PDT',
                    'registrationTime': 'May 30 2021 04:15 pm PDT'
                }
            ];
            const getTournamentsMock = setupGetTournamentsMock(leagueTimes);
            commandArgumentParser.parse.mockReturnValue({
                tournamentDay: args[1],
                tournamentName: args[0],
                createNewTeam: false
            });
            const removeResponse = {
                name: 'abra',
                playerDetails: {},
                serverName: msg.member.guild.name,
                tournament: {
                    tournamentName: leagueTimes[0].tournamentName,
                    tournamentDay: leagueTimes[0].tournamentDay,
                }
            };
            const sampleTeamTwoPlayers = [
                {
                    name: 'abra',
                    serverName: msg.member.guild.name,
                    playerDetails: {
                        Top: {
                            id: 1,
                            name: 'Roïdräge',
                            champions: ['Volibear', 'Ornn', 'Sett'],
                            role: 'Top'
                        },
                        Bot: {
                            id: msg.user.id,
                            name: msg.user.username,
                            champions: ['Lucian'],
                            role: 'Bot'
                        },
                        Jg: {
                            id: 3,
                            name: 'Pepe Conrad',
                            champions: ['Lucian'],
                            role: 'Jg'
                        }
                    },
                    tournament: {
                        tournamentName: 'awesome_sauce',
                        tournamentDay: '1'
                    }
                }
            ];
            const removePlayerFromTeamMock = jest.fn();
            const getTeamMock = jest.fn();
            clashBotRestClient.TeamApi.mockReturnValue({
                getTeam: getTeamMock.mockResolvedValue(sampleTeamTwoPlayers),
                removePlayerFromTeam: removePlayerFromTeamMock
                  .mockResolvedValue(removeResponse)
            });
            await unregister.execute(msg, args);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[0],
                day: args[1],
            });
            expect(getTeamMock).toHaveBeenCalledTimes(1);
            expect(getTeamMock)
              .toHaveBeenCalledWith(
                msg.member.guild.name,
                {
                    tournament: leagueTimes[0].tournamentName,
                    day: leagueTimes[0].tournamentDay,
                });
            expect(removePlayerFromTeamMock)
              .toHaveBeenCalledTimes(1);
            expect(removePlayerFromTeamMock)
              .toHaveBeenCalledWith(
                sampleTeamTwoPlayers[0].name,
                msg.member.guild.name,
                leagueTimes[0].tournamentName,
                leagueTimes[0].tournamentDay,
                msg.user.id
            );
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(2);
            expect(msg.editReply).toHaveBeenCalledWith(`Unregistering '${msg.user.username}' from Tournament '${leagueTimes[0].tournamentName}' on day '${leagueTimes[0].tournamentDay}'...`);
            expect(msg.editReply).toHaveBeenCalledWith(`Removed you from Team '${removeResponse.name}' for Tournament '${leagueTimes[0].tournamentName} - ${leagueTimes[0].tournamentDay}'. Please use /join or /newTeam if you would like to join again. Thank you!`);
        });

        test('Error - (When player does not belong to a Team) - When a player does not exist on a team is unregistered, the player should be notified that the have not Team to unregister from.', async () => {
            const msg = buildMockInteraction();
            let args = ['msi2021', '3'];
            let leagueTimes = [
                {
                    tournamentName: 'msi2021',
                    tournamentDay: '3',
                    'startTime': 'May 29 2021 07:00 pm PDT',
                    'registrationTime': 'May 29 2021 04:15 pm PDT'
                },
                {
                    tournamentName: 'msi2021',
                    tournamentDay: '4',
                    'startTime': 'May 30 2021 07:00 pm PDT',
                    'registrationTime': 'May 30 2021 04:15 pm PDT'
                }
            ];
            const getTournamentsMock = setupGetTournamentsMock(leagueTimes);
            commandArgumentParser.parse.mockReturnValue({
                tournamentDay: args[1],
                tournamentName: args[0],
                createNewTeam: false
            });
            const removeResponse = {
                name: 'abra',
                playerDetails: {},
                serverName: msg.member.guild.name,
                tournament: {
                    tournamentName: leagueTimes[0].tournamentName,
                    tournamentDay: leagueTimes[0].tournamentDay,
                }
            };
            const sampleTeamTwoPlayers = [
                {
                    name: 'abra',
                    serverName: msg.member.guild.name,
                    playerDetails: {
                        Top: {
                            id: 1,
                            name: 'Roïdräge',
                            champions: ['Volibear', 'Ornn', 'Sett'],
                            role: 'Top'
                        },
                        Jg: {
                            id: 3,
                            name: 'Pepe Conrad',
                            champions: ['Lucian'],
                            role: 'Jg'
                        }
                    },
                    tournament: {
                        tournamentName: 'awesome_sauce',
                        tournamentDay: '1'
                    }
                }
            ];
            const removePlayerFromTeamMock = jest.fn();
            const getTeamMock = jest.fn();
            clashBotRestClient.TeamApi.mockReturnValue({
                getTeam: getTeamMock.mockResolvedValue(sampleTeamTwoPlayers),
                removePlayerFromTeam: removePlayerFromTeamMock
                  .mockResolvedValue(removeResponse)
            });
            await unregister.execute(msg, args);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[0],
                day: args[1],
            });
            expect(getTeamMock).toHaveBeenCalledTimes(1);
            expect(getTeamMock)
              .toHaveBeenCalledWith(
                msg.member.guild.name,
                {
                    tournament: leagueTimes[0].tournamentName,
                    day: leagueTimes[0].tournamentDay,
                });
            expect(removePlayerFromTeamMock)
              .not.toHaveBeenCalled();
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(2);
            expect(msg.editReply).toHaveBeenCalledWith(`Unregistering '${msg.user.username}' from Tournament '${leagueTimes[0].tournamentName}' on day '${leagueTimes[0].tournamentDay}'...`);
            expect(msg.editReply).toHaveBeenCalledWith(`You do not belong to any of the Teams for Tournament '${leagueTimes[0].tournamentName}' on day '${leagueTimes[0].tournamentDay}'.`);
        });

        test('When a player does not exist on a team is unregistered, the player should be notified that they have not successfully removed them.', async () => {
            const msg = buildMockInteraction();
            let args = ['shurima', '3'];
            let leagueTimes = [
                {
                    tournamentName: 'msi2021',
                    tournamentDay: '3',
                    'startTime': 'May 29 2021 07:00 pm PDT',
                    'registrationTime': 'May 29 2021 04:15 pm PDT'
                },
                {
                    tournamentName: 'msi2021',
                    tournamentDay: '4',
                    'startTime': 'May 30 2021 07:00 pm PDT',
                    'registrationTime': 'May 30 2021 04:15 pm PDT'
                }
            ];
            const getTournamentsMock = setupGetTournamentsMock(leagueTimes);
            commandArgumentParser.parse.mockReturnValue({
                tournamentName: args[0],
                tournamentDay: args[1], createNewTeam: false
            });
            const sampleTeamTwoPlayers = [
                {
                    name: 'abra',
                    serverName: msg.member.guild.name,
                    playerDetails: {
                        Top: {
                            id: 1,
                            name: 'Roïdräge',
                            champions: ['Volibear', 'Ornn', 'Sett'],
                            role: 'Top'
                        },
                        Bot: {
                            id: msg.user.id,
                            name: msg.user.username,
                            champions: ['Lucian'],
                            role: 'Bot'
                        },
                        Jg: {
                            id: 3,
                            name: 'Pepe Conrad',
                            champions: ['Lucian'],
                            role: 'Jg'
                        }
                    },
                    tournament: {
                        tournamentName: 'awesome_sauce',
                        tournamentDay: '1'
                    }
                }
            ];
            const removePlayerFromTeamMock = jest.fn();
            const getTeamMock = jest.fn();
            clashBotRestClient.TeamApi.mockReturnValue({
                getTeam: getTeamMock.mockResolvedValue(sampleTeamTwoPlayers),
                removePlayerFromTeam: removePlayerFromTeamMock
                  .mockRejectedValue(create400HttpError())
            });
            await unregister.execute(msg, args);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[0],
                day: args[1],
            });
            expect(getTeamMock).toHaveBeenCalledTimes(1);
            expect(getTeamMock)
              .toHaveBeenCalledWith(
                msg.member.guild.name,
                {
                    tournament: leagueTimes[0].tournamentName,
                    day: leagueTimes[0].tournamentDay,
                });
            expect(removePlayerFromTeamMock)
              .toHaveBeenCalledTimes(1);
            expect(removePlayerFromTeamMock)
              .toHaveBeenCalledWith(
                sampleTeamTwoPlayers[0].name,
                msg.member.guild.name,
                leagueTimes[0].tournamentName,
                leagueTimes[0].tournamentDay,
                msg.user.id
              );
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(2);
            expect(msg.editReply).toHaveBeenCalledWith(`Unregistering '${msg.user.username}' from Tournament '${leagueTimes[0].tournamentName}' on day '${leagueTimes[0].tournamentDay}'...`);
            expect(msg.editReply).toHaveBeenCalledWith(`We did not find you on an existing Team for Tournament '${args[0]} - ${args[1]}'. Please use /join or /newTeam if you would like to join again. Thank you!`);
        });

        test('When a player does not give which tournament and day to unregister for, the player will be sent back ' +
            'an invalid input message.', async () => {
            const msg = buildMockInteraction();
            commandArgumentParser.parse.mockReturnValue({createNewTeam: false});
            await unregister.execute(msg);
            expect(msg.deferReply).not.toHaveBeenCalled();
            expect(msg.reply).toHaveBeenCalledTimes(1);
            expect(msg.reply).toHaveBeenCalledWith('Please pass the tournament and day to unregister for i.e. ' +
                '/unregister ***msi2021*** ***2***');
        });

        test('When a player gives a tournament and day that is unavailable to unregister for, the player will be sent back an invalid input message.', async () => {
            const msg = buildMockInteraction();
            let args = ['shurima', '3'];
            commandArgumentParser.parse.mockReturnValue({
                tournamentName: args[0],
                tournamentDay: args[1], createNewTeam: false
            });
            const getTournamentsMock = setupGetTournamentsMock([]);
            await unregister.execute(msg, args);
            expect(errorHandling.handleError)
              .not
              .toHaveBeenCalled();
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[0],
                day: args[1],
            });
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledWith('Please provide an existing tournament and day to unregister for. ' +
                'Use \'/team\' to print a team.');
        });
    });

    describe('Error', () => {
        test('If an error occurs while retrieving the Tournaments, the error handler will be invoked.', async () => {
            const msg = buildMockInteraction();
            errorHandling.handleError = jest.fn();
            let args = ['shurima', '3'];
            commandArgumentParser.parse.mockReturnValue({
                tournamentName: args[0],
                tournamentDay: args[1],
                createNewTeam: false
            });

            let getTournamentsMock = jest.fn();
            clashBotRestClient.TournamentApi.mockReturnValue({
                getTournaments: getTournamentsMock.mockRejectedValue(create500HttpError())
            });
            await unregister.execute(msg, args);
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[0],
                day: args[1],
            });
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).not.toHaveBeenCalled();
            expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
            expect(errorHandling.handleError).toHaveBeenCalledWith(
              unregister.name,
              create500HttpError(),
              msg,
              'Failed to unregister you.',
              expect.anything(),
            );
        });

        test('If an error occurs while retrieving Teams, the error handler will be invoked.', async () => {
            const msg = buildMockInteraction();
            errorHandling.handleError = jest.fn();
            let args = ['shurima', '3'];
            let leagueTimes = [
                {
                    tournamentName: 'msi2021',
                    tournamentDay: '3',
                    'startTime': 'May 29 2021 07:00 pm PDT',
                    'registrationTime': 'May 29 2021 04:15 pm PDT'
                },
                {
                    tournamentName: 'msi2021',
                    tournamentDay: '4',
                    'startTime': 'May 30 2021 07:00 pm PDT',
                    'registrationTime': 'May 30 2021 04:15 pm PDT'
                }
            ];
            commandArgumentParser.parse.mockReturnValue({
                tournamentName: args[0],
                tournamentDay: args[1],
                createNewTeam: false
            });
            const sampleTeamTwoPlayers = [
                {
                    name: 'abra',
                    serverName: msg.member.guild.name,
                    playerDetails: {
                        Top: {
                            id: 1,
                            name: 'Roïdräge',
                            champions: ['Volibear', 'Ornn', 'Sett'],
                            role: 'Top'
                        },
                        Bot: {
                            id: msg.user.id,
                            name: msg.user.username,
                            champions: ['Lucian'],
                            role: 'Bot'
                        },
                        Jg: {
                            id: 3,
                            name: 'Pepe Conrad',
                            champions: ['Lucian'],
                            role: 'Jg'
                        }
                    },
                    tournament: {
                        tournamentName: 'awesome_sauce',
                        tournamentDay: '1'
                    }
                }
            ];
            let getTournamentsMock = jest.fn();
            clashBotRestClient.TournamentApi.mockReturnValue({
                getTournaments: getTournamentsMock.mockResolvedValue(leagueTimes)
            });
            const removePlayerFromTeamMock = jest.fn();
            const getTeamMock = jest.fn();
            clashBotRestClient.TeamApi.mockReturnValue({
                getTeam: getTeamMock.mockRejectedValue(create500HttpError()),
                removePlayerFromTeam: removePlayerFromTeamMock
                  .mockRejectedValue(create500HttpError())
            });
            await unregister.execute(msg, args);
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[0],
                day: args[1],
            });
            expect(getTeamMock).toHaveBeenCalledTimes(1);
            expect(getTeamMock)
              .toHaveBeenCalledWith(
                msg.member.guild.name,
                {
                    tournament: leagueTimes[0].tournamentName,
                    day: leagueTimes[0].tournamentDay,
                });
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledWith(`Unregistering '${msg.user.username}' from Tournament '${leagueTimes[0].tournamentName}' on day '${leagueTimes[0].tournamentDay}'...`);
            expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
            expect(errorHandling.handleError).toHaveBeenCalledWith(
              unregister.name,
              create500HttpError(),
              msg,
              'Failed to unregister you.',
              expect.anything(),
            );
        });

        test('If an error occurs while removing a Player from a Team, the error handler will be invoked.', async () => {
            const msg = buildMockInteraction();
            errorHandling.handleError = jest.fn();
            let args = ['shurima', '3'];
            let leagueTimes = [
                {
                    tournamentName: 'msi2021',
                    tournamentDay: '3',
                    'startTime': 'May 29 2021 07:00 pm PDT',
                    'registrationTime': 'May 29 2021 04:15 pm PDT'
                },
                {
                    tournamentName: 'msi2021',
                    tournamentDay: '4',
                    'startTime': 'May 30 2021 07:00 pm PDT',
                    'registrationTime': 'May 30 2021 04:15 pm PDT'
                }
            ];
            commandArgumentParser.parse.mockReturnValue({
                tournamentName: args[0],
                tournamentDay: args[1],
                createNewTeam: false
            });
            const sampleTeamTwoPlayers = [
                {
                    name: 'abra',
                    serverName: msg.member.guild.name,
                    playerDetails: {
                        Top: {
                            id: 1,
                            name: 'Roïdräge',
                            champions: ['Volibear', 'Ornn', 'Sett'],
                            role: 'Top'
                        },
                        Bot: {
                            id: msg.user.id,
                            name: msg.user.username,
                            champions: ['Lucian'],
                            role: 'Bot'
                        },
                        Jg: {
                            id: 3,
                            name: 'Pepe Conrad',
                            champions: ['Lucian'],
                            role: 'Jg'
                        }
                    },
                    tournament: {
                        tournamentName: 'awesome_sauce',
                        tournamentDay: '1'
                    }
                }
            ];
            let getTournamentsMock = jest.fn();
            clashBotRestClient.TournamentApi.mockReturnValue({
                getTournaments: getTournamentsMock.mockResolvedValue(leagueTimes)
            });
            const removePlayerFromTeamMock = jest.fn();
            const getTeamMock = jest.fn();
            clashBotRestClient.TeamApi.mockReturnValue({
                getTeam: getTeamMock.mockResolvedValue(sampleTeamTwoPlayers),
                removePlayerFromTeam: removePlayerFromTeamMock
                  .mockRejectedValue(create500HttpError())
            });
            await unregister.execute(msg, args);
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[0],
                day: args[1],
            });
            expect(getTeamMock).toHaveBeenCalledTimes(1);
            expect(getTeamMock)
              .toHaveBeenCalledWith(
                msg.member.guild.name,
                {
                    tournament: leagueTimes[0].tournamentName,
                    day: leagueTimes[0].tournamentDay,
                });
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledWith(`Unregistering '${msg.user.username}' from Tournament '${leagueTimes[0].tournamentName}' on day '${leagueTimes[0].tournamentDay}'...`);
            expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
            expect(errorHandling.handleError).toHaveBeenCalledWith(
              unregister.name,
              create500HttpError(),
              msg,
              'Failed to unregister you.',
              expect.anything(),
            );
        });
    });
});
