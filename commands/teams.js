const dbUtils = require('../team-impl');
const teamsCard = require('../teams');
module.exports = {
    name: 'teams',
    description: 'Used to return a human readable response of the current Clash team status.',
    execute: async function (msg, args) {
        let teams = await dbUtils.getTeams();
        let tentative = await dbUtils.getTentative();
        let copy = JSON.parse(JSON.stringify(teamsCard));
        if (teams.length !== 0) {
            teams.forEach((team) => {
                copy.fields.push({name: team.name, value: team.players});
            });
        } else if (tentative.length > 0) {
            copy.fields.push({name: 'Tentative Queue', value: tentative});
        } else {
            copy.fields.push({name: 'No Existing Teams. Please register!', value: 'Emptay'})
        }
        msg.reply({embed: copy});
    },
};
