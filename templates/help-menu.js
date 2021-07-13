module.exports = {
    title: "Clash Bot Helpful Commands! :nerd_face:",
    color: 0x071A32,
    description: "Help is on the way! Here are a few quick commands to get you started.\n" +
        "***Note***: Use !clash at the beginning of each of your commands to make use of this bot. " +
        "\ni.e. !clash help\n" +
        "Any improvements to be suggested, please create an issue at the following location " +
        "[Clash Bot Issues](https://github.com/Poss111/clash-bot/issues)",
    fields: [
        {
            name: "dance",
            value: "It is a secret."
        },
        {
            name: "help",
            value: "Asks the bot to print this menu for you :smiley:."
        },
        {
            name: "join",
            value: "Asks the bot to assign you to an available Clash team based on the Tournament name and the Team name." +
                "\ni.e. !clash join msi2021 Abra\n" +
                "NOTE: You can pass partial words to use to search" +
                "\ni.e. !clash join msi ab would match the above example."
        },
        {
            name: "ping",
            value: "Asks the bot to pong you."
        },
        {
            name: "register",
            value: "Asks the bot to assign you to an available Clash team based on a tournament and a tournament day." +
                "\ni.e. !clash register msi2021 or !clash register msi2021 1 \n ***Update*** You can use the arguments " +
                "in any order now :smile:.\n" +
                "\n***Arguments***\n " +
                "NOTE: Just pass the value. \ni.e. ~~tournamentName~~ msi2021\n" +
                "- 'Key' (*Required*|*Optional*) > 'Example' - 'Description'\n" +
                "- tournamentName (*Optional*) > \ni.e. msi2021 " +
                "- The Tournament Name to register for. Check !clash time for the value to give. \n " +
                "- tournamentDay (*Optional*) > \ni.e. 1 - The day to register for. Given as a number. " +
                "Check !clash time for the value to give.\n " +
                "- newTeam (*Optional*) > i.e newTeam - Creates an entirely new team. If you are already registered " +
                "to a Team for the given tournament, it will create a new one, unless you are the only one on the given team. " +
                "We don't want you creating all the teams ;)."
        },
        {
            name: "teams",
            value: "Asks the bot to print a list of Teams for the upcoming clash tournaments."
        },
        {
            name: "tentative",
            value: "Asks the bot to place your name on the tentative queue for a tournament, if you are already belong " +
                "in the queue, you will be removed from it. You will be removed from a team if you have been assigned " +
                "one. ***Note***: This queue is not maintained so you will be removed from the queue upon update of " +
                "the bot.\n" +
                "\n***Arguments***\n " +
                "NOTE: Just pass the value. \ni.e. ~~tournamentName~~ msi2021\n" +
                "- 'Key' (*Required*|*Optional*) > 'Example' - 'Description'\n" +
                "- tournamentName (*Required*) > \ni.e. msi2021 " +
                "- The Tournament Name to be tentative for. Check !clash time for the value to give."
        },
        {
            name: "time",
            value: "Prints out the times for the clash from the Riot API and the list of tournaments to be used."
        },
        {
            name: "unregister",
            value: "Asks the bot to remove you from the assigned Clash team therefore freeing a spot for others on a " +
                "tournament and a tournament day.  \ni.e. !clash unregister msi2021 1\n" +
                "\n***Arguments***\n " +
                "NOTE: Just pass the value. \ni.e. ~~tournamentName~~ msi2021\n" +
                "- 'Key' (*Required*|*Optional*) > 'Example' - 'Description'\n" +
                "- tournamentName (*Required*) > \ni.e. msi2021 " +
                "- The Tournament Name to unregister for. Check !clash time for the value to give. \n " +
                "- tournamentDay (*Required*) > \ni.e. 1 - The day to unregister for. Given as a number. " +
                "Check !clash time for the value to give.\n "
        },
        {
            name: "Disclaimer",
            value: "Clash-Bot is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or " +
                "anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games " +
                "are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc. "
        }
    ],
    footer: {
        text: "Made by Daniel Poss (aka Roïdräge) - https://github.com/Poss111"
    }
}
