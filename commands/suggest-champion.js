const timeTracker = require('../utility/time-tracker');
const userServiceImpl = require('../services/user-service-impl');
const errorHandler = require('../utility/error-handling');
const riotApi = require('@fightmegg/riot-api');
module.exports = {
    name: 'suggest-champion',
    description: 'Adds or removes a champion to the players preferred Champions list.',
    async execute(msg, args) {
        const startTime = process.hrtime.bigint();
            if (Array.isArray(args) && args.length < 1) {
                msg.reply('no champion name was passed. Please pass one.');
            } else {
                try {
                    let ddragon = new riotApi.DDragon();
                    let championData = await ddragon.champion.all();
                    if (Object.keys(championData.data).find(record => record === args[0])) {
                        let userDetails = await userServiceImpl.getUserDetails(msg.author.id);
                        if (!Array.isArray(userDetails.preferredChampions)) {
                            userDetails.preferredChampions = [args[0]];
                        } else {
                            userDetails.preferredChampions.push(args[0]);
                        }
                        let updatedUserDetails = await userServiceImpl.postUserDetails(msg.author.id, msg.author.username, userDetails.serverName, userDetails.preferredChampions, userDetails.subscriptions);
                        msg.reply(`Successfully updated your preferred champions list, here are your current Champions: '${updatedUserDetails.preferredChampions}'`);
                    } else {
                        msg.reply(`Champion name passed does not exist. Please validate with !clash champions ${args[0]}`);
                    }
                } catch (err) {
                    errorHandler.handleError(this.name, err, msg, 'Failed to update the Users preferred Champions list.');
                } finally {
                    timeTracker.endExecution(this.name, startTime);
                }
            }
    },
};
