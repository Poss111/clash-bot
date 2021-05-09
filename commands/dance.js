module.exports = {
    name: 'dance',
    description: 'Just a command to dance!',
    execute(msg, args) {
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
    },
};
