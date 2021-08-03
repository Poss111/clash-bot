const loadBot = require('./utility/load-bot');

loadBot.initializeBot()
    .then(() => console.log('Successfully loaded services and bot.'))
    .catch(err => {
        console.error('Failed to load services and bot due to error.', err);
        process.exit(1);
    });

process.on('beforeExit', () => {
    console.log('Process terminated');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Process closed');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Process interrupted');
    process.exit(0);
});
