const tournamentsServiceImpl = require('../services/tournaments-service-impl');
const teamsServiceImpl = require('../services/teams-service-impl');
const errorHandling = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
const {findTournament} = require('../utility/tournament-handler');
const registerReply = require('../templates/register-reply');
const {parseUserInfo} = require('../services/user-information-service-impl');

module.exports = {
    name: 'new-team',
    description: 'Used to create a new Team for an available Clash Tournament.',
    options: [
        {
            type: 3,
            name: "role",
            description: "Top, Mid, Jg, Bot, or Supp",
            required: true
        },
        {
            type: 3,
            name: "tournament",
            description: "A future tournament to register for. Check time command if you do not know the name.",
            required: true
        },
        {
            type: 4,
            name: "day",
            description: "A day of the tournament to register for.",
            "choices": [
                {
                    "name": "Day 1",
                    "value": 1
                },
                {
                    "name": "Day 2",
                    "value": 2
                },
                {
                    "name": "Day 3",
                    "value": 3
                },
                {
                    "name": "Day 4",
                    "value": 4
                }
            ],
            required: true
        }
    ],
    execute: async function (msg, args) {
        const startTime = process.hrtime.bigint();
        try {
            const userInfo = parseUserInfo(msg);
            let filter;
            await msg.deferReply();
            if (!args || args.length === 0) {
                await msg.reply("The role to join a new Team with is missing. Please pass one of the following Top, Mid, Jg, Bot, or Supp.\n ***Usage***: !clash newTeam ***Top***");
            } else {
                let role = args[0];
                let roleNotMatching = false;
                switch (role.toLowerCase()) {
                    case('top'):
                        role = 'Top';
                        break;
                    case('mid'):
                        role = 'Mid';
                        break;
                    case('jg'):
                        role = 'Jg';
                        break;
                    case('bot'):
                        role = 'Bot';
                        break;
                    case('supp'):
                        role = 'Supp';
                        break;
                    default:
                        roleNotMatching = true;
                }
                if (roleNotMatching) {
                    await msg.reply(`The role passed is not correct - '${role}'. Please pass one of the following Top, Mid, Jg, Bot, or Supp.\n ***Usage***: !clash newTeam ***Top***`)
                } else {
                    if (args[1]) {
                        let registeringMessage = `Registering '${userInfo.username}' for Tournament '${args[1]}'`;
                        if (args[2]) {
                            registeringMessage = registeringMessage + ` on day '${args[2]}'`;
                            filter = findTournament(args[1], args[2]);
                        } else {
                            filter = findTournament(args[1]);
                        }
                        await msg.reply(registeringMessage + ` as '${role}'...`);
                    } else {
                        await msg.reply(`Registering '${userInfo.username}' for the first available tournament as '${role}' that you are not already registered to...`);
                    }
                    let filteredClashTimes = await tournamentsServiceImpl.retrieveAllActiveTournaments();
                    if (filter && filteredClashTimes) {
                        filteredClashTimes = filteredClashTimes.filter(filter)
                    }
                    if (!filteredClashTimes
                        || !filteredClashTimes.length) {
                        if (!args[1]) {
                            errorHandling.handleError(this.name,
                                new Error('Failed to find any tournaments to attempt to register to.'),
                                msg, 'Failed to find any tournaments to attempt to register to.');
                        } else {
                            let returnMessage = `We were unable to find a Tournament with '${args[1]}'`
                            if (args[2]) {
                                returnMessage = returnMessage + ` and '${args[2]}'`;
                            }
                            await msg.editReply(returnMessage + '. Please try again.');
                        }
                    } else {
                        function buildTournamentDetails(team) {
                            return {
                                name: 'Tournament Details',
                                value: `${team.tournamentDetails.tournamentName} Day ${team.tournamentDetails.tournamentDay}`,
                                inline: true
                            };
                        }

                        let notRegistered = true;
                        let data;
                        while (notRegistered && filteredClashTimes.length > 0) {
                            data = await teamsServiceImpl.postForNewTeam(userInfo.id, role, userInfo.guild,
                                filteredClashTimes[0].tournamentName, filteredClashTimes[0].tournamentDay,
                                filteredClashTimes[0].startTime);
                            if (data.error !== 'Player is not eligible to create a new Team.') {
                                notRegistered = false;
                            } else {
                                filteredClashTimes.splice(0, 1);
                            }
                        }
                        let copy = JSON.parse(JSON.stringify(registerReply));
                        if (data.error === 'Player is not eligible to create a new Team.') {
                            copy.description = 'You are already registered to the given tournament.';
                        } else {
                            copy.fields.push({
                                name: data.teamName,
                                value: Object.entries(data.playersRoleDetails)
                                    .map(keyValue => `${keyValue[0]} - ${keyValue[1]}`).toString(),
                                inline: true
                            });
                            copy.fields.push(buildTournamentDetails(data));
                        }
                        await msg.editReply({embeds: [copy]});
                    }
                }
            }
        } catch (err) {
            errorHandling.handleError(this.name, err, msg, 'Failed to register you to team.');
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    }
}
