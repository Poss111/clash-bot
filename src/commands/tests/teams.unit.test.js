const teams = require('../teams');
const errorHandling = require('../../utility/error-handling');
const teamsCard = require('../../templates/teams');
const { buildMockInteraction } = require('./shared-test-utilities/shared-test-utilities.test');
const clashBotRestClient = require('clash-bot-rest-client');

jest.mock('../../utility/error-handling');
jest.mock('clash-bot-rest-client');

function buildExpectedTeamsResponse(sampleTeamList) {
    let copy = JSON.parse(JSON.stringify(teamsCard));
    let counter = 1;
    sampleTeamList.forEach(team => {
        copy.fields.push({
            name: team.name,
            value: Object.entries(team.playerDetails)
              .map(details => `${details[0]} - ${details[1].name}`)
              .join('\n'),
            inline: true
        });
        copy.fields.push({
            name: 'Tournament Details',
            value: `${team.tournament.tournamentName} Day ${team.tournament.tournamentDay}`,
            inline: true
        });
        if (counter !== sampleTeamList.length) {
            copy.fields.push({name: '\u200B', value: '\u200B'});
            counter++;
        }
    });
    return copy;
}

function buildExpectedNoTeamsResponse() {
    let copy = JSON.parse(JSON.stringify(teamsCard));
    copy.fields.push({name: 'No Existing Teams. Please register!', value: 'Emptay'});
    return copy;
}

