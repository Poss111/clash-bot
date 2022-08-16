const logger = require('../utility/logger');

class ErrorHandling {
    async handleError(command, error, msg, userMessage, loggerContext) {
        if (error.status) {
            logger.error({ ...loggerContext,
                error: { status: error.status, body: error.body, response: error.response }
            });
        } else {
            logger.error({ ...loggerContext, error: { message: error.message, stack: error.stack } });
        }
        await msg.editReply(`${userMessage}. Please reach out to <@299370234228506627>.`);
    }
}
module.exports = new ErrorHandling;
