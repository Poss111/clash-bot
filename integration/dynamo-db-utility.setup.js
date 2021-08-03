const clashTimeDb = require('../dao/clash-time-db-impl');
const clashTeamsDb = require('../dao/clash-teams-db-impl');
const clashSubscriptionDb = require('../dao/clash-subscription-db-impl');
const clashTimesData = require('./mock-data/clash-times-sample-data');
const clashTeamsData = require('./mock-data/clash-teams-sample-data');
const clashSubscriptionData = require('./mock-data/clash-subscriptions-sample-data');
const templateBuilder = require('../utility/template-builder');
const moment = require('moment-timezone');

process.env.INTEGRATION_TEST = true;

let createdTables = new Map();

let loadAllTables = async () => new Promise((resolve, reject) => {
    const dateFormat = 'MMMM DD yyyy hh:mm a z';
    let currentDate = new moment();
    let formattedCurrentDate = currentDate.add(1, 'hour').format(dateFormat);
    let currentDatePlusOne = currentDate.add(1, 'day').format(dateFormat);
    let currentDatePlusTwo = currentDate.add(2, 'day').format(dateFormat);
    let currentDatePlusThree = currentDate.add(3, 'day').format(dateFormat);
    let overrides = {
        tournamentName: 'awesome_sauce',
        currentDate: formattedCurrentDate,
        tournamentDayOne: '1',
        datePlusOneDay: currentDatePlusOne,
        tournamentDayTwo: '2',
        datePlusTwoDays: currentDatePlusTwo,
        tournamentDayThree: '3',
        datePlusThreeDays: currentDatePlusThree,
        tournamentDayFour: '4',
        serverName: 'Integration Server'
    }
    console.log(`Dynamic Data for Integration Tests : ${JSON.stringify(overrides)}`);
    let clashTimesDynamicData = templateBuilder.buildMessage(clashTimesData, overrides);
    let clashTeamDynamicData = templateBuilder.buildMessage(clashTeamsData, overrides);
    let clashSubscriptionDynamicData = templateBuilder.buildMessage(clashSubscriptionData, overrides);
    Promise.all([
        persistSampleData(clashTimeDb, clashTimesDynamicData),
        persistSampleData(clashTeamsDb, clashTeamDynamicData),
        persistSampleData(clashSubscriptionDb, clashSubscriptionDynamicData)])
        .then(results => {
            results.forEach(table => {
                createdTables.set(table.tableName, {
                    table: table.table,
                    dataPersisted: table.data
                })
            });
            let keys = [];
            for (const key of createdTables.keys()) {
                keys.push(key);
            }
            console.log(`Built: ${JSON.stringify(keys)}`);
            resolve(createdTables);
        }).catch(err => {
        console.error('Failed to load table data.', err);
        reject(err);
    });
});

function getAllDataFromTable(table) {
    return new Promise((resolve, reject) => {
        table.scan().exec((err, data) => {
            if (err) reject(err);
            else {
                let results = [];
                data.Items.forEach(record => {
                    results.push(record.attrs);
                })
                resolve(results);
            }
        });
    })
}

function persistSampleData(module, data) {
    return new Promise((resolve, reject) => {
        module.initialize().then(table => {
            cleanUpTable(module.tableName, table).then(() => {
                console.log(`Creating table ('${module.tableName}')...`);
                table.createTable((err) => {
                    if (err) console.error(`Failed to create ${module.tableName}.`, err);
                    else {
                        let successful = 0;
                        let failed = 0;
                        let dataPersisted = [];
                        console.log(`Successfully created table ('${module.tableName}').`);
                        data.Items.forEach(recordToInsert => {
                            console.debug(`Inserting record into ('${module.tableName}')...`);
                            table.create(recordToInsert, (err) => {
                                if (err) {
                                    console.error(`Failed to load data`, err);
                                    failed++;
                                } else {
                                    dataPersisted.push(recordToInsert);
                                    successful++;
                                }
                                if (data.Items.length === (failed + successful)) {
                                    console.log(`Loaded ('${successful}') records into ('${module.tableName}')`);
                                    resolve({tableName: module.tableName, table: table, data: dataPersisted});
                                } else if (data.Items.length === failed) {
                                    console.error(`Failed to load all data into table ('${module.tableName}')`);
                                    reject(new Error('Failed to load data'));
                                }
                            });
                        })
                    }
                })
            }).catch(err => console.error(`Failed to delete table ('${module.tableName}')`, err));
        }).catch(err => console.error(`Failed to load data for ('${module.tableName}').`, err));
    })
}

function cleanUpTable(tableName, table) {
    return new Promise((resolve) => {
        console.log(`Attempting to delete table ('${tableName}')...`);
        // table.deleteTable((err) => {
        //     if (err) console.error('Table was unable to be deleted.', err);
            resolve(`Successfully deleted ${tableName}.`);
        // })
    });
}

function clearAllTables() {
    createdTables.forEach((record, key) => cleanUpTable(key.tableName, record.table)
        .then(data => console.log(data))
        .catch(err => console.error(err)));
}

module.exports.loadAllTables = loadAllTables;
module.exports.getAllDataFromTable = getAllDataFromTable;
module.exports.clearAllTables = clearAllTables;
