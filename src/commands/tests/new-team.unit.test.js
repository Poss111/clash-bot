const newTeam = require('../new-team');
const errorHandling = require('../../utility/error-handling');
const registerReply = require('../../templates/register-reply');
const commandArgumentParser = require('../command-argument-parser');
const {buildMockInteraction} = require('./shared-test-utilities/shared-test-utilities.test');
const clashBotRestClient = require('clash-bot-rest-client');

jest.mock('../../utility/error-handling');
jest.mock('../command-argument-parser');
jest.mock('clash-bot-rest-client');

beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
})

function buildRegisterResponse(sampleRegisterReturn) {
    let copy = JSON.parse(JSON.stringify(registerReply));
    copy.fields.push({
        name: sampleRegisterReturn.name,
        value: Object.entries(sampleRegisterReturn.playerDetails)
          .map(details => `${details[0]} - ${details[1].name ? details[1].name : details[1].id}`)
          .toString(),
        inline: true
    });
    copy.fields.push({
        name: 'Tournament Details',
        value: `${sampleRegisterReturn.tournament.tournamentName} Day ${sampleRegisterReturn.tournament.tournamentDay}`,
        inline: true
    });
    return copy;
}

function buildIneligibleResponse() {
    let copy = JSON.parse(JSON.stringify(registerReply));
    copy.description = 'You are already registered to the given tournament.';
    return copy;
}

function setupTournaments(tournaments) {
    const getTournamentsMock = jest.fn();
    clashBotRestClient.TournamentApi.mockReturnValue({
        getTournaments: getTournamentsMock
          .mockResolvedValue(tournaments)
    });
    return getTournamentsMock;
}

function setupSuccessfulCreateNewTeamRequest(args, msg, leagueTimes) {
    const createNewTeamMock = jest.fn();
    let playerDetails = {};
    playerDetails[args[0]] = {
        id        : msg.user.id,
        name      : msg.user.username,
        role      : args[0],
        champions : ['sett'],
        serverName: msg.member.guild.name
    };
    const expectedResponse = {
        playerDetails,
        name      : 'newteam',
        serverName: msg.member.guild.name,
        tournament: {
            tournamentName: leagueTimes[0].tournamentName,
            tournamentDay : leagueTimes[0].tournamentDay,
        }
    };
    clashBotRestClient.TeamApi.mockReturnValue({
        createNewTeam: createNewTeamMock.mockResolvedValue(expectedResponse)
    });
    let expectedCreateNewRequest = {
        createNewTeamRequest: {
            serverName    : msg.member.guild.name,
            tournamentName: leagueTimes[0].tournamentName,
            tournamentDay : leagueTimes[0].tournamentDay,
            playerDetails : {
                id  : msg.user.id,
                role: args[0],
            }
        }
    };
    return {
        createNewTeamMock,
        expectedCreateNewRequest,
        expectedResponse,
    };
}

function create500HttpError() {
    return {
        error: `Failed to make call.`,
        headers: undefined,
        status: 500,
        statusText: "Bad Request",
        url: "https://localhost.com/api"
    };
}

