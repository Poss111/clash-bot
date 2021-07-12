const leagueApi = require('../dao/clashtime-db-impl');

module.exports = {
    name: 'joinTeam',
    description: 'Used to join a specific Team. The user must specify which Tournament and Team they would like to join.',
    execute: async function (msg, args) {
        if (!args) msg.reply("Please pass a tournament and team to join. You can use '!clash teams' to find existing teams.");
        else {
            await leagueApi.findTournament(args[0]).then(times => {
                if (times.length === 0) {
                    msg.reply(`The tournament you are trying to join does not exist ('${args[0]}'). Please use '!clash times' to see valid tournaments.`)
                } else {
                    msg.reply("You have successfully joined a Team.");
                }
            });
        }
    }
}
