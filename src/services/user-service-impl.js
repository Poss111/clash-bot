const {httpCall} = require('./httpHelper');
const { getUrl } = require('./service-helper');
const queryString = require('query-string');

class UserServiceImpl {

    getUserDetails(id) {
        const queryParams = { id: id };
        return httpCall(getUrl(), `/api/user?${queryString.stringify(queryParams)}`, 'GET');
    }

    postUserDetails(id, playerName, serverName, preferredChampions, subscriptions) {
        return httpCall(getUrl(), '/api/user', 'POST', {
            id: id,
            playerName: playerName,
            serverName: serverName,
            preferredChampions: preferredChampions,
            subscriptions: subscriptions
        });
    }

    async postVerifyUser(id, playerName, serverName) {
        return httpCall(getUrl(), '/api/user/verify', 'POST', {
            id: id,
            username: playerName,
            serverName: serverName
        });
    }
}

module.exports = new UserServiceImpl;
