class ErrorHandling {
    async handleError(command, error, msg, userMessage) {
        console.error(error);
        console.error(`${command} => ${error}`);
        await msg.editReply(`${userMessage}. Please reach out to <@299370234228506627>.`);
    }
}
module.exports = new ErrorHandling;
