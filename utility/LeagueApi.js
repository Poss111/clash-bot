const moment = require('moment');
const http = require('https');
const RIOT_TOKEN = process.env.RIOT_TOKEN;

class LeagueApi {

    leagueTimes;

    constructor() {
        this.getLeagueClashTimes();
    }

    getLeagueClashTimes() {
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
        try {
            let clientRequest = http.request(options, function(response) {
                let str = ''
                response.on('data', function (chunk) {
                    str += chunk;
                });

                response.on('end', function () {
                    let parse = JSON.parse(str);
                    parse.forEach((tourney) => {
                        this.leagueTimes = [];
                        this.leagueTimes.push(new moment(tourney.schedule[0].startTime))
                    });
                    this.leagueTimes.sort((dateOne, dateTwo) => dateOne - dateTwo);
                });

                response.on('error', function (err) {
                    console.error('Failed to make request', err)
                })
            });
            clientRequest.end();
        } catch(error) {
            console.error('Failed to make request.', error)
        }
    }

    getLeagueTimes() {
        return JSON.parse(JSON.stringify(this.leagueTimes));
    }
}

module.exports = new LeagueApi;
