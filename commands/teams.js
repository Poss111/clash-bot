const dbUtils = require('../dao/dynamo-db-impl');
const teamsCard = require('../templates/teams');
module.exports = {
    name: 'teams',
    description: 'Used to return a human readable response of the current Clash team status.',
    execute: async function (msg, args) {
        dbUtils.getTeams(msg.guild.name).then(data => {
            let tentative = dbUtils.getTentative();
            let copy = JSON.parse(JSON.stringify(teamsCard));
            if (data.length !== 0) {
                data.forEach((team) => {
                    copy.fields.push({name: team.name, value: team.players});
                });
            } else if (tentative.length > 0) {
                copy.fields.push({name: 'Tentative Queue', value: tentative});
            } else {
                copy.fields.push({name: 'No Existing Teams. Please register!', value: 'Emptay'})
            }
            msg.reply({embed: copy});
        }).catch(err => {
            console.error(err);
            msg.reply('Failed to retrieve the current Clash Teams status. Please reach out to <@299370234228506627>.')
        });
    },
};
