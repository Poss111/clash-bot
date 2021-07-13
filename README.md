# Clash Bot
[![CI](https://github.com/Poss111/clash-bot/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/Poss111/clash-bot/actions/workflows/build.yml)

## Prefix: !clash
## Channel: #league

`Note: A channel with the name of #league must be created for the bot to register your commands. This helps contain the messages from the bot.`
# Bot Commands
| Command |  Sample | Description |
| -------- | ----------- | -------------- |
| ping | ```!clash pong``` | Asks the bot to pong you. |
| help | ```!clash help``` | Asks the bot to print this menu for you. |
| join | ```!clash join msi2021 Pikachu``` | Asks the bot to register a player with a given Team based on the Tournament and the Team Name. |
| register | ```!clash register msi2021 1``` | Asks the bot to assign you to an available Clash team based on a tournament and a tournament day. |
| unregister | ```!clash unregister msi2021 1``` | Asks the bot to remove you from the assigned Clash team therefore freeing a spot for others on a tournament and a tournament day. |
| teams | ```!clash teams``` | Asks the bot to print a list of Teams for the upcoming clash. |
| tentative | ```!clash tentative``` | Asks the bot to place your name on the tentative queue for a tournament, if you are already belong in the queue, you will be removed from it. You will be removed from a team if you have been assigned one. ***Note***: This queue is not maintain so you will be removed from the queue upon update of the bot. |
| time | ```!clash time``` | Asks the bot to print out the times for the clash from the Riot API and the list of tournaments to be used. |
| dance | ```!clash dance``` | It is a secret. |

### Note
-----------
You can use the join, register, unregister command with partial input
For example: `!clash join msi2021 pikachu` -> `!clash join m p`
Or: `!clash register msi2021 1` -> `!clash register m 1`

HOWEVER, make sure you match as many characters as you can otherwise you will join an unexpected Team/Tournament.

Please use the Issues tab to provide improvements!
