const {httpCall} = require('./httpHelper');
const queryString = require('query-string');

class TentativeServiceImpl {

    retrieveTentativeListForServer(serverName) {
        const queryParams = {serverName: serverName};
        return httpCall('localhost', `/api/tentative?${queryString.stringify(queryParams)}`, 'GET');
    }

    postTentativeUpdateForServerAndTournament(id, serverName, tournamentName, tournamentDay) {
        const payload = {
            id: id,
            serverName: serverName,
            tournamentDetails: {
                tournamentName: tournamentName,
                tournamentDay: tournamentDay
            }
        };
        return httpCall('localhost', `/api/tentative`, 'POST', payload);
    }

}

module.exports = new TentativeServiceImpl;
