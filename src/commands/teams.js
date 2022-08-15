const ClashBotRestClient = require('clash-bot-rest-client');
const teamsCard = require('../templates/teams');
const errorHandler = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
const logger = require('../utility/logger');
const {capitalizeFirstLetter} = require("../utility/utilities");

module.exports = {
    name: 'teams',
    description: 'Used to return response of the current Clash team status.',
    execute: async function (msg) {
        const loggerContext = {
            command: this.name,
            user: msg.user.id,
            username: msg.user.username,
            server: msg.member ? msg.member.guild.name : {}
        };
        const startTime = process.hrtime.bigint();
        try {
            await msg.deferReply();
            logger.info(loggerContext, 'Retrieving Team details for User.');
            const tentativeApi = new ClashBotRestClient
              .TentativeApi(new ClashBotRestClient
                .ApiClient('http://localhost:8080/api/v2'));
            const teamApi = new ClashBotRestClient
              .TeamApi(new ClashBotRestClient
                .ApiClient('http://localhost:8080/api/v2'));
            const responses = await Promise.all([
                tentativeApi.getTentativeDetails(msg.member.guild.name),
                teamApi.getTeam(msg.member.guild.name),
            ]);
            let tentative = responses[0];
            let teams = responses[1];
            let copy = JSON.parse(JSON.stringify(teamsCard));

            logger.info(loggerContext, `Teams returned ('${teams ? teams.length : 0}') TentativeList ('${tentative ? tentative.length : 0}')`);

            if (teams.length <= 0) {
                copy.fields.push({name: 'No Existing Teams. Please register!', value: 'Emptay'})
            } else {
                let counter;
                for (counter = 0; counter < teams.length; counter++) {
                    if (teams[counter].playerDetails) {
                        copy.fields.push({
                            name: capitalizeFirstLetter(teams[counter].name),
                            value: Object.entries(teams[counter].playerDetails)
                                .map(record => `${record[0]} - ${record[1].name}`)
                              .join('\n'),
                            inline: true
                        });
                        copy.fields.push({
                            name: 'Tournament Details',
                            value: `${teams[counter].tournament.tournamentName} Day ${teams[counter].tournament.tournamentDay}`,
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
                    if (Array.isArray(value.tentativePlayers)
                        && value.tentativePlayers.length > 0) {
                        if (!acc[key]) {
                            acc[key] = []
                        }
                        acc[key].push(value.tentativePlayers
                          .map(player => player.name));
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
            await msg.editReply({embeds: [ copy ]});
        } catch(err) {
            await errorHandler.handleError(
              this.name,
              err,
              msg,
              'Failed to retrieve the current Clash Teams status.',
              loggerContext
            );
        } finally{
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
