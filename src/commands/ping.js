const timeTracker = require('../utility/time-tracker');
const errorHandling = require('../utility/error-handling');
module.exports = {
    name: 'ping',
    description: 'Ping!',
    async execute(msg) {
        const loggerContext = {
            command: this.name,
            user: msg.user.id,
            username: msg.user.username,
            server: msg.member ? msg.member.guild.name : {}
        };
        const startTime = process.hrtime.bigint();
        try {
            await msg.reply('pong');
        } catch(error) {
            await errorHandling.handleError(
              this.name,
              error,
              msg,
              'Failed to ping the pong.',
              loggerContext);
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
