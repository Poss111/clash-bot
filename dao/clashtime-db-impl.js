const dynamodb = require('dynamodb');

class ClashTimeDbImpl {

    clashTimesTable;
    leagueTimes;

    constructor() {
        this.leagueTimes = [];
    }

    initializeLeagueData() {
        let tableName = 'clashtime';
        return new Promise((resolve, reject) => {
            if (!process.env.TOKEN) {
                reject(`TOKEN not found.`)
            } else {
                if (process.env.LOCAL) {
                    console.log('Loading credentials from local.');
                    dynamodb.AWS.config.loadFromPath('./credentials.json');
                    tableName = `${tableName}`;
                } else {
                    console.log('Loading credentials from remote.');
                    dynamodb.AWS.config.update({
                        accessKeyId: `${process.env.ACCESS_ID}`,
                        secretAccessKey: `${process.env.ACCESS_KEY}`,
                        region: `${process.env.REGION}`
                    });
                }
                this.clashTimesTable = dynamodb.define(tableName, {
                    hashKey: 'key'
                });
                let clashTimes = [];
                let stream = this.clashTimesTable.scan().exec();
                stream.on('readable', function() {
                    let read = stream.read();
                    if (read) {
                        read.Items.forEach(data => {
                            clashTimes.push(data.attrs)
                        });
                    }
                });
                stream.on('end', function () {
                    clashTimes.sort((a,b) => parseInt(a.tournamentDay) - parseInt(b.tournamentDay));
                    resolve(clashTimes);
                });
                stream.on('error', (err) => reject(err));
            }
        });
    }

    findTournament(tournamentName, dayNumber) {
        let filter;
        if (tournamentName) {
            tournamentName = tournamentName.toLowerCase()
            filter = (data) => data.tournamentName.toLowerCase().includes(tournamentName)
                && new Date(data.startTime) > new Date();
            if (tournamentName && dayNumber) {
                filter = (data) => data.tournamentName.toLowerCase().includes(tournamentName)
                    && data.tournamentDay.includes(dayNumber)
                    && new Date(data.startTime) > new Date();
            }
        } else {
            filter = (data) => new Date(data.startTime) > new Date();
            return this.getLeagueTimes().filter(filter);
        }
        return this.getLeagueTimes().filter(filter);
    }

    setLeagueTimes(times) {
        if (times) {
            times.forEach((value) => {
                this.leagueTimes.push(value);
            });
        }
    }

    getLeagueTimes() {
        return JSON.parse(JSON.stringify(this.leagueTimes));
    }

}

module.exports = new ClashTimeDbImpl;
