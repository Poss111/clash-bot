require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');
const clashTimesDbImpl = require('./dao/clash-time-db-impl');
const clashSubscriptionDbImpl = require('./dao/clash-subscription-db-impl');
const database = require('./dao/clash-teams-db-impl');
const helpMenu = require('./templates/help-menu');
const TOKEN = process.env.TOKEN;
const runningIntegrationTests = process.env.INTEGRATION_TEST;
let channel = 'league';
const COMMAND_PREFIX = '!clash';

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
});

if (process.env.LOCAL) {
    channel = 'league-test';
}

if (!runningIntegrationTests) {
    bot.on('ready', () => {
        console.info(`Logged in as ${bot.user.tag}!`);
        try {
            bot.guilds.cache.forEach((key) => {
                const filter = key.channels.cache.find((key) => key.name === channel);
                console.log(`Sending Bot update message to ('${key}')...`);
                filter.send({
                    embed: {
                        title: "Clash-Bot has been updated :partying_face:!",
                        url: "https://github.com/Poss111/clash-bot/releases",
                        description: "Please check the Releases page for new updates and bug fixes :smile:. Donations are always welcome [Paypal](https://www.paypal.com/paypalme/poss11111), it takes :moneybag: to keep a bot alive these days.",
                        image: {
                            url: "https://repository-images.githubusercontent.com/363187357/577557c6-50c4-422c-adbf-8a06281c14e9"
                        },
                        color: 71
                    }
                });
                console.log(`Successfully sent Bot update message to ('${key}')...`);
            });
        } catch (err) {
            console.error('Failed to send update notification due to error.', err);
        }
    });
}

bot.on('guildCreate', (guild) => {
    let channel = guild.channels.cache.find((key) => key.name === 'general');
    let copy = JSON.parse(JSON.stringify(helpMenu));
    channel.send({embed: copy});
});

let initializeBot = () => {
    Promise.all([clashTimesDbImpl.initialize(),
        clashSubscriptionDbImpl.initialize(),
        database.initialize()])
        .then(() => {
            bot.login(TOKEN).then(() => {
                bot.on('message', msg => {
                    if (msg.channel.name === channel && msg.content.startsWith(COMMAND_PREFIX)) {
                        msg.content = msg.content.replace(COMMAND_PREFIX + ' ', '');
                        const args = msg.content.split(/ +/);
                        const command = args.shift();

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
}

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

if (!runningIntegrationTests) {
    initializeBot();
}

module.exports.client = bot;
module.exports.initializeBot = initializeBot;
