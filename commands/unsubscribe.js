const timeTracker = require('../utility/time-tracker');
const userServiceImpl = require('../services/user-service-impl');
const errorHandler = require('../utility/error-handling');

module.exports = {
    name: 'unsubscribe',
    description: 'Unsubscribes a user to a scheduled DM in Discord to notify them of an upcoming League of Legends Clash Tournament.',
    execute: async function (msg) {
        const startTime = process.hrtime.bigint();
        try {
            let userDetails = await userServiceImpl.getUserDetails(msg.author.id);
            if (userDetails.subscriptions.UpcomingClashTournamentDiscordDM) {
                userDetails.subscriptions.UpcomingClashTournamentDiscordDM = false;
                let updatedUserDetails = await userServiceImpl.postUserDetails(msg.author.id, msg.author.username, userDetails.serverName, userDetails.preferredChampions, userDetails.subscriptions);
                if(!updatedUserDetails.subscriptions.UpcomingClashTournamentDiscordDM) {
                    msg.reply('You have successfully unsubscribed.')
                } else {
                    msg.reply('No subscription was found.');
                }
            } else {
                msg.reply('No subscription was found.');
            }
        } catch (err) {
            errorHandler.handleError(this.name, err, msg, 'Failed to unsubscribe.')
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
