const dbUtils = require('../dao/dynamo-db-impl');
const errorHandling = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
const registerReply = require('../templates/register-reply');
const leagueApi = require('../utility/LeagueApi');
module.exports = {
    name: 'register',
    description: 'Used to register the user to an available Clash team.',
    execute: async function (msg, args) {
        const startTime = process.hrtime.bigint();
        let tournament;
        if (args) {
            msg.channel.send(`Registering ${msg.author.username} for Tournament ${args[0]}...`)
            tournament = leagueApi.findTournament(args[0], args[1]);
            if (!tournament) {
                msg.reply(`We were unable to find a tournament for the following name given => ${args[0]}. Please try again.`);
                return;
            }
        } else {
            msg.channel.send(`Registering ${msg.author.username} for the first available tournament you are not already registered to...`);
            tournament = leagueApi.findTournament();
        }
        await dbUtils.registerPlayer(msg.author.username, msg.guild.name, tournament).then(data => {
            if (data.exist) {
                msg.reply(`You are already registered to ${data.teamName} for Tournament ${data.tournament} Day ${data.tournamentDay} your Team consists so far of ${data.players}`);
            } else {
                let copy = JSON.parse(JSON.stringify(registerReply));
                copy.fields.push({name: data.tournament, value: data.tournamentDay});
                copy.fields.push({name: data.teamName, value: data.players});
                msg.reply({ embed: copy});
            }
        }).catch(err => errorHandling.handleError(this.name, err, msg, 'Failed to register you to team.'))
            .finally(() => {
                timeTracker.endExecution(this.name, startTime);
            });
    },
};
