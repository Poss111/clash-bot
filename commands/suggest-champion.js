const timeTracker = require('../utility/time-tracker');
const clashSubscriptionDb = require('../dao/clash-subscription-db-impl');
const errorHandler = require('../utility/error-handling');
const riotApi = require('@fightmegg/riot-api');
module.exports = {
    name: 'suggestChampion',
    description: 'Adds or removes a champion to the players preferred Champions list.',
    async execute(msg, args) {
        const startTime = process.hrtime.bigint();
        try {
            if (Array.isArray(args) && args.length < 1) {
                msg.reply('no champion name was passed. Please pass one.');
            } else {
                let ddragon = new riotApi.DDragon();
                let championData = await ddragon.champion.all();
                if (Object.keys(championData.data).find(record => record === args[0])) {
                    await clashSubscriptionDb.updatePreferredChampions(msg.author.id, args[0], msg.guild.name).then(results => {
                        msg.reply(`Successfully updated your preferred champions list, here are your current Champions: '${results.preferredChampions}'`);
                    }).catch(err =>
                        errorHandler.handleError(this.name, err, msg,
                            'Failed to update the Users preferred Champions list.'));
                } else {
                    msg.reply(`Champion name passed does not exist. Please validate with !clash champions ${args[0]}`);
                }
            }
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
