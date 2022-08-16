const errorHandler = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
const commandArgumentParser = require('./command-argument-parser');
const logger = require('../utility/logger');
const ClashBotRestClient = require('clash-bot-rest-client');
const {client} = require('../utility/rest-api-utilities');

module.exports = {
    name: 'unregister',
    description: 'Used to unregister from an existing Clash team.',
    options: [
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
            'choices': [
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
            const parsedArguments = commandArgumentParser.parse(args);
            if (!parsedArguments || (!parsedArguments.tournamentName || !parsedArguments.tournamentDay)) {
                msg.reply('Please pass the tournament and day to unregister for i.e. /unregister ***msi2021*** ***2***');
            } else {
                await msg.deferReply();
                const tournamentApi = new ClashBotRestClient.TournamentApi(client());
                let times = await tournamentApi.getTournaments({
                    tournament: parsedArguments.tournamentName,
                    day: parsedArguments.tournamentDay,
                });
                if (Array.isArray(times) && times.length) {
                    logger.info(loggerContext, `Found ('${times ? times.length : 0}') Tournaments.`);
                    await msg.editReply(`Unregistering '${msg.user.username}' from Tournament '${times[0].tournamentName}' on day '${times[0].tournamentDay}'...`);
                    const teamApi = new ClashBotRestClient.TeamApi(client());
                    const teams = await teamApi.getTeam(
                      msg.member.guild.name,
                      {
                          tournament: times[0].tournamentName,
                          day: times[0].tournamentDay,
                      }
                    );
                    const foundTeam = teams.find(team => Object.entries(team.playerDetails)
                      .find(entry => entry[1].id === msg.user.id));
                    if (foundTeam) {
                        const response = await teamApi.removePlayerFromTeam(
                          foundTeam.name,
                          msg.member.guild.name,
                          times[0].tournamentName,
                          times[0].tournamentDay,
                          msg.user.id
                        );
                        await msg.editReply(`Removed you from Team '${response.name}' for Tournament '${times[0].tournamentName} - ${times[0].tournamentDay}'. Please use /join or /newTeam if you would like to join again. Thank you!`);
                    } else {
                        await msg.editReply(`You do not belong to any of the Teams for Tournament '${times[0].tournamentName}' on day '${times[0].tournamentDay}'.`);
                    }
                } else {
                    logger.info(loggerContext, `Unable to find a Tournament based on Tournament ('${parsedArguments.tournamentName}') Day ('${parsedArguments.tournamentDay}').`);
                    await msg.editReply('Please provide an existing tournament and day to unregister for. ' +
                        'Use \'/team\' to print a team.');
                }
            }
        } catch (error) {
            if (error.status === 400) {
                logger.error({...loggerContext, ...error});
                await msg.editReply(`We did not find you on an existing Team for Tournament '${args[0]} - ${args[1]}'. Please use /join or /newTeam if you would like to join again. Thank you!`);
            } else {
                await errorHandler.handleError(
                  this.name,
                  error,
                  msg,
                  'Failed to unregister you.',
                  loggerContext);
            }
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
