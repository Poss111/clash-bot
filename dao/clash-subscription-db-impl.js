const dynamodb = require('dynamodb');

class ClashSubscriptionDbImpl {

    clashSubscriptionTable;
    tableName = 'clash-registered-user';

    initialize() {
        return new Promise((resolve, reject) => {
            if (process.env.LOCAL) {
                console.log('Loading credentials from local.');
                dynamodb.AWS.config.loadFromPath('./credentials.json');
            } else {
                console.log('Loading credentials from remote.');
                dynamodb.AWS.config.update({
                    region: `${process.env.REGION}`
                });
            }
            this.clashSubscriptionTable = dynamodb.define(this.tableName, {
                hashKey: 'userId'
            });
        });
    }

    subscribe(id, server) {
        return new Promise((resolve, reject) => {
           resolve({id: id, server: server});
        });
    }

    unsubscribe(id, server) {
        return new Promise((resolve, reject) => {
            resolve({id: id, server: server});
        });
    }
}

module.exports = new ClashSubscriptionDbImpl;
