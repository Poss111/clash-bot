const dbUtils = require('../dao/dynamo-db-impl');
const errorHandling = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
const registerReply = require('../templates/register-reply');
const leagueApi = require('../dao/clashtime-db-impl');
module.exports = {
    name: 'register',
    description: 'Used to register the user to an available Clash team.',
    execute: async function (msg, args) {
        const startTime = process.hrtime.bigint();
        let promise;
        if (args && args.length) {
            msg.channel.send(`Registering ${msg.author.username} for Tournament ${args[0]}...`)
            promise = leagueApi.findTournament(args[0], args[1]);
        } else {
            msg.channel.send(`Registering ${msg.author.username} for the first available tournament you are not already registered to...`);
            promise = leagueApi.findTournament();
        }

        await promise.then((filteredClashTimes) => {
            if (!filteredClashTimes
                || !filteredClashTimes.length) {
                msg.reply(`We were unable to find a tournament for the following name given => ${args[0]}. Please try again.`);
            } else {
                function buildTournamentDetails(team) {
                    return {
                        name: 'Tournament Details',
                        value: `${team.tournamentName} Day ${team.tournamentDay}`,
                        inline: true
                    };
                }

                dbUtils.registerPlayer(msg.author.username, msg.guild.name, filteredClashTimes).then(data => {
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
            }
        });
    },
};
