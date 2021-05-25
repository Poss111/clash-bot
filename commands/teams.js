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
                let counter;
                for (counter = 0; counter < data.length; counter++) {
                    if (data[counter].players && data[counter].players.length > 0) {
                        copy.fields.push({name: data[counter].teamName, value: data[counter].players, inline: true});
                        copy.fields.push({
                            name: 'Tournament Details',
                            value: `${data[counter].tournamentName} Day ${data[counter].tournamentDay}`,
                            inline: true
                        });
                        if (counter < data.length - 1) {
                            copy.fields.push({name: '\u200B', value: '\u200B'});
                        }
                    }
                }
            } if (tentative && tentative.length > 0) {
                const reduce = tentative.reduce((acc, value) => {
                    if (!acc[value.tournamentName]) {
                        acc[value.tournamentName] = []
                    }
                    acc[value.tournamentName].push(value.playerName);
                    return acc;
                }, {});
                let message = '';
                const keys = Object.keys(reduce);
                for (let i = 0; i < keys.length; i++) {
                    message = message.concat(`${keys[i]} -> ${reduce[keys[i]]}`);
                    if (i < keys.length - 1) {
                        message = message.concat('\n');
                    }
                }
                copy.fields.push({name: 'Tentative Queue', value: message});
            }
            msg.reply({embed: copy});
        }).catch(err => errorHandler.handleError(this.name, err, msg, 'Failed to retrieve the current Clash Teams status.'))
            .finally(() => {
                timeTracker.endExecution(this.name, startTime);
            });
    },
};
