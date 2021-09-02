const {httpCall} = require('./httpHelper');
const { getUrl } = require('./service-helper');

class TeamsServiceImpl {

    retrieveActiveTeamsForServer(expectedServerName) {
        return httpCall(getUrl(), `/api/teams/${encodeURI(expectedServerName)}`, 'GET');
    }

    async postForNewTeam(id, serverName, tournamentName, tournamentDay, startTime) {
        return httpCall(getUrl(), `/api/team`, 'POST', {
            id: id,
            serverName: serverName,
            tournamentName: tournamentName,
            tournamentDay: tournamentDay,
            startTime: startTime
        })
    }

    async postForTeamRegistration(id, teamName, serverName, tournamentName, tournamentDay) {
        return httpCall(getUrl(), `/api/team/register`, 'POST', {
            id: id,
            teamName: teamName,
            serverName: serverName,
            tournamentName: tournamentName,
            tournamentDay: tournamentDay
        })
    }

    async deleteFromTeam(id, serverName, tournamentName, tournamentDay) {
        return httpCall(getUrl(), `/api/team/register`, 'DELETE', {
            id: id,
            serverName: serverName,
            tournamentName: tournamentName,
            tournamentDay: tournamentDay
        })
    }

}

module.exports = new TeamsServiceImpl;
