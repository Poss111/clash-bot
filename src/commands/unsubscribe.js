const ClashBotRestClient = require("clash-bot-rest-client");
const logger = require('../utility/logger');
const timeTracker = require('../utility/time-tracker');
const errorHandler = require('../utility/error-handling');

module.exports = {
    name: 'unsubscribe',
    description: 'Unsubscribes a user to a DM in Discord of an upcoming League of Legends Clash Tournament.',
    execute: async function (msg) {
        const loggerContext = {
            command: this.name,
            user: msg.user.id,
            username: msg.user.username,
            server: msg.member ? msg.member.guild.name : {} };
        const startTime = process.hrtime.bigint();
        try {
            await msg.deferReply();
            const userApi = new ClashBotRestClient.UserApi(new ClashBotRestClient.ApiClient('http://localhost:8080/api/v2'))
            let subscriptions = await userApi.retrieveUserSubscriptions(msg.user.id);
            let subscription = subscriptions.find((obj) => obj.key === 'UpcomingClashTournamentDiscordDM');
            logger.info(loggerContext, `Users current subscriptions => ${subscriptions}`);
            if (subscription && subscription.isOn) {
                await userApi.unsubscribeUser(msg.user.id);
                await msg.editReply('You have successfully unsubscribed.');
            } else {
                await msg.editReply('No subscription was found.');
            }
        } catch (err) {
            await errorHandler.handleError(this.name, err, msg, 'Failed to unsubscribe.')
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
