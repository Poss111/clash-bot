const leagueApi = require('../dao/clash-time-db-impl');
const dynamoDBUtils = require('../dao/clash-teams-db-impl');
const registerReply = require('../templates/register-reply');
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
                let times = await leagueApi.findTournament(args[0]);
                if (times.length === 0) {
                    msg.reply(`The tournament you are trying to join does not exist ('${args[0]}'). Please use '!clash times' to see valid tournaments.`)
                } else {
                    function buildTournamentDetails(team) {
                        return {
                            name: 'Tournament Details',
                            value: `${team.tournamentName} Day ${team.tournamentDay}`,
                            inline: true
                        };
                    }

                    let copy = JSON.parse(JSON.stringify(registerReply));
                    console.log(`Registering ('${msg.author.username}') with Tournaments ('${JSON.stringify(times)}')...`);
                    await dynamoDBUtils.registerWithSpecificTeam(msg.author.username, msg.guild.name, times, args[1]).then(team => {
                        if (team) {
                            console.log(`Registered ('${msg.author.username}') with Tournament ('${team.tournamentName}') Team ('${team.teamName}').`);
                            copy.fields.push({name: team.teamName, value: team.players, inline: true});
                            copy.fields.push(buildTournamentDetails(team));
                        } else {
                            copy.description = `Failed to find an available team with the following criteria Tournament ('${args[0]}') Team Name ('${args[1]}')`;
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
