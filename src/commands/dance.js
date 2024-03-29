const throttleHandling = require('../utility/throttle-handling');
const timeTracker = require('../utility/time-tracker');
const wait = require('util').promisify(setTimeout);
const logger = require('../utility/logger');
const errorHandling = require('../utility/error-handling');

module.exports = {
    name: 'dance',
    description: 'It is a secret.',
    async execute(msg) {
        const loggerContext = {
            command: this.name,
            user: msg.user.id,
            username: msg.user.username,
            server: msg.member ? msg.member.guild.name : {}
        };
        const startTime = process.hrtime.bigint();
        try {
            if (!throttleHandling.isThrottled(this.name, msg.member.guild.name)) {
                throttleHandling.placeThrottle(this.name, msg.member.guild.name, 30000);
                throttleHandling.removeServerNotified(this.name, msg.member.guild.name);
                await msg.deferReply();
                let messages = [
                    'I',
                    'want',
                    'to',
                    'dance!',
                    '0.0',
                    '|0.0/',
                    '\\0.0|',
                    '|0.0|',
                    '_0.0|'
                ];
                await msg.editReply(messages[0]);
                await wait(1000);
                await msg.editReply(messages[1]);
                await wait(1000);
                await msg.editReply(messages[2]);
                await wait(500);
                await msg.editReply(messages[3]);
                await wait(500);
                await msg.editReply(messages[4]);
                await wait(500);
                await msg.editReply(messages[5]);
                await wait(500);
                await msg.editReply(messages[6]);
                await wait(500);
                await msg.editReply(messages[7]);
                await wait(500);
                await msg.editReply(messages[8]);
            } else {
                logger.info(loggerContext, `('${msg.user.username}') is trying to spam this resource.`);
                if (!throttleHandling.hasServerBeenNotified(this.name, msg.member.guild.name)) {
                    await msg.editReply('I see you know the ways of the spam. ' +
                        'If you want me to dance again, you must wait 30 seconds ;)');
                    throttleHandling.setServerNotified(this.name, msg.member.guild.name);
                }
            }
        } catch(error) {
            await errorHandling.handleError(
              this.name,
              error,
              msg,
              'Failed to dance for you.',
              loggerContext);
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
