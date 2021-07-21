const timeTracker = require('../utility/time-tracker');
module.exports = {
    name: 'live',
    description: 'Ping!',
    execute(msg) {
        const startTime = process.hrtime.bigint();
        try {
            msg.reply('Bobs Bar and Grill');
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