function buildExpectedTeamsListWithTentative(sampleRegisteredTeams, sampleTentativeList) {
    let copy = {};
    if (Array.isArray(sampleRegisteredTeams) && sampleRegisteredTeams.length > 0) {
        copy = buildExpectedTeamsResponse(sampleRegisteredTeams);
    } else {
        copy = buildExpectedNoTeamsResponse();
    }
    let tentativeMessage = '';
    const reduce = sampleTentativeList.reduce((acc, value) => {
        const key = `${value.tournamentDetails.tournamentName} - ${value.tournamentDetails.tournamentDay}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        if (Array.isArray(value.tentativePlayers) && value.tentativePlayers.length > 0) {
            acc[key].push(value.tentativePlayers.map(player => player.name));
        }
        return acc;
    }, {});
    let counter = 1;
    Object.keys(reduce).forEach(key => {
        tentativeMessage = tentativeMessage.concat(`${key} -> ${reduce[key]}`);
        if (counter !== Object.keys(reduce).length) {
            tentativeMessage = tentativeMessage.concat('\n');
            counter++;
        }
    });
    copy.fields.push({name: 'Tentative Queue', value: tentativeMessage});
    return copy;
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

beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
});

describe('Retrieve Teams', () => {
    describe('Happy Path and edge cases', () => {
        test('When a team is passed back, it should be populated as a field in the embedded property of the reply.', async () => {
            let msg = buildMockInteraction();
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
                            id: 2,
                            name: 'TheIncentive',
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

            let parsedResponse = [{ ...sampleTeamTwoPlayers[0] }];
            parsedResponse[0].name = 'Abra';

            const getTentativeDetailsMock = jest.fn();
            clashBotRestClient.TentativeApi.mockReturnValue({
                getTentativeDetails: getTentativeDetailsMock
                  .mockResolvedValue(undefined)
            });
            const getTeamMock = jest.fn();
            clashBotRestClient.TeamApi.mockReturnValue({
                getTeam: getTeamMock.mockResolvedValue(sampleTeamTwoPlayers)
            });
            let copy = buildExpectedTeamsResponse(parsedResponse);
            await teams.execute(msg);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(getTentativeDetailsMock).toHaveBeenCalledTimes(1);
            expect(getTentativeDetailsMock)
              .toHaveBeenCalledWith(msg.member.guild.name);
            expect(getTeamMock).toHaveBeenCalledTimes(1);
            expect(getTeamMock)
              .toHaveBeenCalledWith(msg.member.guild.name);
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]});
        });

        test('When multiple teams are passed back, they should be populated as individual fields in the embedded property of the reply with their corresponding tournaments.', async () => {
            let msg = buildMockInteraction();
            const sampleTeamTwoPlayers = [
                {
                    name: 'abra',
                    playerDetails: {
                        Top: {
                            id: 1,
                            name: 'Roïdräge',
                            champions: ['Volibear', 'Ornn', 'Sett'],
                            role: 'Top'
                        },
                        Bot: {
                            id: 2,
                            name: 'TheIncentive',
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
                },
                {
                    name: 'charizard',
                    playerDetails: {
                        Top: {
                            name     : 'Shiragaku',
                            champions: ['Volibear', 'Ornn', 'Sett'],
                            role     : 'Top'
                        }
                    },
                    tournament: {
                        tournamentName: 'awesome_sauce',
                        tournamentDay: '1'
                    }
                }
            ];

            let parsedResponse = [
              { ...sampleTeamTwoPlayers[0] },
              { ...sampleTeamTwoPlayers[1] }
            ];
            parsedResponse[0].name = 'Abra';
            parsedResponse[1].name = 'Charizard';

            const getTentativeDetailsMock = jest.fn();
            clashBotRestClient.TentativeApi.mockReturnValue({
                getTentativeDetails: getTentativeDetailsMock
                  .mockResolvedValue(undefined)
            });
            const getTeamMock = jest.fn();
            clashBotRestClient.TeamApi.mockReturnValue({
                getTeam: getTeamMock.mockResolvedValue(sampleTeamTwoPlayers)
            });
            let copy = buildExpectedTeamsResponse(parsedResponse);
            await teams.execute(msg);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(getTentativeDetailsMock).toHaveBeenCalledTimes(1);
            expect(getTentativeDetailsMock)
              .toHaveBeenCalledWith(msg.member.guild.name);
            expect(getTeamMock).toHaveBeenCalledTimes(1);
            expect(getTeamMock)
              .toHaveBeenCalledWith(msg.member.guild.name);
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]});
        });

        test('When no teams are passed back, it should be populate the not existing teams message.', async () => {
            let msg = buildMockInteraction();
            const getTentativeDetailsMock = jest.fn();
            clashBotRestClient.TentativeApi.mockReturnValue({
                getTentativeDetails: getTentativeDetailsMock
                  .mockResolvedValue(undefined)
            });
            const getTeamMock = jest.fn();
            clashBotRestClient.TeamApi.mockReturnValue({
                getTeam: getTeamMock.mockResolvedValue([])
            });

            let copy = buildExpectedNoTeamsResponse();

            await teams.execute(msg);
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]});
        });

        test('When tentative players and no teams are passed back, it should populate the tentative list with an empty teams message.', async () => {
            let msg = buildMockInteraction();
            const sampleTentativeList = [{
                serverName: msg.member.guild.name,
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '1'
                },
                tentativePlayers: [{
                    id: '1',
                    name: 'Roidrage',
                }]
            }];

            const getTentativeDetailsMock = jest.fn();
            clashBotRestClient.TentativeApi.mockReturnValue({
                getTentativeDetails: getTentativeDetailsMock
                  .mockResolvedValue(sampleTentativeList)
            });
            const getTeamMock = jest.fn();
            clashBotRestClient.TeamApi.mockReturnValue({
                getTeam: getTeamMock.mockResolvedValue([])
            });
            let copy = buildExpectedTeamsListWithTentative(
              undefined,
              sampleTentativeList,
            );
            await teams.execute(msg);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(getTentativeDetailsMock).toHaveBeenCalledTimes(1);
            expect(getTentativeDetailsMock)
              .toHaveBeenCalledWith(msg.member.guild.name);
            expect(getTeamMock).toHaveBeenCalledTimes(1);
            expect(getTeamMock)
              .toHaveBeenCalledWith(msg.member.guild.name);
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]});
        });

        test('When multiple tentative players and a team are passed back, it should populate the tentative list with the existing team based on all the tournaments.', async () => {
            let msg = buildMockInteraction();
            const sampleTeamTwoPlayers = [
                {
                    name: 'abra',
                    playerDetails: {
                        Top: {
                            id: 1,
                            name: 'Roïdräge',
                            champions: ['Volibear', 'Ornn', 'Sett'],
                            role: 'Top'
                        },
                        Bot: {
                            id: 2,
                            name: 'TheIncentive',
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
            const sampleTentativeList = [
              {
                serverName: msg.member.guild.name,
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '1'
                },
                tentativePlayers: [{
                    id: '1',
                    name: 'Roidrage',
                }]
                },
                {
                    serverName: msg.member.guild.name,
                    tournamentDetails: {
                        tournamentName: 'awesome_sauce',
                        tournamentDay: '2'
                    },
                    tentativePlayers: [{
                        id: '1',
                        name: 'Roidrage',
                    }]
                }
            ];

            let parsedResponse = [{ ...sampleTeamTwoPlayers[0] }];
            parsedResponse[0].name = 'Abra';

            const getTentativeDetailsMock = jest.fn();
            clashBotRestClient.TentativeApi.mockReturnValue({
                getTentativeDetails: getTentativeDetailsMock
                  .mockResolvedValue(sampleTentativeList)
            });
            const getTeamMock = jest.fn();
            clashBotRestClient.TeamApi.mockReturnValue({
                getTeam: getTeamMock.mockResolvedValue(sampleTeamTwoPlayers)
            });
            let copy = buildExpectedTeamsListWithTentative(
              parsedResponse,
              sampleTentativeList
            );
            await teams.execute(msg);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(getTentativeDetailsMock).toHaveBeenCalledTimes(1);
            expect(getTentativeDetailsMock)
              .toHaveBeenCalledWith(msg.member.guild.name);
            expect(getTeamMock).toHaveBeenCalledTimes(1);
            expect(getTeamMock)
              .toHaveBeenCalledWith(msg.member.guild.name);
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]});
        });

        test('When multiple tentative players and a team are passed back and some have empty Tentative Player lists, it should populate the tentative list with the existing team based on all the tournaments.', async () => {
            let msg = buildMockInteraction();
            const sampleTeamTwoPlayers = [
                {
                    name: 'abra',
                    playerDetails: {
                        Top: {
                            id: 1,
                            name: 'Roïdräge',
                            champions: ['Volibear', 'Ornn', 'Sett'],
                            role: 'Top'
                        },
                        Bot: {
                            id: 2,
                            name: 'TheIncentive',
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
            let sampleTentativeList = [{
                serverName: msg.member.guild.name,
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '1'
                },
                tentativePlayers: [{
                    id: '1',
                    name: 'Roidrage',
                }]
            }, {
                serverName: msg.member.guild.name,
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '2'
                },
                tentativePlayers: [{
                    id: '1',
                    name: 'Roidrage',
                }]
            }, {
                serverName: msg.member.guild.name,
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '3'
                },
                tentativePlayers: []
            }];

            let parsedResponse = [{ ...sampleTeamTwoPlayers[0] }];
            parsedResponse[0].name = 'Abra';

            const getTentativeDetailsMock = jest.fn();
            clashBotRestClient.TentativeApi.mockReturnValue({
                getTentativeDetails: getTentativeDetailsMock
                  .mockResolvedValue(sampleTentativeList)
            });
            const getTeamMock = jest.fn();
            clashBotRestClient.TeamApi.mockReturnValue({
                getTeam: getTeamMock.mockResolvedValue(sampleTeamTwoPlayers)
            });
            sampleTentativeList = JSON.parse(JSON.stringify(sampleTentativeList.filter(record => record.tentativePlayers.length > 0)));
            let copy = buildExpectedTeamsListWithTentative(parsedResponse, sampleTentativeList);
            await teams.execute(msg);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(getTentativeDetailsMock).toHaveBeenCalledTimes(1);
            expect(getTentativeDetailsMock)
              .toHaveBeenCalledWith(msg.member.guild.name);
            expect(getTeamMock).toHaveBeenCalledTimes(1);
            expect(getTeamMock)
              .toHaveBeenCalledWith(msg.member.guild.name);
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]});
        });

        test('When multiple tentative records and a team are passed back and all have empty Tentative Player lists, it should populate with the existing team based on all the tournaments.', async () => {
            let msg = buildMockInteraction();
            const sampleTeamTwoPlayers = [
                {
                    name: 'abra',
                    playerDetails: {
                        Top: {
                            id: 1,
                            name: 'Roïdräge',
                            champions: ['Volibear', 'Ornn', 'Sett'],
                            role: 'Top'
                        },
                        Bot: {
                            id: 2,
                            name: 'TheIncentive',
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
            let sampleTentativeList = [{
                serverName: msg.member.guild.name,
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '1'
                },
                tentativePlayers: []
            }, {
                serverName: msg.member.guild.name,
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '2'
                },
                tentativePlayers: []
            }, {
                serverName: msg.member.guild.name,
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '3'
                },
                tentativePlayers: []
            }];

            let parsedResponse = [{ ...sampleTeamTwoPlayers[0] }];
            parsedResponse[0].name = 'Abra';

            const getTentativeDetailsMock = jest.fn();
            clashBotRestClient.TentativeApi.mockReturnValue({
                getTentativeDetails: getTentativeDetailsMock
                  .mockResolvedValue(sampleTentativeList)
            });
            const getTeamMock = jest.fn();
            clashBotRestClient.TeamApi.mockReturnValue({
                getTeam: getTeamMock.mockResolvedValue(sampleTeamTwoPlayers)
            });
            let copy = buildExpectedTeamsResponse(parsedResponse);
            await teams.execute(msg);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(getTentativeDetailsMock).toHaveBeenCalledTimes(1);
            expect(getTentativeDetailsMock)
              .toHaveBeenCalledWith(msg.member.guild.name);
            expect(getTeamMock).toHaveBeenCalledTimes(1);
            expect(getTeamMock)
              .toHaveBeenCalledWith(msg.member.guild.name);
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]});
        });
    });

    describe('Error', () => {
        test('Error - (Retrieve All Teams) - If an error occurs, the error handler will be invoked.', async () => {
            errorHandling.handleError = jest.fn();
            let msg = buildMockInteraction();
            const getTentativeDetailsMock = jest.fn();
            clashBotRestClient.TentativeApi.mockReturnValue({
                getTentativeDetails: getTentativeDetailsMock
                  .mockResolvedValue([])
            });
            const getTeamMock = jest.fn();
            clashBotRestClient.TeamApi.mockReturnValue({
                getTeam: getTeamMock.mockRejectedValue(create500HttpError())
            });
            await teams.execute(msg);
            expect(getTentativeDetailsMock).toHaveBeenCalledTimes(1);
            expect(getTentativeDetailsMock)
              .toHaveBeenCalledWith(msg.member.guild.name);
            expect(getTeamMock).toHaveBeenCalledTimes(1);
            expect(getTeamMock)
              .toHaveBeenCalledWith(msg.member.guild.name);
            expect(errorHandling.handleError)
              .toHaveBeenCalledTimes(1);
            expect(errorHandling.handleError)
              .toHaveBeenCalledWith(
                teams.name,
                create500HttpError(),
                msg,
                'Failed to retrieve the current Clash Teams status.',
                expect.anything(),
              );
        });

        test('Error - (Get Tenta- If an error occurs, the error handler will be invoked.', async () => {
            errorHandling.handleError = jest.fn();
            let msg = buildMockInteraction();
            const getTentativeDetailsMock = jest.fn();
            clashBotRestClient.TentativeApi.mockReturnValue({
                getTentativeDetails: getTentativeDetailsMock
                  .mockRejectedValue(create500HttpError())
            });
            const getTeamMock = jest.fn();
            clashBotRestClient.TeamApi.mockReturnValue({
                getTeam: getTeamMock.mockResolvedValue([])
            });
            await teams.execute(msg);
            expect(getTentativeDetailsMock)
              .toHaveBeenCalledTimes(1);
            expect(getTentativeDetailsMock)
              .toHaveBeenCalledWith(msg.member.guild.name);
            expect(getTeamMock).toHaveBeenCalledTimes(1);
            expect(getTeamMock)
              .toHaveBeenCalledWith(msg.member.guild.name);
            expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
            expect(errorHandling.handleError)
              .toHaveBeenCalledWith(
                teams.name,
                create500HttpError(),
                msg,
                'Failed to retrieve the current Clash Teams status.',
                expect.anything(),
              );
        });
    });
});