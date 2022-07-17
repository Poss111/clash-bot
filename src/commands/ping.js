const timeTracker = require('../utility/time-tracker');
module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(msg) {
        const startTime = process.hrtime.bigint();
        try {
            msg.reply('pong');
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
