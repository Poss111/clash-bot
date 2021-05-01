const dbUtils = require('../team-impl');
module.exports = {
    name: 'tentative',
    description: 'Places a player on tentative. Will deregister them if they belong to a team.',
    execute(msg, args) {
        let onTentative = dbUtils.handleTentative(msg.author.username);
        if (onTentative) {
            msg.reply(`We have taken you off of tentative queue. tip: Use '!clash teams' to view current team status`);
        } else {
            msg.reply(`We placed you into the tentative queue. If you were on a team, you have been removed. tip: Use '!clash teams' to view current team status`);
        }
    },
};
