const ClashBotRestClient = require("clash-bot-rest-client");
const riotApi = require('@fightmegg/riot-api');
const timeTracker = require('../utility/time-tracker');
const errorHandler = require('../utility/error-handling');
const logger = require('../utility/logger');

module.exports = {
    name: 'suggest-champion',
    description: 'Adds or removes a champion to the players preferred Champions list.',
    options: [
        {
            type: 3,
            name: "champion-name",
            description: "i.e. Anivia, Aatrox, Volibear, etc...",
            required: true
        }
    ],
    async execute(msg, args) {
        const loggerContext = {
            command: this.name,
            user: msg.user.id,
            username: msg.user.username,
            server: msg.member ? msg.member.guild.name : {}
        };
        const startTime = process.hrtime.bigint();
        try {
            if (Array.isArray(args) && args.length < 1) {
                msg.reply('no champion name was passed. Please pass one.');
            } else {
                await msg.deferReply();
                let ddragon = new riotApi.DDragon();
                let championData = await ddragon.champion.all();
                let lowerCasedArg = args[0].toLowerCase();
                logger.info(loggerContext, `Trying to suggest Champion ('${args[0]}')...`);
                if (Object.keys(championData.data)
                  .find(record => record.toLowerCase() === lowerCasedArg)) {
                    const userApi = new ClashBotRestClient
                      .UserApi(new ClashBotRestClient.ApiClient('http://localhost:8080/api/v2'));
                    const listOfChampions = await userApi.retrieveListOfUserPreferredChampions(msg.user.id);
                    logger.info(loggerContext, `Current list of Champions ('${listOfChampions}')...`);
                    let response;
                    if (listOfChampions.includes(args[0].toLowerCase())) {
                        response = await userApi.removeFromListOfPreferredChampions(
                          msg.user.id,
                          lowerCasedArg,
                        );
                    } else {
                        response = await userApi.addToListOfPreferredChampions(
                          msg.user.id,
                          {
                              addToListOfPreferredChampionsRequest:
                                new ClashBotRestClient.AddToListOfPreferredChampionsRequest(lowerCasedArg)
                          },
                        );
                    }
                    await msg.editReply(
                      `Successfully updated your preferred champions list, here are your current Champions: '${response}'`);
                } else {
                    await msg.editReply(`Champion name passed does not exist. Please validate with /champions ${args[0]}`);
                }
            }
        } catch (err) {
            if (err.status === 400) {
                logger.error({ ...loggerContext, err });
                await msg.editReply('Sorry! You cannot have more than 5 champions in your list. ' +
                  'Please remove by passing a champion in your list and then try adding again. Thank you!');
            } else {
                await errorHandler.handleError(this.name, err, msg, 'Failed to update the Users preferred Champions list.');
            }
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
