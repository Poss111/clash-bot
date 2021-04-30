require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');
const TOKEN = process.env.TOKEN;

Object.keys(botCommands).map(key => {
    console.log(`Key ${key}`);
    bot.commands.set(botCommands[key].name, botCommands[key]);
});

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    if(msg.channel.name === 'league' && msg.content.startsWith('!clash')) {
        msg.content = msg.content.replace('!clash ', '');
        const args = msg.content.split(/ +/);
        const command = args.shift().toLowerCase();
        console.info(`Called command: ${command}`);

        if (!bot.commands.has(command)) return;

        try {
                bot.commands.get(command).execute(msg, args);
        } catch (error) {
            console.error(error);
            msg.reply('there was an error trying to execute that command!');
        }

    }
});


// bot.on('message', msg => {
//     if (msg.channel.name === 'league' && msg.content === 'clash help') {
//         msg.channel.send(helpMenu);
//     }
//     if (msg.channel.name === 'league' && msg.content === 'clash signup') {
//         console.info(`Ping received from channel ('${msg.channel.id}') by ('${msg.author.username}')`)
//         msg.reply('Signing you up for the Clash team. --- This bot is a work in progress. If you notice any issues reach out to @Roïdräge');
//     }
// });
