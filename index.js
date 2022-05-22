const loadBot = require('./utility/load-bot');
const logger = require('pino')();

loadBot.initializeBot()
    .then(() => logger.info('Successfully loaded services and bot.'))
    .catch(err => {
        logger.error('Failed to load services and bot due to error.', err);
        process.exit(1);
    });

process.on('beforeExit', () => {
    logger.info('Process terminated');
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.info('Process closed');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('Process interrupted');
    process.exit(0);
});
