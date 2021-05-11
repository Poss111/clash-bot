const dbUtils = require('../dao/dynamo-db-impl');
const errorHandler = require('../utility/error-handling');
module.exports = {
    name: 'unregister',
    description: 'Used to unregister from an existing Clash team.',
    execute: function (msg, callback) {
        msg.channel.send(`Unregistering ${msg.author.username}...`)
        dbUtils.deregisterPlayer(msg.author.username, msg.guild.name).then(data => {
            if (data) {
                msg.reply(`Removed you from your Team. Please use !clash register if you would like to join again. Thank you!`)
            } else {
                msg.reply(`We did not find you on an existing Team. Please use !clash register if you would like to join again. Thank you!`);
            }
            return callback();
        }).catch(err => {
            errorHandler.handleError(this.name, err, msg, 'Failed to unregister you.');
            return callback();
        });
    },
};
