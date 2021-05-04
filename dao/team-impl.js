const names = require('../random-names')

class TeamUtils {
    clashTeams = [];
    tentative = [];

    constructor() {}

    registerPlayer(playerName) {
        let teams = this.clashTeams;
        console.log(teams);
        let team = teams.filter(team => team.players.includes(playerName));
        this.removeFromTentative(playerName);
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
            } if (team.players.length < 1) {
                teams = teams.filter((playerTeam) => playerTeam !== team);
            }
        });
        this.clashTeams = teams;
        return found;
    }

    createNewTeam(playerName, number) {
        let name = names[number];
        return {
            name: `Team ${name}`,
            players: [playerName],
            clashDate: new Date(),
        };
    }

    placeOnTentative(playerName) {
        this.deregisterPlayer(playerName);
        this.tentative.push(playerName);
    }

    removeFromTentative(playerName) {
        this.tentative = this.tentative.filter((player) => player !== playerName);
    }

    handleTentative(playerName) {
        let player = this.tentative.filter((player) => player === playerName);
        if (player.length > 0) {
            this.removeFromTentative(playerName);
            return true;
        } else {
            this.placeOnTentative(playerName);
            return false;
        }
    }

    getTeams() {
        return JSON.parse(JSON.stringify(this.clashTeams));
    }

    getTentative() {
        return JSON.parse(JSON.stringify(this.tentative));
    }
}
module.exports = new TeamUtils;
