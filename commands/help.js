const Discord = require('discord.js');
const helpMenu = require('../help-menu.js');
module.exports = {
    name: 'help',
    description: 'A simple help menu to be displayed for understanding how to use this bot.',
    execute(msg, args) {
        msg.channel.send({embed: helpMenu});
    },
};
