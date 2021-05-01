const dbUtils = require('../team-impl');
module.exports = {
    name: 'tentative',
    description: 'Places a player on tentative. Will deregister them if they belong to a team.',
    execute(msg, args) {
        dbUtils.placeOnTentative(msg.author.username);
        msg.reply(`We placed you into the tentative queue. If you were on a team, you have been removed.`);
    },
};
