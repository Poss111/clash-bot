const dbUtils = require('../dao/dynamo-db-impl');
const errorHandler = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
module.exports = {
    name: 'tentative',
    description: 'Places a player on tentative. Will deregister them if they belong to a team.',
    execute: async function(msg) {
        const startTime = process.hrtime.bigint();
        await dbUtils.handleTentative(msg.author.username, msg.guild.name).then(data => {
            if (data) {
                msg.reply(`We have taken you off of tentative queue. tip: Use '!clash teams' to view current team status`);
            } else {
                msg.reply(`We placed you into the tentative queue. If you were on a team, you have been removed. tip: Use '!clash teams' to view current team status`);
            }
        }).catch(err => errorHandler.handleError(this.name, err, msg, 'Failed to place you on tentative.'))
            .finally(() => {
                timeTracker.endExecution(this.name, startTime);
            });
    },
};