describe('New Team', () => {
    describe('Happy Path and edge case', () => {
        test('If a user is successfully registered, then a reply stating the Team that the User has been registered to should be returned.', async () => {
            let msg = buildMockInteraction();
            const args = ['Top'];
            let leagueTimes = [
                {
                    tournamentName: "msi2021",
                    tournamentDay: "day_3",
                    "startTime": "May 29 2021 07:00 pm PDT",
                    "registrationTime": "May 29 2021 04:15 pm PDT"
                },
                {
                    tournamentName: "msi2021",
                    tournamentDay: "day_4",
                    "startTime": "May 30 2021 07:00 pm PDT",
                    "registrationTime": "May 30 2021 04:15 pm PDT"
                }
            ];
            const getTournamentsMock = setupTournaments(leagueTimes);
            commandArgumentParser.parse.mockReturnValue({});
            let {
                createNewTeamMock,
                expectedCreateNewRequest,
                expectedResponse
            } = setupSuccessfulCreateNewTeamRequest(args, msg, leagueTimes);
            await newTeam.execute(msg, args);
            let copy = buildRegisterResponse(expectedResponse);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({});
            expect(createNewTeamMock).toHaveBeenCalledTimes(1);
            expect(createNewTeamMock).toHaveBeenCalledWith(expectedCreateNewRequest);
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(2);
            expect(msg.editReply).toHaveBeenCalledWith(`Registering '${msg.user.username}' for the first available tournament as '${args[0]}' that you are not already registered to...`);
            expect(msg.editReply).toHaveBeenCalledWith({embeds: [copy]})
        })

        test('If a user is registering with an undefined array for args, then a reply stating that the user needs ' +
            'to pass the role he wants to register with.', async () => {
            let msg = buildMockInteraction();
            commandArgumentParser.parse.mockReturnValue({});
            await newTeam.execute(msg);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(msg.deferReply).not.toHaveBeenCalled();
            expect(msg.editReply).not.toHaveBeenCalled();
            expect(msg.reply).toHaveBeenCalledTimes(1);
            expect(msg.reply).toHaveBeenCalledWith(`The role to join a new Team with is missing. Please pass one of the following Top, Mid, Jg, Bot, or Supp.\n ***Usage***: /newTeam ***Top***`);
        })

        test('If a user is registering with an invalid role type (not Top, Mid, Jg, Bot, or Supp for args, then a reply stating that the user needs to pass the role he wants to register with.', async () => {
            let msg = buildMockInteraction();
            commandArgumentParser.parse.mockReturnValue({});
            let rolePassed = 'Jung';
            await newTeam.execute(msg, [rolePassed]);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(msg.deferReply).not.toHaveBeenCalled();
            expect(msg.editReply).not.toHaveBeenCalled();
            expect(msg.reply).toHaveBeenCalledTimes(1);
            expect(msg.reply).toHaveBeenCalledWith(`The role passed is not correct - '${rolePassed}'. Please pass one of the following Top, Mid, Jg, Bot, or Supp.\n ***Usage***: /newTeam ***Top***`);
        })

        test('If a user is registering with an array for args, then a reply stating that the user needs to pass the role he wants to register with.', async () => {
            let msg = buildMockInteraction();
            commandArgumentParser.parse.mockReturnValue({});
            await newTeam.execute(msg, []);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(msg.deferReply).not.toHaveBeenCalled();
            expect(msg.editReply).not.toHaveBeenCalled();
            expect(msg.reply).toHaveBeenCalledTimes(1);
            expect(msg.reply).toHaveBeenCalledWith(`The role to join a new Team with is missing. Please pass one of the following Top, Mid, Jg, Bot, or Supp.\n ***Usage***: /newTeam ***Top***`);
        })

        test('If a user requests a specific tournament that does not exist, they should receive a response letting them know we were unable to find a tournament.', async () => {
            let msg = buildMockInteraction();
            const args = ['Top', 'dne'];
            commandArgumentParser.parse.mockReturnValue({tournamentName: args[1]});
            const getTournamentsMock = setupTournaments(undefined);
            await newTeam.execute(msg, args);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[1].toLowerCase(),
            });
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(2);
            expect(msg.editReply).toHaveBeenCalledWith(`Registering '${msg.user.username}' for Tournament '${args[1]}' as '${args[0]}'...`);
            expect(msg.editReply).toHaveBeenCalledWith(`We were unable to find a Tournament with '${args[1]}'. Please try again.`);
        })

        test('If a user requests a specific tournament that does not exist and the list is empty, they should receive a response letting them know we were unable to find a tournament.', async () => {
            let msg = buildMockInteraction();
            const args = ['Top', 'dne'];
            commandArgumentParser.parse.mockReturnValue({tournamentName: args[1]});
            const getTournamentsMock = setupTournaments([]);
            await newTeam.execute(msg, args);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[1].toLowerCase(),
            });
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(2);
            expect(msg.editReply).toHaveBeenCalledWith(`Registering '${msg.user.username}' for Tournament '${args[1]}' as '${args[0]}'...`);
            expect(msg.editReply).toHaveBeenCalledWith(`We were unable to find a Tournament with '${args[1]}'. Please try again.`);
        })

        test('If a user requests a specific tournament name and day that does not exist and the list is empty, they should receive a response letting them know we were unable to find a tournament.', async () => {
            let msg = buildMockInteraction();
            const args = ['Top', 'dne', '1'];
            commandArgumentParser.parse.mockReturnValue({tournamentName: args[1], tournamentDay: args[2]});
            const getTournamentsMock = setupTournaments([]);
            await newTeam.execute(msg, args);
            expect(errorHandling.handleError).not.toHaveBeenCalled();
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[1].toLowerCase(),
                day: args[2],
            });
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(2);
            expect(msg.editReply).toHaveBeenCalledWith(`Registering '${msg.user.username}' for Tournament '${args[1]}' on day '${args[2]}' as '${args[0]}'...`);
            expect(msg.editReply).toHaveBeenCalledWith(`We were unable to find a Tournament with '${args[1]}' and '${args[2]}'. Please try again.`);
        })
    })

    describe('Error', () => {
        test('If an error occurs while retrieving Tournaments, the error handler will be invoked.', async () => {
            errorHandling.handleError = jest.fn();
            let msg = buildMockInteraction();
            const args = ['Top', 'msi2021', '3'];
            const getTournamentsMock = jest.fn();
            clashBotRestClient.TournamentApi.mockReturnValue({
                getTournaments: getTournamentsMock
                  .mockRejectedValue(create500HttpError())
            });
            commandArgumentParser
              .parse
              .mockReturnValue({ tournamentName: args[1], tournamentDay: args[2] });
            await newTeam.execute(msg, args);
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({
                tournament: args[1],
                day: args[2],
            });
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledWith(`Registering '${msg.user.username}' for Tournament '${args[1]}' on day '${args[2]}' as '${args[0]}'...`);
            expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
            expect(errorHandling.handleError).toHaveBeenCalledWith(
              newTeam.name,
              create500HttpError(),
              msg,
              'Failed to register you to team.'
            );
        })

        test('If a user does not request a specific tournament that does not exist and the list is empty, they should receive a response letting them know we were unable to find a tournament.', async () => {
            let msg = buildMockInteraction();
            errorHandling.handleError = jest.fn();
            const args = ['Top'];
            commandArgumentParser.parse.mockReturnValue({});
            const getTournamentsMock = setupTournaments([])
            await newTeam.execute(msg, args);
            expect(getTournamentsMock).toHaveBeenCalledTimes(1);
            expect(getTournamentsMock).toHaveBeenCalledWith({});
            expect(msg.deferReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledTimes(1);
            expect(msg.editReply).toHaveBeenCalledWith(`Registering '${msg.user.username}' for the first available tournament as '${args[0]}' that you are not already registered to...`);
            expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
            expect(errorHandling.handleError).toHaveBeenCalledWith(newTeam.name,
              new Error('Failed to find any tournaments to attempt to register to.'),
              msg, 'Failed to find any tournaments to attempt to register to.');
        })
    })
})