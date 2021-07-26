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
                    timeAdded: Joi.string(),
                    subscribed: Joi.string(),
                    preferredChampions: Joi.array()
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
                timeAdded: new moment().format(dateFormat),
                subscribed: 'true'
            };
            this.updateUser(subscription, reject, resolve);
        });
    }

    updateUser(subscription, reject, resolve) {
        this.clashSubscriptionTable.create(subscription, (err, data) => {
            if (err) reject(err);
            else {
                console.log(`Successfully saved subscription => ${JSON.stringify(data)}`);
                resolve(subscription);
            }
        })
    }

    unsubscribe(id) {
        return new Promise((resolve, reject) => {
            this.clashSubscriptionTable.update({key: id, subscribed: ''},
                (err, data) => {
                    if (err) reject(err);
                    else {
                        console.log(`Successfully deleted subscription for ('${JSON.stringify(data)}').`);
                        resolve(data);
                    }
                })
        });
    }

    updatePreferredChampions(id, champion, serverName) {
        return new Promise((resolve, reject) => {
            this.retrieveUserDetails(id).then(userData => {
                if (userData.key) {
                    console.log(`Updating user preferences id ('${id}') champions ('${champion}')`);

                    if (Array.isArray(userData.preferredChampions) && userData.preferredChampions.includes(champion)) {
                        userData.preferredChampions = userData.preferredChampions.filter(championName => championName !== champion);
                    } else {
                        Array.isArray(userData.preferredChampions) ? userData.preferredChampions.push(champion) : userData.preferredChampions = [champion];
                    }

                    this.clashSubscriptionTable.update(userData, (err, data) => {
                        if (err) reject(err);
                        else {
                            console.log(`Successfully updated record ('${JSON.stringify(data.attrs)}')`);
                            resolve(data.attrs);
                        }
                    });
                } else {
                    console.log(`Creating user preferences id ('${id}') champions ('${champion}')`);
                    const dateFormat = 'MMMM DD yyyy hh:mm a z';
                    const timeZone = 'America/Los_Angeles';
                    moment.tz.setDefault(timeZone);
                    let subscription = {
                        key: id,
                        timeAdded: new moment().format(dateFormat),
                        subscribed: false,
                        preferredChampions: [champion],
                        serverName: serverName
                    };
                    this.clashSubscriptionTable.create(subscription, (err, dataPersisted) => {
                        if (err) reject(err);
                        else {
                            console.log(`Successfully persisted record ('${JSON.stringify(dataPersisted.attrs)}')`);
                            resolve(dataPersisted.attrs);
                        }
                    })
                }
            });
        });
    }


    retrieveUserDetails(id) {
        return new Promise((resolve, reject) => {
            console.log(`Retrieving User Details for id ('${id}')`);
            this.clashSubscriptionTable.query(id).exec((err, data) => {
                if (err) reject(err);
                if (!data.Items[0]) {
                    resolve({});
                } else {
                    resolve(data.Items[0].attrs);
                }
            });
        });
    }
}

module.exports = new ClashSubscriptionDbImpl;
