module.exports = {
    title: "Clash Bot Helpful Commands! :nerd_face:",
    color: 0x071A32,
    description: "Help is on the way! ***Clash Bot is restricted to answer from a channel with the name #league*** " +
        "Here are a few quick commands to get you started.\n" +
        "***Note***: Use !clash at the beginning of each of your commands to make use of this bot. " +
        "Any improvements to be suggested, please create an issue at the following location " +
        "[Clash Bot Issues](https://github.com/Poss111/clash-bot/issues). Please check the new site as well. This will " +
        "given you much more details on the Teams. https://clash-bot.ninja",
    fields: [
        {
            name: "Need a more verbose description of these commands.",
            value: "Go [>HERE<](https://github.com/Poss111/clash-bot#readme)."
        },
        {
            name: "champions - !clash champions > !clash champions Aatrox",
            value: "Will display quick information on a specific or multiple champions."
        },
        {
            name: "dance - !clash dance",
            value: "It is a secret."
        },
        {
            name: "help - !clash help",
            value: "Asks the bot to print this menu for you :smiley:."
        },
        {
            name: "~~register~~ join - !clash join msi2021 1 Abra",
            value: "Asks the bot to assign you to an available Clash team based on the Tournament Name, Day and the Team name."
        },
        {
            name: "~~register~~ newTeam - !clash newTeam > !clash newTeam msi2021 1",
            value: "Asks the bot to create a new Team for you based on the tournament provided. " +
                "You will only be able to join a new Team for the specified tournament if you are not " +
                "on a Team by yourself for that Tournament."
        },
        {
            name: "ping - !clash ping",
            value: "Asks the bot to pong you."
        },
        {
            name: "subscribe - !clash subscribe",
            value: "Subscribes the user notification of an upcoming League of Legends Clash Tournament. " +
                "This notification will be sent on the Monday before a Tournament weekend."
        },
        {
            name: "suggestChampion - !clash suggestChampion Volibear",
            value: "Adds a LoL Champion to user preferred champions list. This will display so you can better coordinate with your Clash teams."
        },
        {
            name: "teams - !clash teams",
            value: "Asks the bot to print a list of Teams for the upcoming clash tournaments."
        },
        {
            name: "tentative - !clash tentative msi2021 1",
            value: "Asks the bot to place your name on the tentative queue for a tournament, if you are already belong " +
                "in the queue, you will be removed from it. You will be removed from a team if you have been assigned " +
                "one. ***Note***: This queue is NOW maintained so you will NOT be removed from the queue upon update of " +
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
        },
        {
            name: "unsubscribe - !clash unsubscribe",
            value: "Unsubscribes the user from the notification of an upcoming League of Legends Clash Tournament."
        }
    ],
    footer: {
        text: "Made by Daniel Poss (aka Roïdräge) - https://github.com/Poss111\n" +
            "Clash-Bot is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or " +
            "anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games " +
            "are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc."
    }
}
