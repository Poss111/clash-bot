const newTeam = require('../new-team');
const tournamentsServiceImpl = require('../../services/tournaments-service-impl');
const teamsServiceImpl = require('../../services/teams-service-impl');
const errorHandling = require('../../utility/error-handling');
const registerReply = require('../../templates/register-reply');
const commandArgumentParser = require('../command-argument-parser');

jest.mock('../../services/teams-service-impl');
jest.mock('../../services/tournaments-service-impl');
jest.mock('../../utility/error-handling');
jest.mock('../command-argument-parser');

beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
})

function verifyReply(messagePassed, sampleRegisterReturn) {
    expect(messagePassed.embed.fields[0].name).toEqual(sampleRegisterReturn.teamName);
    expect(messagePassed.embed.fields[0].value).toEqual(Object.entries(sampleRegisterReturn.playersRoleDetails)
        .map((key) => `${key[0]} - ${key[1]}`));
    expect(messagePassed.embed.fields[1].name).toEqual('Tournament Details');
    expect(messagePassed.embed.fields[1].value)
        .toEqual(`${sampleRegisterReturn.tournamentDetails.tournamentName} Day ${sampleRegisterReturn.tournamentDetails.tournamentDay}`);
}

function verifyRedundantRegistration(messagePassed) {
    expect(messagePassed.embed.description).toEqual(`You are already registered to the given tournament.`);
}

function buildRegisterResponse(sampleRegisterReturn) {
    let copy = JSON.parse(JSON.stringify(registerReply));
    copy.fields.push({
        name: sampleRegisterReturn.teamName,
        value: Object.entries(sampleRegisterReturn.playersRoleDetails)
            .map(keyValue => `${keyValue[0]} - ${keyValue[1]}`).toString(),
        inline: true
    });
    copy.fields.push({
        name: 'Tournament Details',
        value: `${sampleRegisterReturn.tournamentDetails.tournamentName} Day ${sampleRegisterReturn.tournamentDetails.tournamentDay}`,
        inline: true
    });
    return copy;
}

function buildMockInteraction() {
    return {
        deferReply: jest.fn(),
        reply: jest.fn(),
        editReply: jest.fn(),
        user: {
            id: '1',
            username: 'TestPlayer'
        },
        member: {
            guild: {
                name: 'TestServer'
            }
        }
    };
}

function buildIneligibleResponse() {
    let copy = JSON.parse(JSON.stringify(registerReply));
    copy.description = 'You are already registered to the given tournament.';
    return copy;
}

