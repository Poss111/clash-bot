const leagueApi = require('../utility/LeagueApi');
const clashTimeMenu = require('../templates/clash-times-menu');
module.exports = {
    name: 'time',
    description: 'Places a player on tentative. Will deregister them if they belong to a team.',
    execute(msg, args) {
        const leagueTimes = leagueApi.getLeagueTimes();
        const copy = JSON.parse(JSON.stringify(clashTimeMenu));
        if (leagueTimes.length > 0) {
            leagueTimes.forEach((time) => {
                copy.fields.push({
                    name: 'Tournament Name',
                    value: time.name,
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
    },
};
