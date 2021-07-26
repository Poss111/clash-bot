const dbUtils = require('../dao/clash-teams-db-impl');
const errorHandler = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
const leagueApi = require('../dao/clash-time-db-impl');
const commandArgumentParser = require('./command-argument-parser');

module.exports = {
    name: 'tentative',
    description: 'Places a player on tentative. Will deregister them if they belong to a team.',
    execute: async function (msg, args) {
        const startTime = process.hrtime.bigint();
        let parsedArguments = commandArgumentParser.parse(args);
        if (!parsedArguments || !parsedArguments.tournamentName) {
            msg.reply(`A tournament name to be tentative for is missing. Please use !clash tentative 'tournament name' to use tentative. i.e. !clash tentative msi2021`);
            timeTracker.endExecution(this.name, startTime);
        } else {
            await leagueApi.findTournament(parsedArguments.tournamentName).then(filteredData => {
                if (Array.isArray(filteredData) && filteredData.length > 0) {
                    dbUtils.handleTentative(msg.author.username, msg.guild.name, filteredData[0].tournamentName).then(data => {
                        if (data) {
                            msg.reply(`We have taken you off of tentative queue. tip: Use '!clash teams' to view current team status`);
                        } else {
                            msg.reply(`We placed you into the tentative queue. If you were on a team, you have been removed. tip: Use '!clash teams' to view current team status`);
                        }
                    }).catch(err => errorHandler.handleError(this.name, err, msg, 'Failed to place you on tentative.'))
                        .finally(() => {
                            timeTracker.endExecution(this.name, startTime);
                        });
                } else {
                    msg.reply('Cannot find the tournament passed. Please check !clash time for an appropriate list.');
                }
            });
        }
    },
};
