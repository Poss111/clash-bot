const {httpCall} = require('./httpHelper');
const { getUrl } = require('./service-helper');

class TournamentsServiceImpl {
    retrieveAllActiveTournaments() {
        return httpCall(getUrl(), '/api/tournaments', 'GET');
    }
}

module.exports = new TournamentsServiceImpl;
