const helpMenu = require('../templates/help-menu.js');
const timeTracker = require('../utility/time-tracker');
module.exports = {
    name: 'help',
    description: 'A simple help menu to be displayed for understanding how to use this bot.',
    execute(msg) {
        const startTime = process.hrtime.bigint();
        try {
            msg.channel.send({embed: helpMenu});
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
