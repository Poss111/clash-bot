const moment = require('moment-timezone');
const https = require('https');

class LeagueApi {

    leagueTimes;

    constructor() {
        this.leagueTimes = [];
    }

    initializeLeagueData() {
        return new Promise((resolve, reject) => {
            const options = {
                host: 'na1.api.riotgames.com',
                path: '/lol/clash/v1/tournaments',
                method: 'GET',
                headers: {
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Riot-Token': process.env.RIOT_TOKEN,
                    'Origin': 'https://developer.riotgames.com',
                }
            };
            if (!process.env.RIOT_TOKEN) {
                reject(`RIOT_TOKEN not found.`)
            } else if (!process.env.TOKEN) {
                reject(`TOKEN not found.`)
            } else {
                https.request(options, function (response) {
                    let str = ''
                    response.on('data', function (chunk) {
                        str += chunk;
                    });

                    response.on('end', function () {
                        if (response.statusCode !== 200) {
                            reject(`Failed to retrieve league Clash API data due to => ${str}`);
                        } else {
                            let parse = JSON.parse(str);
                            let data = [];
                            const dateFormat = 'MMMM DD yyyy hh:mm a z';
                            const timeZone = 'America/Los_Angeles';
                            moment.tz.setDefault(timeZone);
                            parse.forEach((tourney) => {
                                data.push({
                                    name: tourney.nameKey,
                                    nameSecondary: tourney.nameKeySecondary,
                                    startTime: new moment(tourney.schedule[0].startTime),
                                    registrationTime: new moment(tourney.schedule[0].registrationTime)
                                });
                            });
                            data.sort((dateOne, dateTwo) => dateOne.startTime.diff(dateTwo.startTime));
                            data.forEach((data) => {
                                data.startTime = data.startTime.format(dateFormat);
                                data.registrationTime = data.registrationTime.format(dateFormat);
                            });
                            console.log('League Clash times loaded.');
                            resolve(data);
                        }
                    });

                    response.on('error', function (err) {
                        console.error('Failed to make request', err);
                        reject(err);
                    });
                }).end();
            }
        });
    }

    findTournament(tournamentName, dayNumber) {
        tournamentName = tournamentName.toLowerCase();
        let filter = (data) => data.name.toLowerCase().includes(tournamentName);
        if (dayNumber) {
            filter = (data) => data.name.toLowerCase().includes(tournamentName) && data.nameSecondary.includes(dayNumber);
        }
        let foundData = this.getLeagueTimes().filter(filter);
        if (foundData.length !== 0) {
            return foundData[0];
        }
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

module.exports = new LeagueApi;
