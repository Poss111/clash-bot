const logger = require('pino')();

class TimeTracker {
    endExecution(command, startTime) {
        const totalTimeInMilliseconds = (process.hrtime.bigint() - startTime)/1000000n;
        logger.info({ command, executionTime: totalTimeInMilliseconds });
        return totalTimeInMilliseconds;
    }
}
module.exports = new TimeTracker;
