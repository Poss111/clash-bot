require('dotenv').config();
const Discord = require('discord.js');
const botCommands = require('../commands');
const helpMenu = require('../templates/help-menu');
const updateNotification = require('../templates/update-notification');
const userServiceImpl = require('../services/user-service-impl');
let channel = 'league';
const COMMAND_PREFIX = '!clash';
let bot = undefined;

let initializeBot = () => {
    return new Promise((resolve) => {
        bot = new Discord.Client();
        bot.commands = new Discord.Collection();

        if (process.env.INTEGRATION_TEST) {
            channel = 'league-integration';
        } else if (process.env.LOCAL) {
            channel = 'league-test';
        }

        bot.on('ready', () => {
            readyHandler(bot, channel, process.env.INTEGRATION_TEST);
        });

        bot.on('guildCreate', (guild) => guildCreateHandler(guild));

        bot.login(process.env.TOKEN).then(() => {

            Object.keys(botCommands).map(key => {
                bot.commands.set(botCommands[key].name, botCommands[key]);
            });

            bot.on('message', (msg) => messageHandler(msg, channel, COMMAND_PREFIX, bot));
            resolve(bot);
        });
    }).catch(err => reject(`Failed to initialize Clash-Bot to Error ('${err}')`));
}

let messageHandler = async (msg, restrictedChannel, commandPrefix, discordBot) => {
    if (msg.channel.name === restrictedChannel && msg.content.startsWith(commandPrefix)) {
        msg.content = msg.content.replace(commandPrefix + ' ', '');
        const args = msg.content.split(/ +/);
        const command = args.shift();

        if (!discordBot.commands.has(command)) return;

        try {
            console.info(`('${msg.author.username}') called command: ('${command}')`);
            msg.reply('Season 11 is quickly coming to a close. Clash Bot will have limited usage. There will be no Tournaments available. Please check back next year!');
            await userServiceImpl.postVerifyUser(msg.author.id, msg.author.username, msg.guild.name)
            await discordBot.commands.get(command).execute(msg, args);
        } catch (error) {
            console.error(`Failed to execute command ('${discordBot.commands.get(command).name}') due to error.`, error);
            msg.channel.send('there was an error trying to execute that command! Please reach out to <@299370234228506627>.');
        }
    }
}

let guildCreateHandler = (guild) => {
    let channel = guild.channels.cache.find((key) => key.name === 'general');
    channel.send({embed: JSON.parse(JSON.stringify(helpMenu))});
}

let readyHandler = (discordBot, restrictedChannel, isIntegrationTesting) => {
    console.info(`Logged in as ${discordBot.user.tag}!`);
    if (!isIntegrationTesting) {
        discordBot.guilds.cache.forEach((guildKey) => {
            const filter = guildKey.channels.cache.find((key) => key.name === restrictedChannel);
            if (filter) {
                console.log(`Sending Bot update message to ('${guildKey}')...`);
                try {
                    filter.send({embed: JSON.parse(JSON.stringify(updateNotification))});
                } catch (err) {
                    console.error('Failed to send update notification due to error.', err);
                }
                console.log(`Successfully sent Bot update message to ('${guildKey}')...`);
            }

        });
    }
}

module.exports.client = bot;
module.exports.initializeBot = initializeBot;
module.exports.messageHandler = messageHandler;
module.exports.guildCreateHandler = guildCreateHandler;
module.exports.readyHandler = readyHandler;
