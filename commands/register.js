const dbUtils = require('../dao/dynamo-db-impl');
const errorHandling = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
module.exports = {
    name: 'register',
    description: 'Used to register the user to an available Clash team.',
    execute: async function (msg) {
        const startTime = process.hrtime.bigint();
        msg.channel.send(`Registering ${msg.author.username}...`)
        await dbUtils.registerPlayer(msg.author.username, msg.guild.name).then(data => {
            if (data.exist) {
                msg.reply(`You are already registered to ${data.teamName} your Team consists so far of ${data.players}`);
            } else {
                msg.reply(`Registered on ${data.teamName} your Team consists so far of ${data.players}`);
            }
        }).catch(err => errorHandling.handleError(this.name, err, msg, 'Failed to register you to team.'))
            .finally(() => {
                timeTracker.endExecution(this.name, startTime);
            });
    },
};
