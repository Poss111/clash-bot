const dbUtils = require('../dao/dynamo-db-impl');
const errorHandler = require('../utility/error-handling');
module.exports = {
    name: 'register',
    description: 'Used to register the user to an available Clash team.',
    execute: function (msg) {
        msg.channel.send(`Registering ${msg.author.username}...`)
        dbUtils.registerPlayer(msg.author.username, msg.guild.name).then(data => {
            if (data.exist) {
                msg.reply(`You are already registered to ${data.teamName} your Team consists so far of ${data.players}`);
            } else {
                msg.reply(`Registered on ${data.teamName} your Team consists so far of ${data.players}`);
            }
        }).catch(err => errorHandler.handleError(this.name, err, msg, 'Failed to register you to team.'));
    },
};
