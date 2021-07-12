const dbUtils = require('../dao/dynamo-db-impl');
const errorHandling = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
const registerReply = require('../templates/register-reply');
const leagueApi = require('../dao/clashtime-db-impl');
const commandArgumentParser = require('./command-argument-parser');

module.exports = {
    name: 'register',
    description: 'Used to register the user to an available Clash team.',
    execute: async function (msg, args) {
        const startTime = process.hrtime.bigint();
        let promise;
        let parsedArguments = commandArgumentParser.parse(args);
        if (parsedArguments && parsedArguments.tournamentName) {
            let registeringMessage = `Registering ${msg.author.username} for Tournament ${parsedArguments.tournamentName}`;
            if (parsedArguments.tournamentDay) {
                registeringMessage = registeringMessage + ` on day ${parsedArguments.tournamentDay}`;
            }
            msg.channel.send(registeringMessage + '...');
            promise = leagueApi.findTournament(parsedArguments.tournamentName, parsedArguments.tournamentDay);
        } else {
            msg.channel.send(`Registering ${msg.author.username} for the first available tournament you are not already registered to...`);
            promise = leagueApi.findTournament();
        }

        await promise.then((filteredClashTimes) => {
            if (!filteredClashTimes
                || !filteredClashTimes.length) {
                if (!parsedArguments.tournamentName) {
                    errorHandling.handleError(this.name, new Error('Failed to find any tournaments to attempt to register to.'), msg, 'Failed to find any tournaments to attempt to register to.');
                } else {
                    let returnMessage = `We were unable to find a Tournament with '${parsedArguments.tournamentName}'`
                    if (parsedArguments.tournamentDay) {
                        returnMessage = returnMessage + ` and '${parsedArguments.tournamentDay}'`;
                    }
                    msg.reply(returnMessage +'. Please try again.');
                }
            } else {
                function buildTournamentDetails(team) {
                    return {
                        name: 'Tournament Details',
                        value: `${team.tournamentName} Day ${team.tournamentDay}`,
                        inline: true
                    };
                }

                dbUtils.registerPlayer(msg.author.username, msg.guild.name, filteredClashTimes, parsedArguments.createNewTeam).then(data => {
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
