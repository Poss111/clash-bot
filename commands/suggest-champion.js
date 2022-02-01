const timeTracker = require('../utility/time-tracker');
const userServiceImpl = require('../services/user-service-impl');
const errorHandler = require('../utility/error-handling');
const riotApi = require('@fightmegg/riot-api');
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
        const startTime = process.hrtime.bigint();
        try {
            if (Array.isArray(args) && args.length < 1) {
                msg.reply('no champion name was passed. Please pass one.');
            } else {
                await msg.deferReply();
                let ddragon = new riotApi.DDragon();
                let championData = await ddragon.champion.all();
                if (Object.keys(championData.data).find(record => record === args[0])) {
                    let userDetails = await userServiceImpl.getUserDetails(msg.user.id);
                    if (!Array.isArray(userDetails.preferredChampions)
                        || userDetails.preferredChampions.length <= 4) {
                        if (!userDetails.preferredChampions) {
                            userDetails.preferredChampions = [args[0]]
                        } else if (userDetails.preferredChampions.includes(args[0])) {
                            userDetails.preferredChampions =
                                userDetails.preferredChampions.filter(record => record != args[0]);
                        } else {
                            userDetails.preferredChampions.push(args[0]) ;
                        }
                        let updatedUserDetails = await userServiceImpl.postUserDetails(msg.user.id, msg.user.username,
                            userDetails.serverName, userDetails.preferredChampions, userDetails.subscriptions);
                        await msg.editReply(`Successfully updated your preferred champions list, here are your current Champions: '${updatedUserDetails.preferredChampions}'`);
                    } else {
                        await msg.editReply('Sorry! You cannot have more than 5 champions in your list. ' +
                            'Please remove by passing a champion in your list and then try adding again. Thank you!')
                    }
                } else {
                    await msg.editReply(`Champion name passed does not exist. Please validate with /champions ${args[0]}`);
                }
            }
        } catch (err) {
            await errorHandler.handleError(this.name, err, msg, 'Failed to update the Users preferred Champions list.');
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
