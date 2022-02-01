const timeTracker = require('../utility/time-tracker');
const championTemplate = require('../templates/champion-description');
const templateBuilder = require('../utility/template-builder');
const riotApi = require('@fightmegg/riot-api');

module.exports = {
    name: 'champions',
    description: 'Returns a description of the requested League of Legends Champions based on what the user requests.',
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
            const ddragon = new riotApi.DDragon();
            await msg.deferReply();
            let champions = await ddragon.champion.all();
            let championKeys = Object.keys(champions.data);
            if (Array.isArray(args) && args[0]) {
                console.log(`Filtering champion list for ('${args[0]}')`);
                championKeys = championKeys.filter(championName => championName.toLowerCase().includes(args[0].toLowerCase()));
            }
            if (championKeys.length > 0) {
                console.log(`Number of Champions returned ('${championKeys.length}')`);
                console.log(`List of Champion Keys returned ('${championKeys}')`);
                let embeddedMessages = [];
                for (let i = 0; i < (championKeys.length > 5 ? 5 : championKeys.length); i++) {
                    let championName = championKeys[i];
                    let championData = await ddragon.champion.byName({championName: championName});
                    console.log(`Creating message for => ('${championName}')`)
                    embeddedMessages.push(templateBuilder.buildMessage(championTemplate, {
                        championName: championName,
                        championTitle: championData.data[championName].title,
                        lore: championData.data[championName].lore,
                        tag: championData.data[championName].tags[1] ? `${championData.data[championName].tags[0]} - ${championData.data[championName].tags[1]}` : championData.data[championName].tags[0],
                        imageUrl: championData.data[championName].image.full,
                        version: championData.version
                    }));
                }
                const dmChannel = await msg.member.createDM(false);
                await dmChannel.send({ embeds: embeddedMessages });
                await msg.editReply({ content: 'Check your DMs.', ephemeral: true});
            } else {
                await msg.editReply('Could not find the champion specified.')
            }
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
