const ClashBotRestClient = require('clash-bot-rest-client');
const registerReply = require('../templates/register-reply');
const {findTournament} = require('../utility/tournament-handler');
const errorHandling = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
const logger = require('../utility/logger');
const {capitalizeFirstLetter} = require('../utility/utilities');
const {client} = require('../utility/rest-api-utilities');

const buildTournamentDetails = (team) => {
    return {
        name: 'Tournament Details',
        value: `${team.tournament.tournamentName} Day ${team.tournament.tournamentDay}`,
        inline: true
    };
};

module.exports = {
    name: 'join',
    description: 'Used to join a specific Team.',
    options: [
        {
            type: 3,
            name: 'role',
            description: 'Top, Mid, Jg, Bot, or Supp',
            choices: [
                {
                    'name': 'Top',
                    'value': 'Top'
                },
                {
                    'name': 'Middle',
                    'value': 'Mid'
                },
                {
                    'name': 'Jungle',
                    'value': 'Jg'
                },
                {
                    'name': 'Bottom',
                    'value': 'Bot'
                },
                {
                    'name': 'Supp',
                    'value': 'Supp'
                }
            ],
            required: true
        },
        {
            type: 3,
            name: 'tournament',
            description: 'A future tournament to register for. Check time command if you do not know the name.',
            required: true
        },
        {
            type: 4,
            name: 'day',
            description: 'A day of the tournament to register for.',
            choices: [
                {
                    'name': 'Day 1',
                    'value': 1
                },
                {
                    'name': 'Day 2',
                    'value': 2
                },
                {
                    'name': 'Day 3',
                    'value': 3
                },
                {
                    'name': 'Day 4',
                    'value': 4
                }
            ],
            required: true
        },
        {
            type: 3,
            name: 'team-name',
            description: 'The name of the Team you would like to join (do not include the word Team).',
            required: true
        }
    ],
    execute: async function (msg, args) {
        const loggerContext = {
            command: this.name,
            user: msg.user.id,
            username: msg.user.username,
            server: msg.member ? msg.member.guild.name : {}
        };
        const startTime = process.hrtime.bigint();
        try {
            if (!args || args.length === 0) {
                await msg.reply('Role, Tournament name, Tournament day, and Team are missing. You can use \'/teams\' to find existing teams. \n ***Usage***: /join ***Top*** ***msi2021*** ***1*** ***Pikachu***');
            } else if (!args[1]) {
                await msg.reply(`Tournament name, Tournament day and Team are missing. You can use '/teams' to find existing teams. \n ***Usage***: /join ${args[0]} ***msi2021*** ***1*** ***Pikachu***`);
            } else if (!args[2]) {
                await msg.reply(`Tournament day and Team are missing. You can use '/teams' to find existing teams. \n ***Usage***: /join ${args[0]} ${args[1]} ***1*** ***Pikachu***`);
            } else if (!args[3]) {
                await msg.reply(`Team is missing. You can use '/teams' to find existing teams. \n ***Usage***: /join ${args[0]} ${args[1]} ${args[2]} ***Pikachu***`);
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
                    await msg.reply(`The role passed is not correct - '${role}'. Please pass one of the following Top, Mid, Jg, Bot, or Supp.`);
                } else {
                    await msg.deferReply();
                    const tournamentApi = new ClashBotRestClient.TournamentApi(client());
                    let times = await tournamentApi.getTournaments({});
                    times = times.filter(findTournament(args[1], args[2]));
                    if (times.length === 0) {
                        logger.info(loggerContext, `Unable to find Tournament for details - Name ('${args[1]}') Day ('${args[2]}').`);
                        await msg.editReply(`The tournament you are trying to join does not exist Name '${args[1]}' Day '${args[2]}'. Please use '/times' to see valid tournaments.`);
                    } else {
                        let copy = JSON.parse(JSON.stringify(registerReply));
                        logger.info(loggerContext, `Registering ('${msg.user.username}') with Tournaments ('${JSON.stringify(times)}') with role '${args[0]}'...`);
                        const teamApi = new ClashBotRestClient
                          .TeamApi(client());
                        let opts = {
                            'updateTeamRequest': new ClashBotRestClient.UpdateTeamRequest(
                                msg.member.guild.name,
                                args[3].toLowerCase(),
                                {
                                    tournamentName: times[0].tournamentName,
                                    tournamentDay: times[0].tournamentDay,
                                },
                                msg.user.id,
                                args[0]
                            ),
                        };
                        const team = await teamApi.updateTeam(opts);
                        logger.info(loggerContext, `Registered ('${msg.user.username}') with Role ('${args[0]}') Tournament ('${team.tournament.tournamentName}') Team ('${team.name}').`);
                        copy.fields.push({
                            name: capitalizeFirstLetter(team.name),
                            value: Object.entries(team.playerDetails)
                                .map(details => `${details[0]} - ${details[1].name ? details[1].name : details[1].id}`)
                              .join('\n'),
                            inline: true
                        });
                        copy.fields.push(buildTournamentDetails(team));
                        await msg.editReply({embeds: [copy]});
                    }
                }
            }
        } catch (error) {
            if (error.status === 400) {
                logger.error({ ...loggerContext, ...error });
                await msg.editReply(`Failed to find an available team with the following criteria, Role '${args[0]}' Tournament Name '${args[1]}' Tournament Day '${args[2]}' Team Name '${args[3]}' or role is not available for that team`);
            } else {
                await errorHandling.handleError(
                  this.name,
                  error,
                  msg,
                  'Failed to join the requested team.',
                  loggerContext);
            }
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    }
};
