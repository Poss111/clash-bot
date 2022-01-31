const tournamentsServiceImpl = require('../services/tournaments-service-impl');
const teamsServiceImpl = require('../services/teams-service-impl');
const registerReply = require('../templates/register-reply');
const {findTournament} = require('../utility/tournament-handler');
const errorHandling = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');

module.exports = {
    name: 'join',
    description: 'Used to join a specific Team.',
    options: [
        {
            type: 3,
            name: "role",
            description: "Top, Mid, Jg, Bot, or Supp",
            required: true
        },
        {
            type: 3,
            name: "tournament",
            description: "A future tournament to register for. Check time command if you do not know the name.",
            required: true
        },
        {
            type: 4,
            name: "day",
            description: "A day of the tournament to register for.",
            choices: [
                {
                    "name": "Day 1",
                    "value": 1
                },
                {
                    "name": "Day 2",
                    "value": 2
                },
                {
                    "name": "Day 3",
                    "value": 3
                },
                {
                    "name": "Day 4",
                    "value": 4
                }
            ],
            required: true
        },
        {
            type: 3,
            name: "team-name",
            description: "The name of the Team you would like to join (do not include the word Team).",
            required: true
        }
    ],
    execute: async function (msg, args) {
        const startTime = process.hrtime.bigint();

        try {
            if (!args || args.length === 0) {
                await msg.reply("Role, Tournament name, Tournament day, and Team are missing. You can use '!clash teams' to find existing teams. \n ***Usage***: !clash join ***Top*** ***msi2021*** ***1*** ***Pikachu***");
            } else if (!args[1]) {
                await msg.reply(`Tournament name, Tournament day and Team are missing. You can use '!clash teams' to find existing teams. \n ***Usage***: !clash join ${args[0]} ***msi2021*** ***1*** ***Pikachu***`);
            } else if (!args[2]) {
                await msg.reply(`Tournament day and Team are missing. You can use '!clash teams' to find existing teams. \n ***Usage***: !clash join ${args[0]} ${args[1]} ***1*** ***Pikachu***`);
            } else if (!args[3]) {
                await msg.reply(`Team is missing. You can use '!clash teams' to find existing teams. \n ***Usage***: !clash join ${args[0]} ${args[1]} ${args[2]} ***Pikachu***`);
            } else {
                msg.deferReply();
                let times = await tournamentsServiceImpl.retrieveAllActiveTournaments();
                times = times.filter(findTournament(args[1], args[2]));
                if (times.length === 0) {
                    console.log(`Unable to find Tournament for details - Name ('${args[1]}') Day ('${args[2]}').`);
                    msg.editReply(`The tournament you are trying to join does not exist Name '${args[1]}' Day '${args[2]}'. Please use '!clash times' to see valid tournaments.`)
                } else {
                    function buildTournamentDetails(team) {
                        return {
                            name: 'Tournament Details',
                            value: `${team.tournamentDetails.tournamentName} Day ${team.tournamentDetails.tournamentDay}`,
                            inline: true
                        };
                    }

                    let copy = JSON.parse(JSON.stringify(registerReply));
                    console.log(`Registering ('${msg.user.username}') with Tournaments ('${JSON.stringify(times)}') with role '${args[0]}'...`);
                    await teamsServiceImpl.postForTeamRegistration(msg.user.id, args[0], args[3], msg.member.guild.name,
                        times[0].tournamentName, times[0].tournamentDay).then(team => {
                        if (!team.error) {
                            console.log(`Registered ('${msg.user.username}') with Role ('${args[0]}') Tournament ('${team.tournamentDetails.tournamentName}') Team ('${team.teamName}').`);
                            copy.fields.push({
                                name: team.teamName, value: Object.entries(team.playersRoleDetails)
                                    .map(key => `${key[0]} - ${key[1]}`), inline: true
                            });
                            copy.fields.push(buildTournamentDetails(team));
                        } else {
                            copy.description = `Failed to find an available team with the following criteria, Role '${args[0]}' Tournament Name '${args[1]}' Tournament Day '${args[2]}' Team Name '${args[3]} or role is not available for that team`;
                        }
                        msg.editReply({embeds: [ copy ]});
                    });
                }
            }
        } catch (err) {
            await errorHandling.handleError(this.name, err, msg, 'Failed to join the requested team.');
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    }
}
