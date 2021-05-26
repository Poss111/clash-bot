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
        if (args && args.length) {
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

        function buildTournamentDetails(team) {
            return {
                name: 'Tournament Details',
                value: `${team.tournamentName} Day ${team.tournamentDay}`,
                inline: true
            };
        }

        await dbUtils.registerPlayer(msg.author.username, msg.guild.name, tournament).then(data => {
            let copy = JSON.parse(JSON.stringify(registerReply));
            if (Array.isArray(data) && data[0].exist) {
                copy.description = 'You are already registered to the following Teams.';
                let i;
                for (i = 0; i < data.length; i++) {
                    copy.fields.push({name: data[i].teamName, value: data[i].players, inline: true});
                    copy.fields.push(buildTournamentDetails(data[i]));
                    if (i < data.length - 1) {
                        copy.fields.push({name: '\u200B', value: '\u200B'});
                    }
                }
            } else {
                copy.fields.push({name: data.teamName, value: data.players, inline: true});
                copy.fields.push(buildTournamentDetails(data));
            }
            msg.reply({embed: copy});
        }).catch(err => errorHandling.handleError(this.name, err, msg, 'Failed to register you to team.'))
            .finally(() => {
                timeTracker.endExecution(this.name, startTime);
            });
    },
};
