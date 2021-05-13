const dbUtils = require('../dao/dynamo-db-impl');
const teamsCard = require('../templates/teams');
const errorHandler = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
module.exports = {
    name: 'teams',
    description: 'Used to return a human readable response of the current Clash team status.',
    execute: async function (msg) {
        const startTime = process.hrtime.bigint();
        await dbUtils.getTeams(msg.guild.name).then(data => {
            let tentative = dbUtils.getTentative();
            let copy = JSON.parse(JSON.stringify(teamsCard));

            if (!data || data.length <= 0 || !data[0].players) {
                copy.fields.push({name: 'No Existing Teams. Please register!', value: 'Emptay'})
            } else {
                data.forEach((team) => {
                    if (team.players && team.players.length > 0) {
                        copy.fields.push({name: team.teamName, value: team.players});
                    }
                });
            } if (tentative && tentative.length > 0) {
                copy.fields.push({name: 'Tentative Queue', value: tentative});
            }
            msg.reply({embed: copy});
        }).catch(err => errorHandler.handleError(this.name, err, msg, 'Failed to retrieve the current Clash Teams status.'))
            .finally(() => {
                timeTracker.endExecution(this.name, startTime);
            });
    },
};
