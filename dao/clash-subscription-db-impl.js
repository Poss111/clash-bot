const dynamoDbHelper = require('./impl/dynamo-db-helper');
const Joi = require('joi');
const moment = require('moment-timezone');

class ClashSubscriptionDbImpl {

    clashSubscriptionTable;
    tableName = 'clash-registered-user';

    initialize() {
        return new Promise((resolve, reject) => {
            dynamoDbHelper.initialize(this.tableName, {
                hashKey: 'key',
                timestamps: true,
                schema: {
                    key: Joi.string(),
                    serverName: Joi.string(),
                    timeAdded: Joi.string()
                }
            }).then((tableDef) => {
                console.log(`Successfully setup table def for ('${this.tableName}')`);
                this.clashSubscriptionTable = tableDef;
                resolve(tableDef);
            }).catch(err => reject(err));
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
