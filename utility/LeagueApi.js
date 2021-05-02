const moment = require('moment');
const http = require('https');
const RIOT_TOKEN = process.env.RIOT_TOKEN;

class LeagueApi {

    leagueTimes;

    constructor() {
        this.initializeLeagueData();
    }

    initializeLeagueData() {
        try {
            let promise = new Promise((resolve, reject) => {
                const options = {
                    host: 'na1.api.riotgames.com',
                    path: '/lol/clash/v1/tournaments',
                    method: 'GET',
                    headers: {
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Riot-Token': RIOT_TOKEN,
                        'Origin': 'https://developer.riotgames.com',
                    }
                };
                http.request(options, function (response) {
                    let str = ''
                    response.on('data', function (chunk) {
                        str += chunk;
                    });

                    response.on('end', function () {
                        let parse = JSON.parse(str);
                        let data = [];
                        const dateFormat = 'MMMM DD yyyy hh:mm a';
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
                        })
                        console.log('League Clash times loaded.')
                        resolve(data)
                    });

                    response.on('error', function (err) {
                        console.error('Failed to make request', err)
                        reject(err);
                    })
                }).end();
            });
            promise.then(data => this.leagueTimes = data).catch(err => console.error(err));
        } catch (error) {
            console.error('Failed to make request.', error)
        }
    }

    getLeagueTimes() {
        return JSON.parse(JSON.stringify(this.leagueTimes));
    }
}

module.exports = new LeagueApi;
