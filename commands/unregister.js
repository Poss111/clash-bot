const tournamentsServiceImpl = require('../services/tournaments-service-impl');
const teamsServiceImpl = require('../services/teams-service-impl');
const errorHandler = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
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
            try {
                let times = await tournamentsServiceImpl.retrieveAllActiveTournaments(parsedArguments.tournamentName, parsedArguments.tournamentDay);
                if (Array.isArray(times) && times.length) {
                    msg.channel.send(`Unregistering ${msg.author.username} from Tournament ${times[0].tournamentName} on Day ${times[0].tournamentDay}...`)
                    let data = await teamsServiceImpl.deleteFromTeam(msg.author.id, msg.guild.name, times[0].tournamentName, times[0].tournamentDay);
                    if (!data.error) {
                        msg.reply(`Removed you from your Team. Please use !clash register if you would like to join again. Thank you!`)
                    } else {
                        msg.reply(`We did not find you on an existing Team. Please use !clash register if you would like to join again. Thank you!`);
                    }
                } else {
                    msg.reply(`Please provide an existing tournament and day to unregister for. Use '!clash team' to print a teams.`);
                }
            } catch (err) {
                errorHandler.handleError(this.name, err, msg, 'Failed to unregister you.')
            } finally {
                timeTracker.endExecution(this.name, startTime);
            }
        }
    },
};
