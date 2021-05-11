const throttleHandling = require('../utility/throttle-handling');

module.exports = {
    name: 'dance',
    description: 'Just a command to dance!',
    execute(msg) {
        if (!throttleHandling.isThrottled(this.name)) {
            throttleHandling.placeThrottle(this.name, 30000);
            setTimeout(() => {
                msg.channel.send('I');
            }, 500);
            setTimeout(() => {
                msg.channel.send('want');
            }, 2500);
            setTimeout(() => {
                msg.channel.send('to');
            }, 4500);
            setTimeout(() => {
                msg.channel.send('dance!');
            }, 5000);
            setTimeout(() => {
                msg.channel.send('0.0');
            }, 5500);
            setTimeout(() => {
                msg.channel.send('|0.0/');
            }, 6000);
            setTimeout(() => {
                msg.channel.send('\\0.0|');
            }, 6500);
            setTimeout(() => {
                msg.channel.send('|0.0|');
            }, 7000);
            setTimeout(() => {
                msg.channel.send('_0.0|');
            }, 7500);
        } else {
            console.log(`('${msg.author.username}') is trying to spam this resource.`);
            msg.reply('I see you know the ways of the spam. If you want me to dance again, you must wait 30 seconds ;)');
        }
    },
};
