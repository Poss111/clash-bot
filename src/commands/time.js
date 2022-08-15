const ClashBotRestClient = require('clash-bot-rest-client');
const clashTimeMenu = require('../templates/clash-times-menu');
const clashTimeFields = require('../templates/clash-time-fields');
const templateBuilder = require('../utility/template-builder');
const timeTracker = require('../utility/time-tracker');
const moment = require('moment-timezone');
const errorHandler = require('../utility/error-handling');
const logger = require('pino')();

module.exports = {
    name: 'time',
    description: 'Places a player on tentative. Will deregister them if they belong to a team.',
    async execute(msg) {
        const loggerContext = {
            command: this.name,
            user: msg.user.id,
            username: msg.user.username,
            server: msg.member ? msg.member.guild.name : {}
        };
        const startTime = process.hrtime.bigint();
        await msg.deferReply();
        try {
            const client = new ClashBotRestClient.TournamentApi(new ClashBotRestClient.ApiClient('http://localhost:8080/api/v2'));
            let response = await client.getTournaments({});
            const copy = JSON.parse(JSON.stringify(clashTimeMenu));
            if (response && response.length > 0) {
                logger.info(loggerContext, `${response.length} Tournaments retrieved.`);
                const dateFormat = 'MMMM DD yyyy hh:mm a z';
                const tournamentDateFormat = 'MMMM DD yyyy';
                const tierTimeFormat = 'h:mm a z';
                const timeZone = 'America/Los_Angeles';
                moment.tz.setDefault(timeZone);
                response = response.slice(0, 4);
                response.forEach((time) => {
                    let parsedDate = new moment(time.registrationTime, dateFormat).format(tournamentDateFormat);
                    let parsedRegistrationDate = new moment(time.registrationTime, dateFormat);
                    let tierFourTime = new moment(time.registrationTime, dateFormat).format(tierTimeFormat);
                    let tierThreeTime = new moment(parsedRegistrationDate).add('45', 'minutes');
                    let tierTwoTime = new moment(parsedRegistrationDate).add('90', 'minutes');
                    let tierOneTime = new moment(parsedRegistrationDate).add('135', 'minutes');
                    let messagePayload = {
                        tournamentName: time.tournamentName,
                        tournamentDay: time.tournamentDay,
                        tournamentDate: parsedDate,
                        tierFourTime: tierFourTime,
                        tierThreeTime: tierThreeTime.format(tierTimeFormat),
                        tierTwoTime: tierTwoTime.format(tierTimeFormat),
                        tierOneTime: tierOneTime.format(tierTimeFormat),
                    };
                    copy.fields.push(templateBuilder.buildMessage(JSON.parse(JSON.stringify(clashTimeFields)), messagePayload));
                });
            } else {
                copy.fields.push({
                    name: 'No times available',
                    value: 'N/A',
                    inline: false,
                });
            }
            msg.editReply({embeds: [copy]});
        } catch(err) {
            await errorHandler.handleError(
              this.name,
              err,
              msg,
              'Failed to retrieve times.',
              loggerContext);
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
