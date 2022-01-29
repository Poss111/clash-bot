const tournamentsServiceImpl = require('../services/tournaments-service-impl');
const teamsServiceImpl = require('../services/teams-service-impl');
const registerReply = require('../templates/register-reply');
const { findTournament } = require('../utility/tournament-handler');
const errorHandling = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');

module.exports = {
    name: 'join',
    description: 'Used to join a specific Team. The user must specify which Tournament and Team they would like to join.',
    execute: async function (msg, args) {
        const startTime = process.hrtime.bigint();
        if (!args || args.length === 0) {
            msg.reply("Role, Tournament name, Tournament day, and Team are missing. You can use '!clash teams' to find existing teams. \n ***Usage***: !clash join ***Top*** ***msi2021*** ***1*** ***Pikachu***");
        } else if (!args[1]) {
            msg.reply(`Tournament name, Tournament day and Team are missing. You can use '!clash teams' to find existing teams. \n ***Usage***: !clash join ${args[0]} ***msi2021*** ***1*** ***Pikachu***`);
        } else if (!args[2]) {
            msg.reply(`Tournament day and Team are missing. You can use '!clash teams' to find existing teams. \n ***Usage***: !clash join ${args[0]} ${args[1]} ***1*** ***Pikachu***`);
        } else if (!args[3]) {
            msg.reply(`Team is missing. You can use '!clash teams' to find existing teams. \n ***Usage***: !clash join ${args[0]} ${args[1]} ${args[2]} ***Pikachu***`);
        } else {
            try {
                let times = await tournamentsServiceImpl.retrieveAllActiveTournaments();
                times = times.filter(findTournament(args[1], args[2]));
                if (times.length === 0) {
                    console.log(`Unable to find Tournament for details - Name ('${args[1]}') Day ('${args[2]}').`);
                    msg.reply(`The tournament you are trying to join does not exist Name '${args[1]}' Day '${args[2]}'. Please use '!clash times' to see valid tournaments.`)
                } else {
                    function buildTournamentDetails(team) {
                        return {
                            name: 'Tournament Details',
                            value: `${team.tournamentDetails.tournamentName} Day ${team.tournamentDetails.tournamentDay}`,
                            inline: true
                        };
                    }

                    let copy = JSON.parse(JSON.stringify(registerReply));
                    console.log(`Registering ('${msg.author.username}') with Tournaments ('${JSON.stringify(times)}') with role '${args[0]}'...`);
                    await teamsServiceImpl.postForTeamRegistration(msg.author.id, args[0], args[3], msg.guild.name,
                        times[0].tournamentName, times[0].tournamentDay).then(team => {
                        if (!team.error) {
                            console.log(`Registered ('${msg.author.username}') with Role ('${args[0]}') Tournament ('${team.tournamentDetails.tournamentName}') Team ('${team.teamName}').`);
                            copy.fields.push({name: team.teamName, value: Object.entries(team.playersRoleDetails)
                                    .map(key => `${key[0]} - ${key[1]}`), inline: true});
                            copy.fields.push(buildTournamentDetails(team));
                        } else {
                            copy.description = `Failed to find an available team with the following criteria Role '${args[0]}' Tournament Name '${args[1]}' Tournament Day '${args[2]}' Team Name '${args[3]} or role is not available for that team`;
                        }
                        msg.reply({embed: copy});
                    });
                }
            } catch (err) {
                errorHandling.handleError(this.name, err, msg, 'Failed to join the requested team.');
            } finally {
                timeTracker.endExecution(this.name, startTime);
            }
        }
    }
}
