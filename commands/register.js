const timeTracker = require('../utility/time-tracker');

module.exports = {
    name: 'register',
    description: '(Deprecated) Used to register the user to an available Clash team.',
    execute: async function (msg) {
        const startTime = process.hrtime.bigint();
        try {
            msg.reply('Register is going to be removed. ***newTeam*** and ***join*** are now the go to commands. Please use !clash help if you would like to view their usage.');
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
