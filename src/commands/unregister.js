const tournamentsServiceImpl = require('../services/tournaments-service-impl');
const teamsServiceImpl = require('../services/teams-service-impl');
const errorHandler = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
const commandArgumentParser = require('./command-argument-parser');

module.exports = {
    name: 'unregister',
    description: 'Used to unregister from an existing Clash team.',
    options: [
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
            "choices": [
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
        }
    ],
    execute: async function (msg, args) {
        const startTime = process.hrtime.bigint();
        try {
            const parsedArguments = commandArgumentParser.parse(args);
            if (!parsedArguments || (!parsedArguments.tournamentName || !parsedArguments.tournamentDay)) {
                msg.reply(`Please pass the tournament and day to unregister for i.e. /unregister ***msi2021*** ***2***`);
                timeTracker.endExecution(this.name, startTime);
            } else {
                await msg.deferReply();
                let times = await tournamentsServiceImpl.retrieveAllActiveTournaments(parsedArguments.tournamentName,
                    parsedArguments.tournamentDay);
                if (Array.isArray(times) && times.length) {
                    await msg.editReply(`Unregistering '${msg.user.username}' from Tournament '${times[0].tournamentName}' on day '${times[0].tournamentDay}'...`)
                    let data = await teamsServiceImpl.deleteFromTeam(msg.user.id, msg.member.guild.name,
                        times[0].tournamentName, times[0].tournamentDay);
                    if (!data.error) {
                        await msg.editReply("Removed you from your Team. Please use /join or /newTeam if you " +
                            "would like to join again. Thank you!")
                    } else {
                        await msg.editReply("We did not find you on an existing Team. Please use /join or /newTeam " +
                            "if you would like to join again. Thank you!");
                    }
                } else {
                    await msg.editReply("Please provide an existing tournament and day to unregister for. " +
                        "Use '/team' to print a team.");
                }
            }
        } catch (err) {
            await errorHandler.handleError(this.name, err, msg, 'Failed to unregister you.')
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
