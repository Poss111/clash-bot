const leagueApi = require('../dao/clashtime-db-impl');
const clashTimeMenu = require('../templates/clash-times-menu');
const timeTracker = require('../utility/time-tracker');
module.exports = {
    name: 'time',
    description: 'Places a player on tentative. Will deregister them if they belong to a team.',
    async execute(msg) {
        const startTime = process.hrtime.bigint();
        await leagueApi.retrieveTournaments().then(clashTimes => {
            const copy = JSON.parse(JSON.stringify(clashTimeMenu));
            try {
                if (clashTimes && clashTimes.length > 0) {
                    clashTimes.forEach((time) => {
                        copy.fields.push({
                            name: 'Tournament Name',
                            value: time.tournamentName,
                            inline: false,
                        });
                        copy.fields.push({
                            name: 'Day',
                            value: time.tournamentDay,
                            inline: true,
                        });
                        copy.fields.push({
                            name: 'Registration Time',
                            value: time.registrationTime,
                            inline: true,
                        });
                        copy.fields.push({
                            name: 'Start Time',
                            value: time.startTime,
                            inline: true,
                        });
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
        });
    },
};
