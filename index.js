require('dotenv').config();
const database = require('./dao/dynamo-db-impl');
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');
const leagueApi = require('./utility/LeagueApi');
const TOKEN = process.env.TOKEN;
const mainChannel = 'league';
const botCommand = '!clash';

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
});

bot.login(TOKEN).then(database.initializeClashBotDB()
    .then(data => console.log(data))
    .catch(err => console.error('DynamoDb initialization failed ', err)))
.then(r => {
    bot.on('ready', () => {
        console.info(`Logged in as ${bot.user.tag}!`);
    });

    bot.on('message', msg => {
        if (msg.channel.name === mainChannel && msg.content.startsWith(botCommand)) {
            msg.content = msg.content.replace(botCommand + ' ', '');
            const args = msg.content.split(/ +/);
            const command = args.shift().toLowerCase();
            console.info(`Called command: ${command}`);

            if (!bot.commands.has(command)) return;

            try {
                bot.commands.get(command).execute(msg, args);
            } catch (error) {
                console.error(error);
                msg.channel.send('there was an error trying to execute that command! Please reach out to <@299370234228506627>.');
            }
        }
    })
}).catch(err => console.error('Failed to connect discord bot due to and error.', err));


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
