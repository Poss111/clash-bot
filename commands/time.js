const leagueApi = require('../dao/clash-time-db-impl');
const clashTimeMenu = require('../templates/clash-times-menu');
const clashTimeFields = require('../templates/clash-time-fields');
const templateBuilder = require('../utility/template-builder');
const timeTracker = require('../utility/time-tracker');
const moment = require('moment-timezone');
module.exports = {
    name: 'time',
    description: 'Places a player on tentative. Will deregister them if they belong to a team.',
    async execute(msg) {
        const startTime = process.hrtime.bigint();

        await leagueApi.findTournament().then(clashTimes => {
            console.log('Time retrieved.');
            const copy = JSON.parse(JSON.stringify(clashTimeMenu));
            try {
                if (clashTimes && clashTimes.length > 0) {
                    const dateFormat = 'MMMM DD yyyy hh:mm a z';
                    const tournamentDateFormat = 'MMMM DD yyyy';
                    const tierTimeFormat = 'h:mm a z';
                    const timeZone = 'America/Los_Angeles';
                    moment.tz.setDefault(timeZone);
                    clashTimes.forEach((time) => {
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
                    })
                }
                msg.channel.send({embed: copy});
            } finally {
                timeTracker.endExecution(this.name, startTime);
            }
        })
    },
};
