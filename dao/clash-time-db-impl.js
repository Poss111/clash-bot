const dynamoDbHelper = require('./impl/dynamo-db-helper');
const Joi = require('joi');

class ClashTimeDbImpl {

    clashTimesTable;
    tableName = 'clashtime';

    initialize() {
        return new Promise((resolve, reject) => {
            dynamoDbHelper
                .initialize(this.tableName, {
                    hashKey: 'key',
                    timestamps: true,
                    schema: {
                        key: Joi.string(),
                        startTime: Joi.string(),
                        tournamentName: Joi.string(),
                        tournamentDay: Joi.string(),
                        registrationTime: Joi.string()
                    }
                })
                .then((tableDef) => {
                    console.log(`Successfully setup table def for ('${this.tableName}')`);
                    this.clashTimesTable = tableDef;
                    resolve(tableDef);
                }).catch(err => reject(err));
        });
    }

    retrieveTournaments() {
        return new Promise((resolve, reject) => {
            let clashTimes = [];
            let stream = this.clashTimesTable.scan().exec();
            stream.on('readable', function () {
                let read = stream.read();
                if (read) {
                    read.Items.forEach(data => {
                        clashTimes.push(data.attrs)
                    });
                }
            });
            stream.on('end', function () {
                clashTimes.sort((a, b) => parseInt(a.tournamentDay) - parseInt(b.tournamentDay));
                resolve(clashTimes);
            });
            stream.on('error', (err) => reject(err));
        })
    }
}

module.exports = new ClashTimeDbImpl;
