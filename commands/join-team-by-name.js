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
            msg.reply("Tournament Name, Tournament Day, and Team are missing. You can use '!clash teams' to find existing teams. \n ***Usage***: !clash join ***msi2021*** ***1*** ***Pikachu***");
        } else if (!args[1]) {
            msg.reply("Tournament Day and Team is missing. You can use '!clash teams' to find existing teams. \n ***Usage***: !clash join msi2021 ***1*** ***Pikachu***");
        } else if (!args[2]) {
            msg.reply("Team is missing. You can use '!clash teams' to find existing teams. \n ***Usage***: !clash join msi2021 1 ***Pikachu***");
        } else {
            try {
                let times = await tournamentsServiceImpl.retrieveAllActiveTournaments();
                times = times.filter(findTournament(args[0], args[1]));
                if (times.length === 0) {
                    msg.reply(`The tournament you are trying to join does not exist Name ('${args[0]}') Day ('${args[1]}'). Please use '!clash times' to see valid tournaments.`)
                } else {
                    function buildTournamentDetails(team) {
                        return {
                            name: 'Tournament Details',
                            value: `${team.tournamentDetails.tournamentName} Day ${team.tournamentDetails.tournamentDay}`,
                            inline: true
                        };
                    }

                    let copy = JSON.parse(JSON.stringify(registerReply));
                    console.log(`Registering ('${msg.author.username}') with Tournaments ('${JSON.stringify(times)}')...`);
                    await teamsServiceImpl.postForTeamRegistration(msg.author.id, args[2], msg.guild.name, times[0].tournamentName, times[0].tournamentDay).then(team => {
                        if (!team.error) {
                            console.log(`Registered ('${msg.author.username}') with Tournament ('${team.tournamentDetails.tournamentName}') Team ('${team.teamName}').`);
                            copy.fields.push({name: team.teamName, value: team.playersDetails.map(player => player.name), inline: true});
                            copy.fields.push(buildTournamentDetails(team));
                        } else {
                            copy.description = `Failed to find an available team with the following criteria Tournament Name ('${args[0]}') Tournament Day ('${args[1]}') Team Name ('${args[2]}')`;
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
