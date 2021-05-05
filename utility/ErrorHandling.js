class ErrorHandling {
    handleError(command, error, msg, userMessage) {
        console.error(`${command} => ${error}`);
        msg.reply(`${userMessage}. Please reach out to <@299370234228506627>.`);
    }
}
module.exports = new ErrorHandling;
