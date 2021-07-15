const timeTracker = require('../utility/time-tracker');
const clashSubscriptionDbImpl = require('../dao/clash-subscription-db-impl');
const errorHandler = require('../utility/error-handling');

module.exports = {
    name: 'subscribe',
    description: 'Subscribes a user to a scheduled DM in Discord to notify them of an upcoming League of Legends Clash Tournament.',
    execute: async function (msg) {
        const startTime = process.hrtime.bigint();

        await clashSubscriptionDbImpl.subscribe(msg.author.id, msg.guild.name)
            .then(() => msg.reply('You have subscribed. You will receive a notification the Monday before ' +
            'a Clash Tournament weekend. If you want to unsubscribe at any time please use !clash unsubscribe'))
            .catch(err => errorHandler.handleError(this.name, err, msg, 'Failed to subscribe.'))
            .finally(() => {
                timeTracker.endExecution(this.name, startTime);
            });
    },
};
