const timeTracker = require('../utility/time-tracker');
const userServiceImpl = require('../services/user-service-impl');
const errorHandler = require('../utility/error-handling');

module.exports = {
    name: 'subscribe',
    description: 'Subscribes a user to a scheduled DM in Discord to notify them of an upcoming League of Legends Clash Tournament.',
    execute: async function (msg) {
        const startTime = process.hrtime.bigint();
        try {
            let userDetails = await userServiceImpl.getUserDetails(msg.author.id);
            userDetails.subscriptions.UpcomingClashTournamentDiscordDM = true;
            let updatedUserDetails = await userServiceImpl.postUserDetails(userDetails.id, msg.author.username, msg.guild.name, userDetails.preferredChampions, userDetails.subscriptions);
            if (updatedUserDetails.subscriptions.UpcomingClashTournamentDiscordDM) {
                msg.reply('You have subscribed. You will receive a notification the Monday before a Clash Tournament weekend. If you want to unsubscribe at any time please use !clash unsubscribe');
            } else {
                msg.reply('Subscription failed. Please try again.');
            }
        } catch (err) {
            errorHandler.handleError(this.name, err, msg, 'Failed to subscribe.');
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
