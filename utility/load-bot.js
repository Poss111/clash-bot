require('dotenv').config();
const Discord = require('discord.js');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const botCommands = require('../commands');
const helpMenu = require('../templates/help-menu');
const updateNotification = require('../templates/update-notification');
const userServiceImpl = require('../services/user-service-impl');
let channel = 'league';
const COMMAND_PREFIX = '!clash';
let bot = undefined;

let initializeBot = () => {
    return new Promise((resolve) => {
        setupCommands();
        bot = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });
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

            bot.on('interactionCreate', (interaction) => interactionHandler(interaction, bot));

            resolve(bot);
        });
    }).catch(err => new Error(`Failed to initialize Clash-Bot to Error ('${err}')`));
}

let messageHandler = async (msg, restrictedChannel, commandPrefix, discordBot) => {
    if (msg.channel.name === restrictedChannel && msg.content.startsWith(commandPrefix)) {
        msg.content = msg.content.replace(commandPrefix + ' ', '');
        const args = msg.content.split(/ +/);
        const command = args.shift();

        if (!discordBot.commands.has(command)) return;

        try {
            console.info(`('${msg.author.username}') called command: ('${command}')`);
            await userServiceImpl.postVerifyUser(msg.author.id, msg.author.username, msg.guild.name)
            await discordBot.commands.get(command).execute(msg, args);
        } catch (error) {
            console.error(`Failed to execute command ('${discordBot.commands.get(command).name}') due to error.`, error);
            msg.channel.send('there was an error trying to execute that command! Please reach out to <@299370234228506627>.');
        }
    }
}

let interactionHandler = async (interaction, bot) => {
    if (interaction.isCommand()) {
        let args = [];
        if (interaction.options.data) {
         args = interaction.options.data.map(data => data.value);
        }

        if (!bot.commands.has(interaction.commandName)) return;

        try {
            console.info(`('${interaction.user.username}') called command: ('${interaction.commandName}')`);
            await userServiceImpl.postVerifyUser(interaction.user.id,
                interaction.user.username, interaction.member.guild.name);
            await bot.commands.get(interaction.commandName).execute(interaction, args);
        } catch (error) {
            console.error(`Failed to execute command ('${bot.commands.get(interaction.commandName).name}') due to error.`, error);
            interaction.reply('there was an error trying to execute ' +
                'that command! Please reach out to <@299370234228506627>.');
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
                    filter.send({
                        embeds: [JSON.parse(JSON.stringify(updateNotification))]
                    });
                } catch (err) {
                    console.error('Failed to send update notification due to error.', err);
                }
                console.log(`Successfully sent Bot update message to ('${guildKey}')...`);
            }

        });
    }
}

let setupCommands = async () => {
    let commands = Object.keys(botCommands).map(key => {
        let payload = {name: botCommands[key].name, description: botCommands[key].description};
        if (botCommands[key].options) {
            payload.options = botCommands[key].options;
        }
        return payload;
    });

    commands.forEach(obj => {
       if(obj.description.length > 100) {
           console.log(obj.name);
       }
    });

    console.log('Updating bot commands...');
    let rest = new REST({version: '9'}).setToken(process.env.TOKEN);

    try {
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            {body: commands}
        );
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
    console.log('Successfully updated bot commands.');
}

module.exports.client = bot;
module.exports.initializeBot = initializeBot;
module.exports.messageHandler = messageHandler;
module.exports.guildCreateHandler = guildCreateHandler;
module.exports.readyHandler = readyHandler;
