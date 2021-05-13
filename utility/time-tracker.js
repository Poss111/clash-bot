class TimeTracker {
    endExecution(command, startTime) {
        const totalTimeInMilliseconds = (process.hrtime.bigint() - startTime)/1000000n;
        console.log(`Command ('${command}') => Total time ${totalTimeInMilliseconds}ms`)
        return totalTimeInMilliseconds;
    }
}
module.exports = new TimeTracker;
