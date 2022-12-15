require('dotenv').config();
const Discord = require('discord.js');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const botCommands = require('../commands');
const helpMenu = require('../templates/help-menu');
const updateNotification = require('../templates/update-notification');
const templateBuilder = require('./template-builder');
// const ClashBotRestClient = require('clash-bot-rest-client');
const logger = require('../utility/logger');
// const {client} = require('../utility/rest-api-utilities');
let channel = 'league';
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

        bot.on('ready', () => readyHandler(bot, channel, process.env.SHOW_RELEASE_MESSAGE));

        bot.on('guildCreate', (guild) => guildCreateHandler(guild));

        bot.login(process.env.TOKEN).then(() => {

            Object.keys(botCommands).map(key => {
                bot.commands.set(botCommands[key].name, botCommands[key]);
            });

            bot.on('messageCreate', (msg) => messageHandler(msg));

            bot.on('interactionCreate', (interaction) => interactionHandler(interaction, bot));

            resolve(bot);
        });
    }).catch(err => new Error(`Failed to initialize Clash-Bot to Error ('${err}')`));
};

let messageHandler = async (msg) => {
    try {
        if (msg.channel)
        msg.channel.send('Living in the past I see. Try out our new slash commands! Just type /teams');
    } catch(error) {
        logger.error(
          { message: error.message, stack: error.stack },
          'Failed to execute command messageHandler due to error.'
        );
    }
};

let interactionHandler = async (interaction) => {
    const loggerContext = {
        command: 'interactionHandler',
        user: interaction.user ? interaction.user.id : 0,
        username: interaction.user ? interaction.user.username : '',
        server: interaction.member ? interaction.member.guild.name : {}
    };
    if (interaction.isCommand()) {
        try {
            await interaction.reply('Clash Bot is shutting down! :( It has been a great run with you all! '
              + 'If you would like to see Clash Bot again please feel free to '
              + 'donate any amount to this [Paypal](https://www.paypal.com/paypalme/poss11111).');
        } catch (error) {
            logger.error({ ...loggerContext, message: error.message, stack: error.stack }, 'Failed to send error message due to error.', error);
        }
    }
};

let guildCreateHandler = (guild) => {
    try {
    let channel = guild.channels.cache.find((key) => key.name === 'general');
    if (channel) {
        channel.send({embeds: [JSON.parse(JSON.stringify(helpMenu))]})
            .then(() => {
                logger.info(`Successfully sent message to new guild ('${guild.name}')`);
            })
            .catch((error) => {
                logger
                  .error({ message: error.message, stack: error.stack }, `Failed to send create message to new guild ('${guild.name}') due to error.`);
            });
    }
    } catch(error) {
        logger.error({ message: error.message, stack: error.stack }, `Failed to retrieve general channel from new guild ('${guild.name}').`);
    }
};

let readyHandler = (discordBot, restrictedChannel, showRelease) => {
    logger.info(`Logged in as ${discordBot.user.tag}!`);
    if (showRelease) {
        let updateMessage = templateBuilder.buildMessage(
            JSON.parse(JSON.stringify(updateNotification)), {releaseTitle: process.env.DISCORD_BOT_RELEASE_TITLE});
        discordBot.guilds.cache.forEach((guildKey) => {
            const filter = guildKey.channels.cache.find((key) => key.name === restrictedChannel);
            if (filter) {
                logger.info(`Sending Bot update message to ('${guildKey}')...`);
                try {
                    filter.send({
                        embeds: [updateMessage]
                    });
                } catch (error) {
                    logger.error({ message: error.message, stack: error.stack }, 'Failed to send update notification due to error.');
                }
                logger.info(`Successfully sent Bot update message to ('${guildKey}')...`);
            }
        });
    }
    logger.info(
      { type: 'metric' },
      `Total # of guilds using Bot ('${ discordBot.guilds.cache.size}')`
    );
};

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
           logger.info(obj.name);
       }
    });

    logger.info('Updating bot commands...');
    let rest = new REST({version: '9'}).setToken(process.env.TOKEN);

    try {
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            {body: commands}
        );
    } catch (err) {
        logger.error(err);
        throw new Error(err);
    }
    logger.info('Successfully updated bot commands.');
};

module.exports.client = bot;
module.exports.initializeBot = initializeBot;
module.exports.messageHandler = messageHandler;
module.exports.interactionHandler = interactionHandler;
module.exports.guildCreateHandler = guildCreateHandler;
module.exports.readyHandler = readyHandler;
