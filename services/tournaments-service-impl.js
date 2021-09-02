const {httpCall} = require('./httpHelper');


class TournamentsServiceImpl {
    retrieveAllActiveTournaments() {
        return httpCall('localhost', '/api/tournaments', 'GET');
    }
}

module.exports = new TournamentsServiceImpl;
