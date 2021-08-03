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

    findTournament(tournamentName, dayNumber) {
        let filter;
        if (tournamentName) {
            tournamentName = tournamentName.toLowerCase()
            filter = (data) => data.tournamentName.toLowerCase().includes(tournamentName)
                && new Date(data.startTime) > new Date();
            if (tournamentName && !isNaN(dayNumber)) {
                filter = (data) => data.tournamentName.toLowerCase().includes(tournamentName)
                    && data.tournamentDay.includes(dayNumber)
                    && new Date(data.startTime) > new Date();
            }
        } else {
            filter = (data) => new Date(data.startTime) > new Date();
        }
        return new Promise((resolve, reject) => {
            this.retrieveTournaments()
                .then(data => resolve(data.filter(filter)))
                .catch((err) => reject(err));
        });
    }

}

module.exports = new ClashTimeDbImpl;
