const dbUtils = require('../dao/team-impl');
module.exports = {
    name: 'register',
    description: 'Used to register the user to an available Clash team.',
    execute: function (msg, args) {
        msg.channel.send(`Registering ${msg.author.username}...`)
        let team = dbUtils.registerPlayer(msg.author.username);
        if (team.exist) {
            msg.reply(`You are already registered to ${team.name} your Team consists so far of ${team.players}`);
        } else {
            msg.reply(`Registered on ${team.name} your Team consists so far of ${team.players}`);
        }
    },
};
