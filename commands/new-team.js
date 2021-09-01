const tournamentsServiceImpl = require('../services/tournaments-service-impl');
const teamsServiceImpl = require('../services/teams-service-impl');
const errorHandling = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
const registerReply = require('../templates/register-reply');
const commandArgumentParser = require('./command-argument-parser');

module.exports = {
    name: 'newTeam',
    description: 'Used to create a new Team for an available Clash Tournament.',
    execute: async function (msg, args) {
        const startTime = process.hrtime.bigint();
        let parsedArguments = commandArgumentParser.parse(args);
        let filter;
        if (parsedArguments && parsedArguments.tournamentName) {
            let registeringMessage = `Registering ${msg.author.username} for Tournament ${parsedArguments.tournamentName}`;
            if (parsedArguments.tournamentDay) {
                registeringMessage = registeringMessage + ` on day ${parsedArguments.tournamentDay}`;
                filter = findTournament(parsedArguments.tournamentName, parsedArguments.tournamentDay);
            } else {
                filter = findTournament(parsedArguments.tournamentName);
            }
            msg.channel.send(registeringMessage + '...');
        } else {
            msg.channel.send(`Registering ${msg.author.username} for the first available tournament you are not already registered to...`);
        }

        try {
            let filteredClashTimes = await tournamentsServiceImpl.retrieveAllActiveTournaments();
            if (filter && filteredClashTimes) {
                filteredClashTimes = filteredClashTimes.filter(filter)
            }
            if (!filteredClashTimes
                || !filteredClashTimes.length) {
                if (!parsedArguments.tournamentName) {
                    errorHandling.handleError(this.name, new Error('Failed to find any tournaments to attempt to register to.'), msg, 'Failed to find any tournaments to attempt to register to.');
                } else {
                    let returnMessage = `We were unable to find a Tournament with '${parsedArguments.tournamentName}'`
                    if (parsedArguments.tournamentDay) {
                        returnMessage = returnMessage + ` and '${parsedArguments.tournamentDay}'`;
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
                    data = await teamsServiceImpl.postForNewTeam(msg.author.id, msg.guild.name, filteredClashTimes[0].tournamentName, filteredClashTimes[0].tournamentDay, filteredClashTimes[0].startTime);
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
                    copy.fields.push({name: data.teamName, value: data.playersDetails.map(player => player.name), inline: true});
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

let findTournament = (tournamentName, dayNumber) => {
    let filter;
    if (tournamentName) {
        tournamentName = tournamentName.toLowerCase()
        filter = (data) => data.tournamentName.toLowerCase().includes(tournamentName);
        if (tournamentName && !isNaN(dayNumber)) {
            filter = (data) => data.tournamentName.toLowerCase().includes(tournamentName)
                && data.tournamentDay.includes(dayNumber);
        }
    }
    return filter;
}

