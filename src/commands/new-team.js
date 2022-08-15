const ClashBotRestClient = require('clash-bot-rest-client');
const errorHandling = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
const registerReply = require('../templates/register-reply');
const {parseUserInfo} = require('../services/user-information-service-impl');
const logger = require('../utility/logger');

module.exports = {
    name: 'new-team',
    description: 'Used to create a new Team for an available Clash Tournament.',
    options: [
        {
            type: 3,
            name: "role",
            description: "Top, Mid, Jg, Bot, or Supp",
            choices: [
                {
                    "name": "Top",
                    "value": "Top"
                },
                {
                    "name": "Middle",
                    "value": "Mid"
                },
                {
                    "name": "Jungle",
                    "value": "Jg"
                },
                {
                    "name": "Bottom",
                    "value": "Bot"
                },
                {
                    "name": "Supp",
                    "value": "Supp"
                }
            ],
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
        const loggerContext = {
            command: this.name,
            user: msg.user.id,
            username: msg.user.username,
            server: msg.member ? msg.member.guild.name : {}
        };
        const startTime = process.hrtime.bigint();
        try {
            const userInfo = parseUserInfo(msg);
            if (!args || args.length === 0) {
                await msg.reply("The role to join a new Team with is missing. Please pass one of the following Top, Mid, Jg, Bot, or Supp.\n ***Usage***: /newTeam ***Top***");
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
                    await msg.reply(`The role passed is not correct - '${role}'. Please pass one of the following Top, Mid, Jg, Bot, or Supp.\n ***Usage***: /newTeam ***Top***`)
                } else {
                    await msg.deferReply();
                    const request = {};
                    if (args[1]) {
                        let registeringMessage = `Registering '${userInfo.username}' for Tournament '${args[1]}'`;
                        request.tournament = args[1];
                        if (args[2]) {
                            registeringMessage = registeringMessage + ` on day '${args[2]}'`;
                            request.day = args[2];
                        }
                        await msg.editReply(registeringMessage + ` as '${role}'...`);
                    } else {
                        await msg.editReply(`Registering '${userInfo.username}' for the first available tournament as '${role}' that you are not already registered to...`);
                    }
                    const tournamentApi = new ClashBotRestClient
                      .TournamentApi(new ClashBotRestClient
                        .ApiClient('http://localhost:808/api/v2'));
                    let filteredClashTimes = await tournamentApi.getTournaments(request);
                    if (!filteredClashTimes
                        || !filteredClashTimes.length) {
                        if (!args[1]) {
                            await errorHandling.handleError(this.name,
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
                                value: `${team.tournament.tournamentName} Day ${team.tournament.tournamentDay}`,
                                inline: true
                            };
                        }

                        logger.info(loggerContext, `Create new Team User with TournamentName ('${filteredClashTimes[0].tournamentName}') TournamentDay ('${filteredClashTimes[0].tournamentDay}') Role ('${args[0]}')`);

                        const teamApi = ClashBotRestClient
                          .TeamApi(new ClashBotRestClient
                            .ApiClient('http://localhost:8080/api/v2'));
                        let opts = {
                            createNewTeamRequest:
                              {
                                  serverName: msg.member.guild.name,
                                  tournamentName: filteredClashTimes[0].tournamentName,
                                  tournamentDay: filteredClashTimes[0].tournamentDay,
                                  playerDetails: {
                                      id: msg.user.id,
                                      role: args[0]
                                  }
                              }
                        };
                        const response = await teamApi.createNewTeam(opts);
                        let copy = JSON.parse(JSON.stringify(registerReply));
                        copy.fields.push({
                            name: response.name,
                            value: Object.entries(response.playerDetails)
                              .map(details => `${details[0]} - ${details[1].name ? details[1].name : details[1].id}`)
                              .toString(),
                            inline: true,
                        });
                        copy.fields.push(buildTournamentDetails(response));
                        await msg.editReply({embeds: [copy]});
                    }
                }
            }
        } catch (err) {
            await errorHandling.handleError(this.name, err, msg, 'Failed to register you to team.');
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    }
}
