module.exports = {
    title: "Clash Bot Helpful Commands! :nerd_face:",
    color: 0x071A32,
    description: "Help is on the way! Here are a few quick commands to get you started.\n" +
        "***Note***: Use !clash at the beginning of each of your commands to make use of this bot. " +
        "Any improvements to be suggested, please create an issue at the following location " +
        "[Clash Bot Issues](https://github.com/Poss111/clash-bot/issues)",
    fields: [
        {
            name: "Need a more verbose description of these commands.",
            value: "Go [>HERE<](https://github.com/Poss111/clash-bot#readme)."
        },
        {
            name: "dance !clash dance",
            value: "It is a secret."
        },
        {
            name: "help !clash help",
            value: "Asks the bot to print this menu for you :smiley:."
        },
        {
            name: "join - !clash join msi2021 Abra",
            value: "Asks the bot to assign you to an available Clash team based on the Tournament name and the Team name."
        },
        {
            name: "ping",
            value: "Asks the bot to pong you."
        },
        {
            name: "register - !clash register > !clash register msi2021 1 > !clash register newTeam",
            value: "Asks the bot to assign you to an available Clash team based on a tournament and a tournament day. " +
                "Can create a new team by passing newTeam."
        },
        {
            name: "teams - !clash teams",
            value: "Asks the bot to print a list of Teams for the upcoming clash tournaments."
        },
        {
            name: "tentative - !clash tentative msi2021",
            value: "Asks the bot to place your name on the tentative queue for a tournament, if you are already belong " +
                "in the queue, you will be removed from it. You will be removed from a team if you have been assigned " +
                "one. ***Note***: This queue is not maintained so you will be removed from the queue upon update of " +
                "the bot."
        },
        {
            name: "time - !clash time",
            value: "Prints out the times for the clash from the Riot API and the list of tournaments to be used."
        },
        {
            name: "unregister - !clash unregister msi2021 1",
            value: "Asks the bot to remove you from the assigned Clash team therefore freeing a spot for others on a " +
                "tournament and a tournament day."
        }
    ],
    footer: {
        text: "Made by Daniel Poss (aka Roïdräge) - https://github.com/Poss111\n" +
            "Clash-Bot is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or " +
            "anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games " +
            "are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc."
    }
}
