const tournamentsServiceImpl = require('../services/tournaments-service-impl');
const tentativeServiceImpl = require('../services/tentative-service-impl');
const {findTournament} = require('../utility/tournament-handler');
const errorHandler = require('../utility/error-handling');
const timeTracker = require('../utility/time-tracker');
const commandArgumentParser = require('./command-argument-parser');

module.exports = {
    name: 'tentative',
    description: 'Places a player on tentative. Will deregister them if they belong to a team.',
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
            let parsedArguments = commandArgumentParser.parse(args);
            if (!parsedArguments || !parsedArguments.tournamentName) {
                await msg.reply("A Tournament Name to be tentative for is missing. " +
                    "Please use !clash tentative 'tournament name' 'tournament day' " +
                    "to use tentative. i.e. !clash tentative msi2021 1");
            } else if (!parsedArguments.tournamentDay) {
                await msg.reply("A Tournament Day to be tentative for is missing. Please " +
                    "use !clash tentative 'tournament name' 'tournament day' to " +
                    "use tentative. i.e. !clash tentative msi2021 1");
            } else {
                await msg.deferReply();
                let times = await tournamentsServiceImpl.retrieveAllActiveTournaments();
                times = times.filter(findTournament(args[0], args[1]));
                if (Array.isArray(times) && times.length > 0) {
                    const tentativeResponse = await tentativeServiceImpl
                        .postTentativeUpdateForServerAndTournament(msg.user.id,
                            msg.member.guild.name, times[0].tournamentName, times[0].tournamentDay);
                    if (!tentativeResponse.tentativePlayers
                        || !tentativeResponse.tentativePlayers.includes(msg.user.username)) {
                        await msg.editReply(`We have taken you off of tentative queue. tip: Use '!clash teams' to view current team status`);
                    } else {
                        await msg.editReply(`We placed you into the tentative queue. If you were on a team, you have been removed. tip: Use '!clash teams' to view current team status`);
                    }
                } else {
                    await msg.editReply('Cannot find the tournament passed. Please check !clash time for an appropriate list.');
                }
            }
        } catch (err) {
            await errorHandler.handleError(this.name, err, msg, 'Failed to place you on tentative.')
        } finally {
            timeTracker.endExecution(this.name, startTime);
        }
    },
};
