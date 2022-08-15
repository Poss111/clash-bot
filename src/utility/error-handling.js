const logger = require('pino')();

class ErrorHandling {
    async handleError(command, error, msg, userMessage, loggerContext) {
        logger.error({ ...loggerContext, error: { message: error.message, stack: error.stack } });
        await msg.editReply(`${userMessage}. Please reach out to <@299370234228506627>.`);
    }
}
module.exports = new ErrorHandling;
