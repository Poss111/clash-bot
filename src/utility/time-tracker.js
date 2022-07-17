const logger = require('pino')();

class TimeTracker {
    endExecution(command, startTime) {
        const totalTimeInMilliseconds = (process.hrtime.bigint() - startTime)/1000000n;
        logger.info(`Command ('${command}') => Total time ${totalTimeInMilliseconds}ms`)
        return totalTimeInMilliseconds;
    }
}
module.exports = new TimeTracker;
