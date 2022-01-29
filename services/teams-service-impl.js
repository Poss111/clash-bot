const {httpCall} = require('./httpHelper');
const { getUrl } = require('./service-helper');

class TeamsServiceImpl {

    retrieveActiveTeamsForServer(expectedServerName) {
        return httpCall(getUrl(), `/v2/api/teams/${encodeURI(expectedServerName)}`, 'GET');
    }

    async postForNewTeam(id, role, serverName, tournamentName, tournamentDay, startTime) {
        return httpCall(getUrl(), `/v2/api/team`, 'POST', {
            id: id,
            role: role,
            serverName: serverName,
            tournamentName: tournamentName,
            tournamentDay: tournamentDay,
            startTime: startTime
        })
    }

    async postForTeamRegistration(id, role, teamName, serverName, tournamentName, tournamentDay) {
        return httpCall(getUrl(), `/v2/api/team/register`, 'POST', {
            id: id,
            role: role,
            teamName: teamName,
            serverName: serverName,
            tournamentName: tournamentName,
            tournamentDay: tournamentDay
        })
    }

    async deleteFromTeam(id, serverName, tournamentName, tournamentDay) {
        return httpCall(getUrl(), `/v2/api/team/register`, 'DELETE', {
            id: id,
            serverName: serverName,
            tournamentName: tournamentName,
            tournamentDay: tournamentDay
        })
    }

}

module.exports = new TeamsServiceImpl;
