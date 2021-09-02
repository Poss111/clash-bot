const {httpCall} = require('./httpHelper');
const queryString = require('query-string');

class UserServiceImpl {

    getUserDetails(id) {
        const queryParams = { id: id };
        return httpCall('localhost', `/api/user?${queryString.stringify(queryParams)}`, 'GET');
    }

    postUserDetails(id, playerName, serverName, preferredChampions, subscriptions) {
        return httpCall('localhost', '/api/user', 'POST', {
            id: id,
            playerName: playerName,
            serverName: serverName,
            preferredChampions: preferredChampions,
            subscriptions: subscriptions
        });
    }

    async postVerifyUser(id, playerName, serverName) {
        return httpCall('localhost', '/api/user/verify', 'POST', {
            id: id,
            username: playerName,
            serverName: serverName
        });
    }
}

module.exports = new UserServiceImpl;
