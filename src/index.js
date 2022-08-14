const loadBot = require('./utility/load-bot');
const logger = require('pino')();
const express = require('express');
const cors = require('cors');
const app = express();

loadBot.initializeBot()
    .then(() => logger.info('Successfully loaded services and bot.'))
    .catch(err => {
        logger.error('Failed to load services and bot due to error.', err);
        process.exit(1);
    });

app.use(express.json());
app.use(cors());

app.get(`/health`, (req, res) => {
    res.json({
        status: 'Healthy'
    });
})

app.listen(8082, () => {
    logger.info(`Clash Bot Service up and running on Port ('8082')!`);
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
