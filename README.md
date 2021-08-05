# Clash Bot
[![CI](https://github.com/Poss111/clash-bot/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/Poss111/clash-bot/actions/workflows/build.yml)

## Prefix: !clash
## Channel: #league

`Note: A channel with the name of #league must be created for the bot to register your commands. This helps contain the messages from the bot.`
# Bot Commands
| Command |  Sample | Description |
| -------- | ----------- | -------------- |
| champions | ```!clash champions Aatrox``` | Will display quick information on a specific or multiple champions. |
| dance | ```!clash dance``` | It is a secret. |
| help | ```!clash help``` | Asks the bot to print this menu for you. |
| join | ```!clash join msi2021 1 Pikachu``` | Asks the bot to register a player with a given Team based on the Tournament Name, Day and the Team Name. |
| ping | ```!clash pong``` | Asks the bot to pong you. |
| (deprecated) register | ```!clash register msi2021 1``` | Use newTeam. |
| newTeam | ```!clash newTeam msi2021 1``` | Asks the bot to create a new Team for you based on the tournament provided. |
| subscribe | ```!clash subscribe``` | Subscribes the user notification of an upcoming League of Legends Clash Tournament. This notification will be sent on the Monday before a Tournament weekend. | 
| suggestChampion | ```!clash suggestChampion``` | Adds a LoL Champion to user preferred champions list. This will display so you can better coordinate with your Clash teams. | 
| teams | ```!clash teams``` | Asks the bot to print a list of Teams for the upcoming clash. |
| tentative | ```!clash tentative``` | Asks the bot to place your name on the tentative queue for a tournament, if you are already belong in the queue, you will be removed from it. You will be removed from a team if you have been assigned one. ***Note***: This queue is not maintain so you will be removed from the queue upon update of the bot. |
| time | ```!clash time``` | Asks the bot to print out the times for the clash from the Riot API and the list of tournaments to be used. |
| unregister | ```!clash unregister msi2021 1``` | Asks the bot to remove you from the assigned Clash team therefore freeing a spot for others on a tournament and a tournament day. |
| unsubscribe | ```!clash unsubscribe``` | Subscribes the user notification of an upcoming League of Legends Clash Tournament. This notification will be sent on the Monday before a Tournament weekend. | 

### Note
-----------
- You can use the join, unregister, newTeam command with partial input
    - For example: `!clash join msi2021 1 pikachu` -> `!clash join m 1 p`

- Subscribe functionality has requirement of you to allow direct messages from people who belong to servers that you have joined. 
    - Tip: You can find this setting in discord under User Settings > Privacy & Safety > Server Privacy Defaults > Allow direct messages from server members.  

HOWEVER, make sure you match as many characters as you can otherwise you will join an unexpected Team/Tournament.

Please use the Issues tab to provide improvements!
