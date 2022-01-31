const throttleHandling = require('../utility/throttle-handling');
const timeTracker = require('../utility/time-tracker');
const wait = require('util').promisify(setTimeout);

module.exports = {
    name: 'dance',
    description: 'Just a command to dance!',
    async execute(msg) {
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
                ]
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
                console.log(`('${msg.user.username}') is trying to spam this resource.`);
                if (!throttleHandling.hasServerBeenNotified(this.name, msg.member.guild.name)) {
                    await msg.editReply('I see you know the ways of the spam. ' +
                        'If you want me to dance again, you must wait 30 seconds ;)');
                    throttleHandling.setServerNotified(this.name, msg.member.guild.name);
                }
            }
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
