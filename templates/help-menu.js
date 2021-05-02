module.exports = {
    title: "Clash Bot Helpful Commands! :D",
    color: 0x071A32,
    description: "Help is on the way! Here are a few quick commands to get you started.\n***Note***: Use !clash at the beginning of each of your commands to make use of this bot. i.e. !clash help",
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
            value: "Asks the bot to assign you to an available Clash team."
        },
        {
            name: "unregister",
            value: "Asks the bot to remove you from the assigned Clash team therefore freeing a spot for others."
        },
        {
            name: "teams",
            value: "Asks the bot to print a list of Teams for the latest clash."
        },
        {
            name: "tentative",
            value: "Asks the bot to place your name on the tentative queue, if you are already belong in the queue, you will be removed from it. You will be removed from a team if you have been assigned one."
        },
        {
            name: "time",
            value: "Prints out the times for the clash from the Riot API."
        }
    ],
    footer: {
        text: "Made by Daniel Poss (aka Roïdräge) - https://github.com/Poss111"
    }
}
