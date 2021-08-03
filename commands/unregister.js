const dbUtils = require('../dao/clash-teams-db-impl');
const errorHandler = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
const leagueApi = require('../dao/clash-time-db-impl');
const commandArgumentParser = require('./command-argument-parser');

module.exports = {
    name: 'unregister',
    description: 'Used to unregister from an existing Clash team.',
    execute: async function (msg, args) {
        const startTime = process.hrtime.bigint();
        const parsedArguments = commandArgumentParser.parse(args);
        if (!parsedArguments || (!parsedArguments.tournamentName || !parsedArguments.tournamentDay)) {
            msg.reply(`Please pass the tournament and day to unregister for i.e. !clash unregister msi2021 2`);
            timeTracker.endExecution(this.name, startTime);
        } else {
            await leagueApi.findTournament(parsedArguments.tournamentName, parsedArguments.tournamentDay).then(filteredData => {
                if (Array.isArray(filteredData) && filteredData.length) {
                    msg.channel.send(`Unregistering ${msg.author.username} from Tournament ${filteredData[0].tournamentName} on Day ${filteredData[0].tournamentDay}...`)
                    dbUtils.deregisterPlayer(msg.author.username, msg.guild.name, filteredData).then(data => {
                        if (data) {
                            msg.reply(`Removed you from your Team. Please use !clash register if you would like to join again. Thank you!`)
                        } else {
                            msg.reply(`We did not find you on an existing Team. Please use !clash register if you would like to join again. Thank you!`);
                        }
                    }).catch(err => errorHandler.handleError(this.name, err, msg, 'Failed to unregister you.'))
                        .finally(() => {
                            timeTracker.endExecution(this.name, startTime);
                        });
                } else {
                    msg.reply(`Please provide an existing tournament and day to unregister for. Use '!clash team' to print a teams.`);
                }
            });
        }
    },
};
