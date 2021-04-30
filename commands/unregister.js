const dbUtils = require('../team-impl');
module.exports = {
    name: 'unregister',
    description: 'Used to unregister from an existing Clash team.',
    execute: function (msg, args) {
        msg.channel.send(`Unregistering ${msg.author.username}...`)
        let playerDeregistered = dbUtils.deregisterPlayer(msg.author.username);
        if (playerDeregistered) {
            msg.reply(`Removed you from your Team. Please use !clash register if you would like to join again. Thank you!`)
        } else {
            msg.reply(`We did not find you on an existing Team. Please use !clash register if you would like to join again. Thank you!`);
        }
    },
};
