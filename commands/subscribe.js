const timeTracker = require('../utility/time-tracker');
const userServiceImpl = require('../services/user-service-impl');
const errorHandler = require('../utility/error-handling');

module.exports = {
    name: 'subscribe',
    description: 'Subscribes a user to a scheduled DM in Discord of an upcoming League of Legends Clash Tournament.',
    execute: async function (msg) {
        const startTime = process.hrtime.bigint();
        try {
            await msg.deferReply();
            let userDetails = await userServiceImpl.getUserDetails(msg.user.id);
            if (!userDetails.subscriptions || !userDetails.subscriptions.UpcomingClashTournamentDiscordDM) {
                userDetails.subscriptions = { UpcomingClashTournamentDiscordDM : true};
                userDetails.preferredChampions = !Array.isArray(userDetails.preferredChampions) ? [] : userDetails.preferredChampions;
                let updatedUserDetails = await userServiceImpl.postUserDetails(userDetails.id, msg.user.username,
                    msg.member.guild.name, userDetails.preferredChampions, userDetails.subscriptions);
                if (!userDetails.subscriptions || updatedUserDetails.subscriptions.UpcomingClashTournamentDiscordDM) {
                    await msg.editReply('You have subscribed. You will receive a notification the Monday before a Clash Tournament weekend. If you want to unsubscribe at any time please use !clash unsubscribe');
                } else {
                    await msg.editReply('Subscription failed. Please try again.');
                }
            } else {
                await msg.editReply('You are already subscribed.');
            }
        } catch (err) {
            await errorHandler.handleError(this.name, err, msg, 'Failed to subscribe.');
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
