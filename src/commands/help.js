const helpMenu = require('../templates/help-menu.js');
const timeTracker = require('../utility/time-tracker');
const errorHandling = require('../utility/error-handling');

module.exports = {
    name: 'help',
    description: 'A self help guide on all the commands available for the Clash Bot.',
    async execute(msg) {
        const loggerContext = {
            command: this.name,
            user: msg.user.id,
            username: msg.user.username,
            server: msg.member ? msg.member.guild.name : {}
        };
        const startTime = process.hrtime.bigint();
        try {
            await msg.reply({embeds: [ helpMenu ]});
        } catch(error) {
            await errorHandling.handleError(
              this.name,
              error,
              msg,
              'Failed to get help menu.',
              loggerContext);
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
