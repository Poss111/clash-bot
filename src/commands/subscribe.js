const ClashBotRestClient = require("clash-bot-rest-client");
const logger = require('../utility/logger');
const timeTracker = require('../utility/time-tracker');
const errorHandler = require('../utility/error-handling');

module.exports = {
    name: 'subscribe',
    description: 'Subscribes a user to a scheduled DM in Discord of an upcoming League of Legends Clash Tournament.',
    execute: async function (msg) {
        const loggerContext = { command: 'subscribe', user: msg.user.id,
            username: msg.user.username,
            server: msg.member ? msg.member.guild.name : {} };
        const startTime = process.hrtime.bigint();
        try {
            await msg.deferReply();
            const userApi = ClashBotRestClient.UserApi(new ClashBotRestClient.ApiClient('http://localhost:8080/api/v2'))
            let subscriptions = await userApi.retrieveUserSubscriptions(msg.user.id);
            let subscription = subscriptions.find((obj) => obj.key === 'UpcomingClashTournamentDiscordDM');
            logger.info(loggerContext, `Users current subscriptions => ${subscription}`)
            if (subscription && !subscription.isOn) {
                await userApi.subscribeUser(msg.user.id);
                await msg.editReply('You have subscribed. You will receive a notification the Monday before ' +
                    'a Clash Tournament weekend. If you want to unsubscribe at any time please use /unsubscribe');
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
