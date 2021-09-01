const {httpCall} = require('./httpHelper');
const queryString = require('query-string');

class UserServiceImpl {

    getUserDetails(id) {
        const queryParams = { id: id };
        return httpCall('localhost', `/api/user?${queryString.stringify(queryParams)}`, 'GET');
    }

    postUserDetails(id, playerName, serverName, preferredChampions, subscriptions) {
        const payload = {
            id: id,
            playerName: playerName,
            serverName: serverName,
            preferredChampions: preferredChampions,
            subscriptions: subscriptions
        };
        return httpCall('localhost', '/api/user', 'POST', payload);
    }
}

module.exports = new UserServiceImpl;
