require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');
const clashTimesDbImpl = require('./dao/clashtime-db-impl');
const database = require('./dao/dynamo-db-impl');
const TOKEN = process.env.TOKEN;

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
});

clashTimesDbImpl.initializeLeagueData().then(data => {
    clashTimesDbImpl.setLeagueTimes(data);
    database.initializeClashBotDB().then(data => {
        console.log(data);
        bot.login(TOKEN).then(() => {

            bot.on('ready', () => {
                console.info(`Logged in as ${bot.user.tag}!`);
            });

            bot.on('message', msg => {
                if (msg.channel.name === 'league' && msg.content.startsWith('!clash')) {
                    msg.content = msg.content.replace('!clash ', '');
                    const args = msg.content.split(/ +/);
                    const command = args.shift().toLowerCase();

                    if (!bot.commands.has(command)) return;

                    try {
                        console.info(`('${msg.author.username}') called command: ('${command}')`);
                        bot.commands.get(command).execute(msg, args);
                    } catch (error) {
                        console.error(error);
                        msg.channel.send('there was an error trying to execute that command! Please reach out to <@299370234228506627>.');
                    }
                }
            });
        });
    }).catch(err => {
        console.error(`Failed to initialize Clash-Bot DB to Error ('${err}')`);
        process.exit(1);
    });
}).catch(err => {
    console.error(`Failed to initialize Clash-Bot due to Error ('${err}')`);
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
