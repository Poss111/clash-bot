const {httpCall} = require('./httpHelper');

class TeamsServiceImpl {

    retrieveActiveTeamsForServer(expectedServerName) {
        return httpCall('localhost', `/api/teams/${encodeURI(expectedServerName)}`, 'GET');
    }

    async postForNewTeam(id, serverName, tournamentName, tournamentDay, startTime) {
        return httpCall('localhost', `/api/team`, 'POST', {
            id: id,
            serverName: serverName,
            tournamentName: tournamentName,
            tournamentDay: tournamentDay,
            startTime: startTime
        })
    }

    async postForTeamRegistration(id, teamName, serverName, tournamentName, tournamentDay) {
        return httpCall('localhost', `/api/team/register`, 'POST', {
            id: id,
            teamName: teamName,
            serverName: serverName,
            tournamentName: tournamentName,
            tournamentDay: tournamentDay
        })
    }

    async deleteFromTeam(id, serverName, tournamentName, tournamentDay) {
        return httpCall('localhost', `/api/team/register`, 'DELETE', {
            id: id,
            serverName: serverName,
            tournamentName: tournamentName,
            tournamentDay: tournamentDay
        })
    }

}

module.exports = new TeamsServiceImpl;