describe('New Team', () => {
    test('If a user is successfully registered, then a reply stating the Team that the User has been registered to should be returned.', async () => {
        let msg = buildMockInteraction();
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
        commandArgumentParser.parse.mockReturnValue({});
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(leagueTimes);
        const sampleRegisterReturn = {
            teamName: 'Team Abra',
            serverName: msg.member.guild.name,
            playersDetails: [
                {
                    id: 1,
                    name: 'Roidrage',
                }
            ],
            playersRoleDetails: {
                Top: 'Roidrage'
            },
            tournamentDetails: {
                tournamentName: leagueTimes[0].tournamentName,
                tournamentDay: leagueTimes[0].tournamentDay,
            },
            startTime: leagueTimes[0].startTime
        };
        teamsServiceImpl.postForNewTeam.mockResolvedValue(sampleRegisterReturn);
        const args = ['Top'];
        await newTeam.execute(msg, args);
        let copy = buildRegisterResponse(sampleRegisterReturn);

        expect(teamsServiceImpl.postForNewTeam).toBeCalledWith(msg.user.id, args[0], msg.member.guild.name,
            leagueTimes[0].tournamentName, leagueTimes[0].tournamentDay, leagueTimes[0].startTime);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith(`Registering '${msg.user.username}' for the first available tournament as '${args[0]}' that you are not already registered to...`);
        expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]})
    })

    test('If a user is registering with an undefined array for args, then a reply stating that the user needs ' +
        'to pass the role he wants to register with.', async () => {
        let msg = buildMockInteraction();
        commandArgumentParser.parse.mockReturnValue({});
        await newTeam.execute(msg);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).not.toHaveBeenCalled();
        expect(teamsServiceImpl.postForNewTeam).not.toHaveBeenCalled();
        expect(msg.reply).toHaveBeenCalledWith(`The role to join a new Team with is missing. Please pass one of the following Top, Mid, Jg, Bot, or Supp.\n ***Usage***: !clash newTeam ***Top***`);
    })

    test('If a user is registering with an invalid role type (not Top, Mid, Jg, Bot, or Supp for args, then a reply stating that the user needs ' +
        'to pass the role he wants to register with.', async () => {
        let msg = buildMockInteraction();
        commandArgumentParser.parse.mockReturnValue({});
        let rolePassed = 'Jung';
        await newTeam.execute(msg, [rolePassed]);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).not.toHaveBeenCalled();
        expect(teamsServiceImpl.postForNewTeam).not.toHaveBeenCalled();
        expect(msg.reply).toHaveBeenCalledWith(`The role passed is not correct - '${rolePassed}'. Please pass one of the following Top, Mid, Jg, Bot, or Supp.\n ***Usage***: !clash newTeam ***Top***`);
    })

    test('If a user is registering with an array for args, then a reply stating that the user needs ' +
        'to pass the role he wants to register with.', async () => {
        let msg = buildMockInteraction();
        commandArgumentParser.parse.mockReturnValue({});
        await newTeam.execute(msg, []);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).not.toHaveBeenCalled();
        expect(teamsServiceImpl.postForNewTeam).not.toHaveBeenCalled();
        expect(msg.reply).toHaveBeenCalledWith(`The role to join a new Team with is missing. Please pass one of the following Top, Mid, Jg, Bot, or Supp.\n ***Usage***: !clash newTeam ***Top***`);
    })

    test('If a user requests a specific tournament that does not exist, they should receive a response ' +
        'letting them know we were unable to find a tournament.', async () => {
        let msg = buildMockInteraction();
        const args = ['Top', 'dne'];
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[1]});
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(undefined);
        await newTeam.execute(msg, args);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(teamsServiceImpl.postForNewTeam).not.toHaveBeenCalled();
        expect(msg.reply).toHaveBeenCalledWith(`Registering '${msg.user.username}' for Tournament '${args[1]}' as '${args[0]}'...`);
        expect(msg.editReply).toHaveBeenCalledWith(`We were unable to find a Tournament with '${args[1]}'. Please try again.`);
    })

    test('If a user requests a specific tournament that does not exist and the list is empty, they should receive ' +
        'a response letting them know we were unable to find a tournament.', async () => {
        let msg = buildMockInteraction();
        const args = ['Top', 'dne'];
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[1]});
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue([]);
        await newTeam.execute(msg, args);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(teamsServiceImpl.postForNewTeam).not.toHaveBeenCalled();
        expect(msg.reply).toHaveBeenCalledWith(`Registering '${msg.user.username}' for Tournament '${args[1]}' as '${args[0]}'...`);
        expect(msg.editReply).toHaveBeenCalledWith(`We were unable to find a Tournament with '${args[1]}'. Please try again.`);
    })

    test('If a user requests a specific tournament name and day that does not exist and the list is empty, ' +
        'they should receive a response letting them know we were unable to find a tournament.', async () => {
        let msg = buildMockInteraction();
        const args = ['Top', 'dne', '1'];
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[1], tournamentDay: args[2]});
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue([]);
        await newTeam.execute(msg, args);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(teamsServiceImpl.postForNewTeam).not.toHaveBeenCalled();
        expect(msg.reply).toHaveBeenCalledWith(`Registering '${msg.user.username}' for Tournament '${args[1]}' on day '${args[2]}' as '${args[0]}'...`);
        expect(msg.editReply).toHaveBeenCalledWith(`We were unable to find a Tournament with '${args[1]}' and '${args[2]}'. Please try again.`);
    })

    test('If a user requests a specific tournament that exists, they should be signed up for that specific tournament.', async () => {
        let msg = buildMockInteraction();
        let leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "3",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                tournamentName: "msi2021",
                tournamentDay: "4",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            }
        ];
        const args = ['Top', 'msi2021'];
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[1]});
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(leagueTimes);
        const sampleRegisterReturn = {
            teamName: 'Team Abra',
            serverName: msg.member.guild.name,
            playersDetails: [{name: 'Roidrage'}],
            playersRoleDetails: {
                Top: 'Roidrage'
            },
            tournamentDetails: {
                tournamentName: leagueTimes[0].tournamentName,
                tournamentDay: leagueTimes[0].tournamentDay,
            },
            startTime: leagueTimes[0].startTime
        };
        teamsServiceImpl.postForNewTeam.mockResolvedValue(sampleRegisterReturn);
        let copy = buildRegisterResponse(sampleRegisterReturn);
        await newTeam.execute(msg, args);
        expect(teamsServiceImpl.postForNewTeam).toBeCalledWith(msg.user.id, args[0], msg.member.guild.name,
            leagueTimes[0].tournamentName, leagueTimes[0].tournamentDay, leagueTimes[0].startTime);

        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith(`Registering '${msg.user.username}' for Tournament '${args[1]}' as '${args[0]}'...`);
        expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]})
    })

    test('The user should be able to pass the tournament and day that they want to be registered towards.', async () => {
        let msg = buildMockInteraction();
        const args = ['Top', 'shurima2021', '2'];
        let leagueTimes = [
            {
                tournamentName: "shurima2021",
                tournamentDay: "1",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                tournamentName: "shurima2021",
                tournamentDay: "2",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            }
        ];
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[1], tournamentDay: args[2]});
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(leagueTimes);
        const sampleRegisterReturn = {
            teamName: 'Team Abra',
            serverName: msg.member.guild.name,
            playersDetails: [{name: 'Roidrage'}],
            playersRoleDetails: {
                Top: 'Roidrage'
            },
            tournamentDetails: {
                tournamentName: leagueTimes[1].tournamentName,
                tournamentDay: leagueTimes[1].tournamentDay,
            },
            startTime: leagueTimes[1].startTime
        };
        let copy = buildRegisterResponse(sampleRegisterReturn);
        teamsServiceImpl.postForNewTeam.mockResolvedValue(sampleRegisterReturn);
        await newTeam.execute(msg, args);

        expect(teamsServiceImpl.postForNewTeam).toBeCalledTimes(1);
        expect(teamsServiceImpl.postForNewTeam).toBeCalledWith(msg.user.id, args[0], msg.member.guild.name,
            leagueTimes[1].tournamentName, leagueTimes[1].tournamentDay, leagueTimes[1].startTime);

        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith(`Registering '${msg.user.username}' for Tournament '${args[1]}' on day '${args[2]}' as '${args[0]}'...`);
        expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]})
    })

    test('If a user is already on a team, then a reply stating the Team that the User has been registered to should be returned.', async () => {
        let msg = buildMockInteraction();
        let leagueTimes = [
            {
                tournamentName: "shurima2021",
                tournamentDay: "1",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            }
        ];
        const args = ['Top', 'shurima2021', '1'];
        const sampleRegisterReturn = {error: 'Player is not eligible to create a new Team.', statusCode: 400};
        let copy = buildIneligibleResponse();
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[1], tournamentDay: args[2]});

        teamsServiceImpl.postForNewTeam.mockResolvedValue(sampleRegisterReturn);
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(leagueTimes)
        await newTeam.execute(msg, args);

        expect(teamsServiceImpl.postForNewTeam).toBeCalledWith(msg.user.id, args[0], msg.member.guild.name,
            leagueTimes[0].tournamentName, leagueTimes[0].tournamentDay, leagueTimes[0].startTime);

        expect(teamsServiceImpl.postForNewTeam).toBeCalledTimes(1);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith(`Registering '${msg.user.username}' for Tournament '${args[1]}' on day '${args[2]}' as '${args[0]}'...`);
        expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]})
    })

    test('If a user is already on a team but there is an available Tournament, they should keep ' +
        'trying until they register for the successful tournament.', async () => {
        let msg = buildMockInteraction();
        let leagueTimes = [
            {
                tournamentName: "shurima2021",
                tournamentDay: "1",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                tournamentName: "shurima2021",
                tournamentDay: "2",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            }
        ];
        const args = ['Top', 's'];
        const sampleRegisterReturn = {error: 'Player is not eligible to create a new Team.', statusCode: 400};
        const sampleRegisterReturnTwo = {
            teamName: 'Team Abra',
            serverName: msg.member.guild.name,
            playersDetails: [
                {
                    id: 1,
                    name: 'Roidrage',
                    role: 'Top'
                }
            ],
            playersRoleDetails: {
                Top: 'Roidrage'
            },
            tournamentDetails: {
                tournamentName: leagueTimes[1].tournamentName,
                tournamentDay: leagueTimes[1].tournamentDay,
            },
            startTime: leagueTimes[1].startTime
        };
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[1], tournamentDay: args[2]});
        teamsServiceImpl.postForNewTeam.mockResolvedValueOnce(sampleRegisterReturn);
        teamsServiceImpl.postForNewTeam.mockResolvedValueOnce(sampleRegisterReturnTwo);
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(leagueTimes);

        let copy  = buildRegisterResponse(sampleRegisterReturnTwo);

        await newTeam.execute(msg, args);

        expect(teamsServiceImpl.postForNewTeam).toBeCalledTimes(2);
        expect(teamsServiceImpl.postForNewTeam).toBeCalledWith(msg.user.id, args[0], msg.member.guild.name,
            leagueTimes[0].tournamentName, leagueTimes[0].tournamentDay, leagueTimes[0].startTime);
        expect(teamsServiceImpl.postForNewTeam).toBeCalledWith(msg.user.id, args[0], msg.member.guild.name,
            leagueTimes[1].tournamentName, leagueTimes[1].tournamentDay, leagueTimes[1].startTime);

        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith(`Registering '${msg.user.username}' for Tournament '${args[1]}' as '${args[0]}'...`);
        expect(msg.editReply).toHaveBeenCalledWith({ embeds: [ copy ]});
    })

})

