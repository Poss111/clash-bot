const dynamodb = require('dynamodb');
const Joi = require('joi');
const moment = require('moment-timezone');

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
                    hashKey: 'key',
                    timestamps: true,
                    schema: {
                        key: Joi.string(),
                        serverName: Joi.string(),
                        timeAdded: Joi.string()
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
            const dateFormat = 'MMMM DD yyyy hh:mm a z';
            const timeZone = 'America/Los_Angeles';
            moment.tz.setDefault(timeZone);
            let subscription = {
                key: id,
                serverName: server,
                timeAdded: new moment().format(dateFormat)
            };
            this.clashSubscriptionTable.create(subscription, (err, data) => {
                if (err) reject(err);
                else {
                    console.log(`Successfully saved subscription => ${JSON.stringify(data)}`);
                    resolve(subscription);
                }
            })
        });
    }

    unsubscribe(id) {
        return new Promise((resolve, reject) => {
            this.clashSubscriptionTable.destroy(id,
                {ReturnValues: 'ALL_OLD'}, (err, data) => {
                if (err) reject(err);
                else {
                    console.log(`Successfully deleted subscription for ('${JSON.stringify(data)}').`);
                    resolve(data);
                }
            })
        });
    }
}

module.exports = new ClashSubscriptionDbImpl;
