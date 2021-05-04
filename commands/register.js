const dbUtils = require('../dao/dynamo-db-impl');
module.exports = {
    name: 'register',
    description: 'Used to register the user to an available Clash team.',
    execute: function (msg, args) {
        msg.channel.send(`Registering ${msg.author.username}...`)
        let team = dbUtils.registerPlayer(msg.author.username, msg.guild.name).then(data => {
            if (data.exist) {
                msg.reply(`You are already registered to ${team.name} your Team consists so far of ${team.players}`);
            } else {
                msg.reply(`Registered on ${team.name} your Team consists so far of ${team.players}`);
            }
        }).catch(err => {
            console.error(err);
            msg.reply('Failed to register you to team. Please reach out to <@299370234228506627>.')
        });
    },
};