describe('Register Error', () => {
    test('If an error occurs, the error handler will be invoked.', async () => {
        errorHandling.handleError = jest.fn();
        let msg = buildMockInteraction();
        let leagueTime = [
            {
                tournamentName: "msi2021",
                tournamentDay: "3",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            }
        ];
        const args = ['Top', 'msi2021', '3'];
        commandArgumentParser.parse.mockReturnValue({tournamentName: args[1], tournamentDay: args[2]});
        teamsServiceImpl.postForNewTeam.mockRejectedValue('Some error occurred.');
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(leagueTime);

        await newTeam.execute(msg, args);

        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith(`Registering '${msg.user.username}' for Tournament '${args[1]}' on day '${args[2]}' as '${args[0]}'...`);
        expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
        expect(errorHandling.handleError).toHaveBeenCalledWith(newTeam.name, 'Some error occurred.', msg, 'Failed to register you to team.');
    })

    test('If a user does not request a specific tournament that does not exist and the list is empty, they should receive a response letting them know we were unable to find a tournament.', async () => {
        let messagePassed = '';
        let sendMessage = '';
        let msg = buildMockInteraction();
        errorHandling.handleError = jest.fn();
        const args = ['Top'];
        commandArgumentParser.parse.mockReturnValue({});
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue([]);
        await newTeam.execute(msg, args);

        expect(teamsServiceImpl.postForNewTeam).not.toHaveBeenCalled();
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith(`Registering '${msg.user.username}' for the first available tournament as '${args[0]}' that you are not already registered to...`);
        expect(errorHandling.handleError).toHaveBeenCalledTimes(1);
        expect(errorHandling.handleError).toHaveBeenCalledWith(newTeam.name,
            new Error('Failed to find any tournaments to attempt to register to.'),
            msg, 'Failed to find any tournaments to attempt to register to.');
    })
})
