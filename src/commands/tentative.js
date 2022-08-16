const ClashBotRestClient = require('clash-bot-rest-client');
const errorHandler = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
const commandArgumentParser = require('./command-argument-parser');
const logger = require('../utility/logger');
const {client} = require('../utility/rest-api-utilities');

module.exports = {
    name: 'tentative',
    description: 'Places a player on tentative. Will deregister them if they belong to a team.',
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
            let parsedArguments = commandArgumentParser.parse(args);
            if (!parsedArguments || !parsedArguments.tournamentName) {
                await msg.reply('A Tournament Name to be tentative for is missing. ' +
                    'Please use /tentative \'tournament name\' \'tournament day\' ' +
                    'to use tentative. i.e. /tentative msi2021 1');
            } else if (!parsedArguments.tournamentDay) {
                await msg.reply('A Tournament Day to be tentative for is missing. Please ' +
                    'use /tentative \'tournament name\' \'tournament day\' to ' +
                    'use tentative. i.e. /tentative msi2021 1');
            } else {
                await msg.deferReply();
                const tournamentApi = new ClashBotRestClient.TournamentApi(client());
                const request = {};
                if (parsedArguments.tournamentName) {
                    request.tournament = parsedArguments.tournamentName;
                } if (parsedArguments.tournamentDay) {
                    request.day = parsedArguments.tournamentDay;
                }
                let times = await tournamentApi.getTournaments(request);
                logger.info(loggerContext, `Total found Tournaments ('${Array.isArray(times) ? times.length : 0}')`);
                if (Array.isArray(times) && times.length > 0) {
                    const tentativeApi = new ClashBotRestClient.TentativeApi(client());
                    const tentativeDetails = await tentativeApi.getTentativeDetails({
                        tournamentName: times[0].tournamentName,
                        tournamentDay: times[0].tournamentDay,
                    });
                    const foundTentative = tentativeDetails
                      .find(tentativeDetail => tentativeDetail
                        .tentativePlayers.find(player => player.id === msg.user.id));
                    if (foundTentative) {
                        await tentativeApi
                          .removePlayerFromTentative(
                            msg.member.guild.name,
                            msg.user.id,
                            times[0].tournamentName,
                            times[0].tournamentDay
                          );
                        await msg.editReply('We have taken you off of tentative queue. tip: Use \'/teams\' to view current team status');
                    } else {
                        let opts = {
                            'placePlayerOnTentativeRequest': new ClashBotRestClient
                              .PlacePlayerOnTentativeRequest({
                                  serverName       : msg.member.guild.name,
                                  tournamentDetails: {
                                      tournamentName: '',
                                      tournamentDay : '',
                                  },
                                  playerId: msg.user.id,
                              })
                        };
                        await tentativeApi.placePlayerOnTentative(opts);
                        await msg.editReply('We placed you into the tentative queue. If you were on a team, you have been removed. tip: Use \'/teams\' to view current team status');
                    }
                } else {
                    await msg.editReply('Cannot find the tournament passed. Please check /time for an appropriate list.');
                }
            }
        } catch (error) {
            await errorHandler.handleError(
              this.name,
              error,
              msg,
              'Failed to place you on tentative.',
              loggerContext);
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
