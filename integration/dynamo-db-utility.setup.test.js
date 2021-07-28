const clashTimeDb = require('../dao/clash-time-db-impl');
const clashTeamsDb = require('../dao/clash-teams-db-impl');
const clashSubscriptionDb = require('../dao/clash-subscription-db-impl');
const clashTimesData = require('./mock-data/clash-times-sample-data');
const clashTeamsData = require('./mock-data/clash-teams-sample-data');
const clashSubscriptionData = require('./mock-data/clash-subscriptions-sample-data');

process.env.INTEGRATION_TEST = true;

let createdTables = new Map();

let loadAllTables = () => new Promise((resolve, reject) => {
    Promise.all([
        persistSampleData(clashTimeDb, clashTimesData),
        persistSampleData(clashTeamsDb, clashTeamsData),
        persistSampleData(clashSubscriptionDb, clashSubscriptionData)])
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

function persistSampleData(module, data) {
    return new Promise((resolve, reject) => {
        module.initialize().then(table => {
            cleanUpTable(module.tableName, table).then(() => {
                table.createTable((err) => {
                    if (err) console.error(`Failed to create ${module.tableName}.`, err);
                    else {
                        let successful = 0;
                        let failed = 0;
                        let dataPersisted = [];
                        data.Items.forEach(recordToInsert => {
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
            }).catch(console.error(`Failed to delete table ('${module.tableName}')`));
        }).catch(err => console.error(`Failed to load data for ('${module.tableName}').`, err));
    })
}

function cleanUpTable(tableName, table) {
    return new Promise((resolve) => {
        table.deleteTable((err) => {
            if (err) console.error('Table was unable to be deleted.', err);
            resolve(`Successfully deleted ${tableName}.`);
        })
    });
}

function clearAllTables() {
    createdTables.forEach((record, key) => cleanUpTable(key.tableName, record.table)
        .then(data => console.log(data))
        .catch(err => console.error(err)));
}

module.exports.loadAllTables = loadAllTables;
module.exports.clearAllTables = clearAllTables;
