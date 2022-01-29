const tournamentsServiceImpl = require('../services/tournaments-service-impl');
const teamsServiceImpl = require('../services/teams-service-impl');
const errorHandling = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
const {findTournament} = require('../utility/tournament-handler');
const registerReply = require('../templates/register-reply');

module.exports = {
    name: 'newTeam',
    description: 'Used to create a new Team for an available Clash Tournament.',
    execute: async function (msg, args) {
        const startTime = process.hrtime.bigint();
        let filter;
        if (!args || args.length === 0) {
            msg.reply("The role to join a new Team with are missing. Please pass one of the following Top, Mid, Jg, Bot, or Supp.\n ***Usage***: !clash newTeam ***Top***");
        } else {
            let role = args[0];
            let roleNotMatching = false;
            switch (role.toLowerCase()) {
                case('top'):
                    role = 'Top';
                    break;
                case('mid'):
                    role = 'Mid';
                    break;
                case('jg'):
                    role = 'Jg';
                    break;
                case('bot'):
                    role = 'Bot';
                    break;
                case('supp'):
                    role = 'Supp';
                    break;
                default:
                    roleNotMatching = true;
            }
            if (roleNotMatching) {
                msg.reply(`The role passed is not correct - '${role}'. Please pass one of the following Top, Mid, Jg, Bot, or Supp.\n ***Usage***: !clash newTeam ***Top***`)
            } else if (args[1]) {
                let registeringMessage = `Registering ${msg.author.username} for Tournament ${args[1]}`;
                if (args[2]) {
                    registeringMessage = registeringMessage + ` on day ${args[2]}`;
                    filter = findTournament(args[1], args[2]);
                } else {
                    filter = findTournament(args[1]);
                }
                msg.channel.send(registeringMessage + ` as '${role}'...`);
            } else {
                msg.channel.send(`Registering ${msg.author.username} for the first available tournament as '${role}' that you are not already registered to...`);
            }

            try {
                let filteredClashTimes = await tournamentsServiceImpl.retrieveAllActiveTournaments();
                if (filter && filteredClashTimes) {
                    filteredClashTimes = filteredClashTimes.filter(filter)
                }
                if (!filteredClashTimes
                    || !filteredClashTimes.length) {
                    if (!args[1]) {
                        errorHandling.handleError(this.name,
                            new Error('Failed to find any tournaments to attempt to register to.'),
                            msg, 'Failed to find any tournaments to attempt to register to.');
                    } else {
                        let returnMessage = `We were unable to find a Tournament with '${args[1]}'`
                        if (args[2]) {
                            returnMessage = returnMessage + ` and '${args[2]}'`;
                        }
                        msg.reply(returnMessage + '. Please try again.');
                    }
                } else {
                    function buildTournamentDetails(team) {
                        return {
                            name: 'Tournament Details',
                            value: `${team.tournamentDetails.tournamentName} Day ${team.tournamentDetails.tournamentDay}`,
                            inline: true
                        };
                    }

                    let notRegistered = true;
                    let data;
                    while (notRegistered && filteredClashTimes.length > 0) {
                        data = await teamsServiceImpl.postForNewTeam(msg.author.id, role, msg.guild.name,
                            filteredClashTimes[0].tournamentName, filteredClashTimes[0].tournamentDay,
                            filteredClashTimes[0].startTime);
                        if (data.error !== 'Player is not eligible to create a new Team.') {
                            notRegistered = false;
                        } else {
                            filteredClashTimes.splice(0, 1);
                        }
                    }
                    let copy = JSON.parse(JSON.stringify(registerReply));
                    if (data.error === 'Player is not eligible to create a new Team.') {
                        copy.description = 'You are already registered to the given tournament.';
                    } else {
                        copy.fields.push({
                            name: data.teamName,
                            value: Object.entries(data.playersRoleDetails).map(keyValue => `${keyValue[0]} - ${keyValue[1]}`),
                            inline: true
                        });
                        copy.fields.push(buildTournamentDetails(data));
                    }
                    msg.reply({embed: copy});
                }
            } catch
                (err) {
                errorHandling.handleError(this.name, err, msg, 'Failed to register you to team.')
            } finally {
                timeTracker.endExecution(this.name, startTime);
            }
        }
    }
}
