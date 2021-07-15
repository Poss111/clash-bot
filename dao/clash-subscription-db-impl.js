const dynamodb = require('dynamodb');
const Joi = require('joi');

class ClashSubscriptionDbImpl {

    clashSubscriptionTable;
    tableName = 'clash-registered-user';

    initialize() {
        return new Promise((resolve, reject) => {
            try {
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
                    hashKey: 'userId',
                    timestamps: true,
                    schema: {
                        userId: Joi.string(),
                        serverName: Joi.string()
                    }
                });
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }

    subscribe(id, server) {
        return new Promise((resolve, reject) => {
            let subscription = {
                userId: id,
                serverName: server
            };
            this.clashSubscriptionTable.create(subscription, (err, data) => {
                if (err) reject(err);
                else console.log(`Successfully saved subscription => ${JSON.stringify(data)}`);
            })
            resolve(subscription);
        });
    }

    unsubscribe(id, server) {
        return new Promise((resolve, reject) => {
            let subscription = {
                userId: id,
                serverName: server
            };
            this.clashSubscriptionTable.delete(subscription, (err, data) => {
                if (err) reject(err);
                else console.log(`Successfully deleted subscription.`);
            })
            resolve(subscription);
        });
    }
}

module.exports = new ClashSubscriptionDbImpl;
