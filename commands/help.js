const helpMenu = require('../templates/help-menu.js');
const timeTracker = require('../utility/time-tracker');

module.exports = {
    name: 'help',
    description: 'A self help guide on all the commands available for the Clash Bot.',
    execute(msg) {
        const startTime = process.hrtime.bigint();
        try {
            msg.reply({embeds: [ helpMenu ]});
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
