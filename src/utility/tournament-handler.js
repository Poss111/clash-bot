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

module.exports.findTournament = findTournament;
