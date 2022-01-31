const teams = require('../teams');
const clashBotTeamsServiceImpl = require('../../services/teams-service-impl');
const tentativeServiceImpl = require('../../services/tentative-service-impl');
const errorHandling = require('../../utility/error-handling');
const teamsCard = require('../../templates/teams');
const { buildMockInteraction } = require('./shared-test-utilities/shared-test-utilities.test');

jest.mock('../../services/teams-service-impl');
jest.mock('../../services/tentative-service-impl');
jest.mock('../../utility/error-handling');

function buildExpectedTeamsResponse(sampleTeamList) {
    let copy = JSON.parse(JSON.stringify(teamsCard));
    let counter = 1;
    sampleTeamList.forEach(team => {
        copy.fields.push({
            name: team.teamName,
            value: team.playersDetails.map(details => `${details.role} - ${details.name}`).join('\n'),
            inline: true
        });
        copy.fields.push({
            name: 'Tournament Details',
            value: `${team.tournamentDetails.tournamentName} Day ${team.tournamentDetails.tournamentDay}`,
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
            acc[key] = []
        }
        if (Array.isArray(value.tentativePlayers) && value.tentativePlayers.length > 0) {
            acc[key].push(value.tentativePlayers);
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

describe('Retrieve Teams', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    })

    test('When a team is passed back, it should be populated as a field in the embedded property of the reply.', async () => {
        let msg = buildMockInteraction();
        const sampleTeamTwoPlayers = [
            {
                teamName: 'Team Abra',
                playersDetails: [
                    {
                        name: 'Roïdräge',
                        champions: ['Volibear', 'Ornn', 'Sett'],
                        role: 'Top'
                    },
                    {
                        name: 'TheIncentive',
                        champions: ['Lucian'],
                        role: 'ADC'
                    },
                    {
                        name: 'Pepe Conrad',
                        champions: ['Lucian'],
                        role: 'Jg'
                    }
                ],
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '1'
                }
            }
        ];

        let copy = buildExpectedTeamsResponse(sampleTeamTwoPlayers);

        clashBotTeamsServiceImpl.retrieveActiveTeamsForServer.mockResolvedValue(JSON.parse(JSON.stringify(sampleTeamTwoPlayers)));
        await teams.execute(msg);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]});
    })

    test('When multiple teams are passed back, they should be populated as individual fields in the embedded property of the reply with their corresponding tournaments.', async () => {
        let msg = buildMockInteraction();
        const sampleTeamTwoPlayers = [
            {
                teamName: 'Team Abra',
                playersDetails: [
                    {
                        name: 'Roïdräge',
                        champions: ['Volibear', 'Ornn', 'Sett'],
                        role: 'Top'
                    },
                    {
                        name: 'TheIncentive',
                        champions: ['Lucian'],
                        role: 'ADC'
                    },
                    {
                        name: 'Pepe Conrad',
                        champions: ['Lucian'],
                        role: 'Jg'
                    }
                ],
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '1'
                }
            },
            {
                teamName: 'Team Charizard',
                playersDetails: [
                    {
                        name: 'Shiragaku',
                        champions: ['Volibear', 'Ornn', 'Sett'],
                        role: 'Top'
                    }
                ],
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '1'
                }
            }
        ];
        let copy = buildExpectedTeamsResponse(sampleTeamTwoPlayers);
        clashBotTeamsServiceImpl.retrieveActiveTeamsForServer.mockResolvedValue(JSON.parse(JSON.stringify(sampleTeamTwoPlayers)));
        await teams.execute(msg);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]});
    })

    test('When no teams are passed back, it should be populate the not existing teams message.', async () => {
        let msg = buildMockInteraction();
        const sampleTeamTwoPlayers = [];
        clashBotTeamsServiceImpl.retrieveActiveTeamsForServer.mockResolvedValue(sampleTeamTwoPlayers);

        let copy = buildExpectedNoTeamsResponse();

        await teams.execute(msg);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]});
    })

    test('When tentative players and no teams are passed back, it should populate the tentative list with an empty teams message.', async () => {
        let msg = buildMockInteraction();
        const sampleTeamTwoPlayers = [];
        const sampleTentativeList = [{
            serverName: msg.member.guild.name,
            tournamentDetails: {
                tournamentName: 'awesome_sauce',
                tournamentDay: '1'
            },
            tentativePlayers: ['Roidrage']
        }];
        let copy = buildExpectedTeamsListWithTentative(undefined, sampleTentativeList);
        clashBotTeamsServiceImpl.retrieveActiveTeamsForServer.mockResolvedValue(sampleTeamTwoPlayers);
        tentativeServiceImpl.retrieveTentativeListForServer.mockResolvedValue(sampleTentativeList);
        await teams.execute(msg);
        expect(tentativeServiceImpl.retrieveTentativeListForServer).toBeCalledWith(msg.member.guild.name);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]});
    })

    test('When multiple tentative players and a team are passed back, it should populate the tentative list with the existing team based on all the tournaments.', async () => {
        let msg = buildMockInteraction();
        const sampleTeamTwoPlayers = [
            {
                teamName: 'Team Abra',
                playersDetails: [
                    {
                        name: 'Roïdräge',
                        champions: ['Volibear', 'Ornn', 'Sett'],
                        role: 'Top'
                    },
                    {
                        name: 'TheIncentive',
                        champions: ['Lucian'],
                        role: 'ADC'
                    },
                    {
                        name: 'Pepe Conrad',
                        champions: ['Lucian'],
                        role: 'Jg'
                    }
                ],
                tournamentDetails: {
                    tournamentName: 'awesome_sauce',
                    tournamentDay: '1'
                }
            }
        ];
        const sampleTentativeList = [{
            serverName: msg.member.guild.name,
            tournamentDetails: {
                tournamentName: 'awesome_sauce',
                tournamentDay: '1'
            },
            tentativePlayers: ['Roidrage']
        }, {
            serverName: msg.member.guild.name,
            tournamentDetails: {
                tournamentName: 'awesome_sauce',
                tournamentDay: '2'
            },
            tentativePlayers: ['TheIncentive']
        }];

        let copy = buildExpectedTeamsListWithTentative(sampleTeamTwoPlayers, sampleTentativeList);
        clashBotTeamsServiceImpl.retrieveActiveTeamsForServer.mockResolvedValue(sampleTeamTwoPlayers);
        tentativeServiceImpl.retrieveTentativeListForServer.mockReturnValue(sampleTentativeList);
        await teams.execute(msg);

        expect(clashBotTeamsServiceImpl.retrieveActiveTeamsForServer).toHaveBeenCalledTimes(1);
        expect(tentativeServiceImpl.retrieveTentativeListForServer).toHaveBeenCalledTimes(1);
        expect(clashBotTeamsServiceImpl.retrieveActiveTeamsForServer).toHaveBeenCalledWith(msg.member.guild.name);
        expect(tentativeServiceImpl.retrieveTentativeListForServer).toBeCalledWith(msg.member.guild.name);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]});
    })

    test('When multiple tentative players and a team are passed back and some have empty Tentative Player lists, it should populate the tentative list with the existing team based on all the tournaments.', async () => {
        let msg = buildMockInteraction();
        const sampleTeamTwoPlayers = [
            {
                teamName: 'Team Abra',
                playersDetails: [
                    {
                        name: 'Roïdräge',
                        champions: ['Volibear', 'Ornn', 'Sett'],
                        role: 'Top'
                    },
                    {
                        name: 'TheIncentive',
                        champions: ['Lucian'],
                        role: 'ADC'
                    },
                    {
                        name: 'Pepe Conrad',
                        champions: ['Lucian'],
                        role: 'Jg'
                    }
                ],
                tournamentDetails: {
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
            tentativePlayers: ['Roidrage']
        }, {
            serverName: msg.member.guild.name,
            tournamentDetails: {
                tournamentName: 'awesome_sauce',
                tournamentDay: '2'
            },
            tentativePlayers: ['TheIncentive']
        }, {
            serverName: msg.member.guild.name,
            tournamentDetails: {
                tournamentName: 'awesome_sauce',
                tournamentDay: '2'
            },
            tentativePlayers: []
        }];
        sampleTentativeList = JSON.parse(JSON.stringify(sampleTentativeList.filter(record => record.tentativePlayers.length > 0)));
        let copy = buildExpectedTeamsListWithTentative(sampleTeamTwoPlayers, sampleTentativeList);
        clashBotTeamsServiceImpl.retrieveActiveTeamsForServer.mockResolvedValue(sampleTeamTwoPlayers);
        tentativeServiceImpl.retrieveTentativeListForServer.mockReturnValue(sampleTentativeList);
        await teams.execute(msg);

        expect(clashBotTeamsServiceImpl.retrieveActiveTeamsForServer).toHaveBeenCalledTimes(1);
        expect(tentativeServiceImpl.retrieveTentativeListForServer).toHaveBeenCalledTimes(1);
        expect(clashBotTeamsServiceImpl.retrieveActiveTeamsForServer).toHaveBeenCalledWith(msg.member.guild.name);
        expect(tentativeServiceImpl.retrieveTentativeListForServer).toBeCalledWith(msg.member.guild.name);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]});
    })
})

describe('Error Handling', () => {
    test('Error - clashBotTeamsServiceImpl.retrieveActiveTeamsForServer - If an error occurs, the error handler will be invoked.', async () => {
        errorHandling.handleError = jest.fn();
        let msg = buildMockInteraction();
        clashBotTeamsServiceImpl.retrieveActiveTeamsForServer.mockRejectedValue('Some error occurred.');
        await teams.execute(msg);
        expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
        expect(errorHandling.handleError).toHaveBeenCalledWith(teams.name, 'Some error occurred.', msg, 'Failed to retrieve the current Clash Teams status.');
    })

    test('Error - tentativeServiceImpl.retrieveTentativeListForServer - If an error occurs, the error handler will be invoked.', async () => {
        errorHandling.handleError = jest.fn();
        let msg = buildMockInteraction();
        tentativeServiceImpl.retrieveTentativeListForServer.mockRejectedValue('Some error occurred.');
        await teams.execute(msg);
        expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
        expect(errorHandling.handleError).toHaveBeenCalledWith(teams.name, 'Some error occurred.', msg, 'Failed to retrieve the current Clash Teams status.');
    })
});
