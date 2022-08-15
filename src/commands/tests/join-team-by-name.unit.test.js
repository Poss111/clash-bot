const joinTeamByName = require('../join-team-by-name');
const errorHandling = require('../../utility/error-handling');
const registerReply = require('../../templates/register-reply');
const {buildMockInteraction} = require('./shared-test-utilities/shared-test-utilities.test');
const clashBotRestClient = require('clash-bot-rest-client');

jest.mock('../../utility/error-handling');
jest.mock('clash-bot-rest-client');

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

function buildExpectedRegisterResponse(sampleRegisterReturn) {
    let copy = JSON.parse(JSON.stringify(registerReply));
    copy.fields.push({
        name: sampleRegisterReturn.name,
        value: Object.entries(sampleRegisterReturn.playerDetails)
            .map(details => `${details[0]} - ${details[1].name ? details[1].name : details[1].id}`).join('\n'),
        inline: true
    });
    copy.fields.push({
        name: 'Tournament Details',
        value: `${sampleRegisterReturn.tournament.tournamentName} Day ${sampleRegisterReturn.tournament.tournamentDay}`,
        inline: true
    });
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

function create400HttpError() {
  return {
    error: `No team found matching criteria ''.`,
    headers: undefined,
    status: 400,
    statusText: "Bad Request",
    url: "https://localhost.com/api"
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

function setupTournamentError() {
  const getTournamentsMock = jest.fn();
  clashBotRestClient.TournamentApi.mockReturnValue({
    getTournaments: getTournamentsMock
      .mockRejectedValue(create500HttpError())
  });
  return getTournamentsMock;
}

function setupTeamUpdateFailure(msg, args, leagueTimes) {
  const teamRegisterMock = jest.fn();
  let expectedRequest = {
    updateTeamRequest: {
      serverName       : msg.member.guild.name,
      teamName         : args[3].toLowerCase(),
      tournamentDetails: {
        tournamentName: leagueTimes[0].tournamentName,
        tournamentDay : leagueTimes[0].tournamentDay,
      },
      playerId         : msg.user.id,
      role             : args[0]
    }
  };
  clashBotRestClient.UpdateTeamRequest.mockReturnValue(
    expectedRequest.updateTeamRequest);
  clashBotRestClient.TeamApi.mockReturnValue({
    updateTeam: teamRegisterMock.mockRejectedValue(create500HttpError()),
  });
  return teamRegisterMock;
}

describe('Join an existing Team', () => {
  describe('Happy Path and edge cases', () => {
    test(
      'When a user requests to join a team, they are required to pass the role, tournament name, tournament day and Team Name.',
      async () => {
          let msg = buildMockInteraction();
          await joinTeamByName.execute(msg);
          expect(msg.deferReply).toHaveBeenCalledTimes(0);
          expect(msg.reply).toHaveBeenCalledTimes(1);
          expect(msg.reply).toHaveBeenCalledWith(
            "Role, Tournament name, Tournament day, and Team are missing. You can use '/teams' to find existing teams. \n ***Usage***: /join ***Top*** ***msi2021*** ***1*** ***Pikachu***");
      })

    test(
      'When a user requests to join a team, they are required to pass the tournament and Team Name and it is given and empty.',
      async () => {
          let msg = buildMockInteraction();
          await joinTeamByName.execute(msg, []);
          expect(msg.deferReply).toHaveBeenCalledTimes(0);
          expect(msg.reply).toHaveBeenCalledTimes(1);
          expect(msg.reply).toHaveBeenCalledWith(
            "Role, Tournament name, Tournament day, and Team are missing. You can use '/teams' to find existing teams. \n ***Usage***: /join ***Top*** ***msi2021*** ***1*** ***Pikachu***");
      })

    test(
      'When a user requests to join a team with only the role, they are required to pass the tournament name and day and Team Name.',
      async () => {
          let msg = buildMockInteraction();
          let args = ['Top'];
          await joinTeamByName.execute(msg, args);
          expect(msg.deferReply).toHaveBeenCalledTimes(0);
          expect(msg.reply).toHaveBeenCalledTimes(1);
          expect(msg.reply).toHaveBeenCalledWith(
            `Tournament name, Tournament day and Team are missing. You can use '/teams' to find existing teams. \n ***Usage***: /join ${args[0]} ***msi2021*** ***1*** ***Pikachu***`);
      })

    test(
      'When a user requests to join a team with only the role and tournament name, they are required to pass the tournament day and Team Name.',
      async () => {
          let msg = buildMockInteraction();
          let args = ['Top', 'msi2021']
          await joinTeamByName.execute(msg, args);
          expect(msg.deferReply).toHaveBeenCalledTimes(0);
          expect(msg.reply).toHaveBeenCalledTimes(1);
          expect(msg.reply).toHaveBeenCalledWith(
            `Tournament day and Team are missing. You can use '/teams' to find existing teams. \n ***Usage***: /join ${args[0]} ${args[1]} ***1*** ***Pikachu***`);
      })

    test(
      'When a user requests to join a team with only the role and tournament details, they are required to pass the Team Name.',
      async () => {
          let msg = buildMockInteraction();
          let args = ['Top', 'msi2021', '1']
          await joinTeamByName.execute(msg, args);
          expect(msg.deferReply).toHaveBeenCalledTimes(0);
          expect(msg.reply).toHaveBeenCalledTimes(1);
          expect(msg.reply).toHaveBeenCalledWith(
            `Team is missing. You can use '/teams' to find existing teams. \n ***Usage***: /join ${args[0]} ${args[1]} ${args[2]} ***Pikachu***`);
      })

    test('When a user requests to join a team with only the role and tournament details, ' +
      'they are required to pass a correct role.', async () => {
        let msg = buildMockInteraction();
        let args = ['adc', 'msi2021', '1', 'Blaziken'];
        await joinTeamByName.execute(msg, args);
        expect(msg.deferReply).toHaveBeenCalledTimes(0);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith(
          `The role passed is not correct - '${args[0]}'. Please pass one of the following Top, Mid, Jg, Bot, or Supp.`);
    })

    test(
      'When a user requests to join a team and they pass a role, Tournament details that does not exist, they should be notified.',
      async () => {
          let msg = buildMockInteraction();
          let args = ['Top', 'dne', '1', 'Sample Team'];
          const getTournamentsMock = setupTournaments([
              {
                  tournamentName    : "msi2021",
                  tournamentDay     : "day_3",
                  "startTime"       : "May 29 2021 07:00 pm PDT",
                  "registrationTime": "May 29 2021 04:15 pm PDT"
              },
              {
                  tournamentName    : "msi2021",
                  tournamentDay     : "day_4",
                  "startTime"       : "May 30 2021 07:00 pm PDT",
                  "registrationTime": "May 30 2021 04:15 pm PDT"
              }
          ]);
          await joinTeamByName.execute(msg, args);
          expect(msg.deferReply).toHaveBeenCalledTimes(1);
          expect(getTournamentsMock).toHaveBeenCalledTimes(1);
          expect(getTournamentsMock).toHaveBeenCalledWith({});
          expect(msg.editReply).toHaveBeenCalledTimes(1);
          expect(msg.editReply).toHaveBeenCalledWith(
            `The tournament you are trying to join does not exist Name '${args[1]}' Day '${args[2]}'. Please use '/times' to see valid tournaments.`);
      })

    test(
      'When a user requests to join a team and they pass a Tournament and a Team they should be notified that they have successfully joined a Team.',
      async () => {
          let msg = buildMockInteraction();
          let args = ['Top', 'msi2021', '1', 'Sample']
          const leagueTimes = [
              {
                  tournamentName  : "msi2021",
                  tournamentDay   : "1",
                  startTime       : "May 29 2021 07:00 pm PDT",
                  registrationTime: "May 29 2021 04:15 pm PDT"
              }
          ];
          const getTournamentsMock = setupTournaments(leagueTimes);
          const teamRegisterMock = jest.fn();
          let playerDetails = {};
          playerDetails[args[0]] = {
              id        : msg.user.id,
              name      : msg.user.username,
              role      : args[0],
              champions : ['sett'],
              serverName: msg.member.guild.name
          };
          let expectedRequest = {
              updateTeamRequest: {
                  serverName       : msg.member.guild.name,
                  teamName         : args[3].toLowerCase(),
                  tournamentDetails: {
                      tournamentName: leagueTimes[0].tournamentName,
                      tournamentDay : leagueTimes[0].tournamentDay,
                  },
                  playerId         : msg.user.id,
                  role             : args[0]
              }
          };
          const expectedResponse = {
              playerDetails,
              name      : args[3],
              serverName: msg.member.guild.name,
              tournament: {
                  tournamentName: leagueTimes[0].tournamentName,
                  tournamentDay : leagueTimes[0].tournamentDay,
              }
          };
          clashBotRestClient.UpdateTeamRequest.mockReturnValue(
            expectedRequest.updateTeamRequest);
          clashBotRestClient.TeamApi.mockReturnValue({
              updateTeam: teamRegisterMock.mockResolvedValue(expectedResponse),
          });
          let copy = buildExpectedRegisterResponse(expectedResponse);
          await joinTeamByName.execute(msg, args);
          expect(errorHandling.handleError).not.toHaveBeenCalled();
          expect(getTournamentsMock).toHaveBeenCalledTimes(1);
          expect(getTournamentsMock).toHaveBeenCalledWith({});
          expect(teamRegisterMock).toHaveBeenCalledTimes(1);
          expect(teamRegisterMock).toBeCalledWith(expectedRequest);
          expect(msg.deferReply).toHaveBeenCalledTimes(1);
          expect(msg.editReply).toHaveBeenCalledTimes(1);
          expect(msg.editReply).toHaveBeenCalledWith({embeds: [copy]});
      })

    test(
      'When a user requests to join a team and they pass a Tournament and a Team and no Team exists with that name, they should have a message specifying that we were unable to find one matching the criteria.',
      async () => {
          let msg = buildMockInteraction();
          let args = ['Top', 'msi2021', '1', 'Sample']
          const leagueTimes = [
            {
              tournamentName  : "msi2021",
              tournamentDay   : "1",
              startTime       : "May 29 2021 07:00 pm PDT",
              registrationTime: "May 29 2021 04:15 pm PDT"
            }
          ];
          const getTournamentsMock = setupTournaments(leagueTimes);
          const teamRegisterMock = jest.fn();
          let expectedRequest = {
              updateTeamRequest: {
                  serverName       : msg.member.guild.name,
                  teamName         : args[3].toLowerCase(),
                  tournamentDetails: {
                      tournamentName: leagueTimes[0].tournamentName,
                      tournamentDay : leagueTimes[0].tournamentDay,
                  },
                  playerId         : msg.user.id,
                  role             : args[0]
              }
          };
          clashBotRestClient.UpdateTeamRequest.mockReturnValue(
            expectedRequest.updateTeamRequest);
          clashBotRestClient.TeamApi.mockReturnValue({
              updateTeam: teamRegisterMock.mockRejectedValue(create400HttpError()),
          });
          await joinTeamByName.execute(msg, args);
          expect(errorHandling.handleError).not.toHaveBeenCalled();
          expect(getTournamentsMock).toHaveBeenCalledTimes(1);
          expect(getTournamentsMock).toHaveBeenCalledWith({});
          expect(teamRegisterMock).toHaveBeenCalledTimes(1);
          expect(teamRegisterMock).toHaveBeenCalledWith({
            updateTeamRequest: {
              serverName       : msg.member.guild.name,
              teamName         : args[3].toLowerCase(),
              tournamentDetails: {
                tournamentName: leagueTimes[0].tournamentName,
                tournamentDay : leagueTimes[0].tournamentDay,
              },
              playerId         : msg.user.id,
              role             : args[0]
            }
          });
          expect(msg.deferReply).toHaveBeenCalledTimes(1);
          expect(msg.editReply).toHaveBeenCalledTimes(1);
          expect(msg.editReply).toHaveBeenCalledWith(`Failed to find an available team with the following criteria, Role '${args[0]}' Tournament Name '${args[1]}' Tournament Day '${args[2]}' Team Name '${args[3]}' or role is not available for that team`);
      })
  })

  describe('Error', () => {
    test('If an error occurs while retrieving tournaments, the error handled will be invoked.', async () => {
      let msg = buildMockInteraction();
      let args = ['Top', 'msi2021', '1', 'Sample Team'];
      const getTournamentsMock = setupTournamentError();
      await joinTeamByName.execute(msg, args);
      expect(getTournamentsMock).toHaveBeenCalledTimes(1);
      expect(getTournamentsMock).toHaveBeenCalledWith({});
      expect(msg.deferReply).toHaveBeenCalledTimes(1);
      expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
      expect(errorHandling.handleError)
        .toHaveBeenCalledWith(
          joinTeamByName.name,
          create500HttpError(),
          msg,
          'Failed to join the requested team.',
          expect.anything(),
        );
    });

    test('If an error occurs while updating Team details, the error handled will be invoked.', async () => {
      let msg = buildMockInteraction();
      let args = ['Top', 'msi2021', '1', 'Sample']
      const leagueTimes = [
        {
          tournamentName  : "msi2021",
          tournamentDay   : "1",
          startTime       : "May 29 2021 07:00 pm PDT",
          registrationTime: "May 29 2021 04:15 pm PDT"
        }
      ];
      const getTournamentsMock = setupTournaments(leagueTimes);
      const teamRegisterMock = setupTeamUpdateFailure(msg, args, leagueTimes);
      await joinTeamByName.execute(msg, args);
      expect(getTournamentsMock).toHaveBeenCalledTimes(1);
      expect(getTournamentsMock).toHaveBeenCalledWith({});
      expect(teamRegisterMock).toHaveBeenCalledTimes(1);
      expect(teamRegisterMock).toHaveBeenCalledWith({
        updateTeamRequest: {
          serverName       : msg.member.guild.name,
          teamName         : args[3].toLowerCase(),
          tournamentDetails: {
            tournamentName: leagueTimes[0].tournamentName,
            tournamentDay : leagueTimes[0].tournamentDay,
          },
          playerId         : msg.user.id,
          role             : args[0]
        }
      });
      expect(msg.deferReply).toHaveBeenCalledTimes(1);
      expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
      expect(errorHandling.handleError).toHaveBeenCalledWith(
        joinTeamByName.name,
        create500HttpError(),
        msg,
        'Failed to join the requested team.',
        expect.anything(),
      );
    });
  });
});
