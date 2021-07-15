const timeTracker = require('../utility/time-tracker');
const clashSubscriptionDbImpl = require('../dao/clash-subscription-db-impl');
const errorHandler = require('../utility/error-handling');

module.exports = {
    name: 'unsubscribe',
    description: 'Unsubscribes a user to a scheduled DM in Discord to notify them of an upcoming League of Legends Clash Tournament.',
    execute: async function (msg) {
        const startTime = process.hrtime.bigint();
        await clashSubscriptionDbImpl.unsubscribe(msg.author.id, msg.guild.name).then(() => {
            msg.reply('You have successfully unsubscribed.');
        })
        .catch(err => errorHandler.handleError(this.name, err, msg, 'Failed to unsubscribe.'))
        .finally(() => {
            timeTracker.endExecution(this.name, startTime);
        });

    },
};
