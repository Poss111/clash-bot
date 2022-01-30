const throttleHandling = require('../utility/throttle-handling');
const timeTracker = require('../utility/time-tracker');

const createPromiseTimeout = (method, time) => {
    return new Promise(resolve => setTimeout(() =>
        method.then(resolve()), time));
}

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
                let promises = [];
                promises.push(createPromiseTimeout(msg.reply('I'), 500));
                promises.push(createPromiseTimeout(msg.followUp('want'), 2500));
                promises.push(createPromiseTimeout(msg.followUp('to'), 4500));
                promises.push(createPromiseTimeout(msg.followUp('dance!'), 5000));
                promises.push(createPromiseTimeout(msg.followUp('0.0'), 5500));
                promises.push(createPromiseTimeout(msg.followUp('|0.0/'), 6000));
                promises.push(createPromiseTimeout(msg.followUp('\\0.0|'), 6500));
                promises.push(createPromiseTimeout(msg.followUp('|0.0|'), 7000));
                promises.push(createPromiseTimeout(msg.followUp('_0.0|'), 7500));
                await Promise.all(promises);
            } else {
                console.log(`('${msg.user.username}') is trying to spam this resource.`);
                if (!throttleHandling.hasServerBeenNotified(this.name, msg.member.guild.name)) {
                    await msg.reply('I see you know the ways of the spam. ' +
                        'If you want me to dance again, you must wait 30 seconds ;)');
                    throttleHandling.setServerNotified(this.name, msg.member.guild.name);
                }
            }
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
