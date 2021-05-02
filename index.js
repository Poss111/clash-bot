require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');
const leagueApi = require('./utility/LeagueApi');
const TOKEN = process.env.TOKEN;

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
});

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    if (msg.channel.name === 'league' && msg.content.startsWith('!clash')) {
        msg.content = msg.content.replace('!clash ', '');
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
});
