const clashBotTeamsServiceImpl = require('../services/teams-service-impl');
const tentativeServiceImpl = require('../services/tentative-service-impl');
const teamsCard = require('../templates/teams');
const errorHandler = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');

module.exports = {
    name: 'teams',
    description: 'Used to return response of the current Clash team status.',
    execute: async function (msg) {
        const startTime = process.hrtime.bigint();
        await msg.deferReply();
        await Promise.all([tentativeServiceImpl.retrieveTentativeListForServer(msg.member.guild.name),
            clashBotTeamsServiceImpl.retrieveActiveTeamsForServer(msg.member.guild.name)]).then(data => {
            let tentative = data[0];
            let teams = data[1];
            let copy = JSON.parse(JSON.stringify(teamsCard));

            if (teams.length <= 0) {
                copy.fields.push({name: 'No Existing Teams. Please register!', value: 'Emptay'})
            } else {
                let counter;
                for (counter = 0; counter < teams.length; counter++) {
                    if (teams[counter].playersDetails && teams[counter].playersDetails.length > 0) {
                        copy.fields.push({
                            name: teams[counter].teamName,
                            value: teams[counter].playersDetails.map(record => record.role + " - " + record.name),
                            inline: true
                        });
                        copy.fields.push({
                            name: 'Tournament Details',
                            value: `${teams[counter].tournamentDetails.tournamentName} Day ${teams[counter].tournamentDetails.tournamentDay}`,
                            inline: true
                        });
                        if (counter < teams.length - 1) {
                            copy.fields.push({name: '\u200B', value: '\u200B'});
                        }
                    }
                }
            }
            if (tentative && tentative.length > 0) {
                const reduce = tentative.reduce((acc, value) => {
                    const key = `${value.tournamentDetails.tournamentName} - ${value.tournamentDetails.tournamentDay}`;
                    if (!acc[key]) {
                        acc[key] = []
                    }
                    if (Array.isArray(value.tentativePlayers) && value.tentativePlayers.length > 0) {
                        acc[key].push(value.tentativePlayers);
                    }
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
            msg.editReply({embeds: [ copy ]});
        }).catch(err => errorHandler.handleError(this.name, err, msg, 'Failed to retrieve the current Clash Teams status.'))
            .finally(() => {
                timeTracker.endExecution(this.name, startTime);
            });
    },
};
