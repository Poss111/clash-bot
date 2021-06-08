module.exports = {
    title: "Clash Bot Helpful Commands! :D",
    color: 0x071A32,
    description: "Help is on the way! Here are a few quick commands to get you started.\n***Note***: Use !clash at the beginning of each of your commands to make use of this bot. i.e. !clash help\nAny improvements to be suggested, please create an issue at the following location [Clash Bot Issues](https://github.com/Poss111/clash-bot/issues)",
    fields: [
        {
            name: "ping",
            value: "Asks the bot to pong you."
        },
        {
            name: "help",
            value: "Asks the bot to print this menu for you :D."
        },
        {
            name: "register",
            value: "Asks the bot to assign you to an available Clash team based on a tournament and a tournament day.  i.e. !clash register msi2021 or !clash register msi2021 1"
        },
        {
            name: "unregister",
            value: "Asks the bot to remove you from the assigned Clash team therefore freeing a spot for others on a tournament and a tournament day.  i.e. !clash unregister msi2021 1"
        },
        {
            name: "teams",
            value: "Asks the bot to print a list of Teams for the upcoming clash tournaments."
        },
        {
            name: "tentative",
            value: "Asks the bot to place your name on the tentative queue for a tournament, if you are already belong in the queue, you will be removed from it. You will be removed from a team if you have been assigned one. ***Note***: This queue is not maintain so you will be removed from the queue upon update of the bot."
        },
        {
            name: "time",
            value: "Prints out the times for the clash from the Riot API and the list of tournaments to be used."
        },
        {
            name: "dance",
            value: "It is a secret."
        }
    ],
    footer: {
        text: "Made by Daniel Poss (aka Roïdräge) - https://github.com/Poss111"
    }
}
