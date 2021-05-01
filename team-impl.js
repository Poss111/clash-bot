class TeamUtils {
    clashTeams = [];
    tentative = [];

    constructor() {}

    registerPlayer(playerName) {
        let teams = this.clashTeams;
        console.log(teams);
        let team = teams.filter(team => team.players.includes(playerName));
        if (team.length === 0) {
            let availableTeams = teams.filter(team => team.players.length < 5);

            if (availableTeams.length !== 0) {
                team = availableTeams[0];
                team.players.push(playerName);
            } else {
                console.log(`Creating new team for ${playerName} since there are no available teams.`)
                team = this.createNewTeam(playerName, teams.length + 1);
                this.clashTeams.push(team);
            }
        } else {
            team = team[0];
            team.exist = true;
        }
        return team;
    }

    deregisterPlayer(playerName) {
        let teams = this.clashTeams;
        let found;
        teams.forEach(team => {
            if (team.players.includes(playerName)) {
                team.players = team.players.filter(name => name !== playerName);
                found = true;
            }
        })
        return found;
    }

    createNewTeam(playerName, number) {
        return {
            name: `Team ${number}`,
            players: [playerName],
            clashDate: new Date(),
        };
    }

    placeOnTentative(playerName) {
        this.deregisterPlayer(playerName);
        this.tentative.push(playerName);
    }

    getTeams() {
        return JSON.parse(JSON.stringify(this.clashTeams));
    }

    getTentative() {
        return JSON.parse(JSON.stringify(this.tentative));
    }
}
module.exports = new TeamUtils;
