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
                        timeAdded: Joi.string(),
                        subscribed: Joi.boolean(),
                        preferredChampions: Joi.array()
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
                timeAdded: new moment().format(dateFormat),
                subscribed: true
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
            this.clashSubscriptionTable.update({key: id, subscribed: false},
                (err, data) => {
                    if (err) reject(err);
                    else {
                        console.log(`Successfully deleted subscription for ('${JSON.stringify(data)}').`);
                        resolve(data);
                    }
                })
        });
    }

    updatePreferredChampions(id, champion) {
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
                        console.log(`Successfully updated record ('${JSON.stringify(data)}')`);
                        resolve(data);
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
                        preferredChampions: [champion]
                    };
                    this.clashSubscriptionTable.create(subscription, (err, dataPersisted) => {
                        if (err) reject(err);
                        console.log(`Successfully persisted record ('${JSON.stringify(dataPersisted)}')`);
                        resolve(dataPersisted);
                    })
                }
            });
        });
    }


    retrieveUserDetails(id) {
        return new Promise((resolve, reject) => {
            console.log(`Retrieving User Details for id ('${id}')`);
            this.clashSubscriptionTable.query(id, (err, data) => {
                if (err) reject(err);
                if (!data) {
                    resolve({});
                }
                resolve(data);
            });
        });
    }
}

module.exports = new ClashSubscriptionDbImpl;
