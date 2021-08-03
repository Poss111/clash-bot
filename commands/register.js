const timeTracker = require('../utility/time-tracker');

module.exports = {
    name: 'register',
    description: '(Deprecated) Used to register the user to an available Clash team.',
    execute: async function (msg) {
        const startTime = process.hrtime.bigint();
        try {
            msg.reply('Register is going to be removed. ***newTeam*** (If you want to create a brand new team) and ***join*** (If you want to join an existing one, the team must exist) are now the go to commands. Please use !clash help if you would like to view their usage.');
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
