const http = require('http');

class TeamsServiceImpl {

    retrieveActiveTeamsForServer(expectedServerName) {
        return httpCall('localhost', `/api/teams/${encodeURI(expectedServerName)}`, 'GET');
    }

    async postForNewTeam(id, serverName, tournamentName, tournamentDay, startTime) {
        return httpCall('localhost', `/api/team`, 'POST', {
            id: id,
            serverName: serverName,
            tournamentName: tournamentName,
            tournamentDay: tournamentDay,
            startTime: startTime
        })
    }

    async postForTeamRegistration(id, teamName, serverName, tournamentName, tournamentDay) {
        return httpCall('localhost', `/api/team/register`, 'POST', {
            id: id,
            teamName: teamName,
            serverName: serverName,
            tournamentName: tournamentName,
            tournamentDay: tournamentDay
        })
    }

    async deleteFromTeam(id, teamName, serverName, tournamentName, tournamentDay) {
        return httpCall('localhost', `/api/team/register`, 'DELETE', {
            id: id,
            teamName: teamName,
            serverName: serverName,
            tournamentName: tournamentName,
            tournamentDay: tournamentDay
        })
    }

}

let httpCall = (hostname, path, method, payload) => {
    return new Promise((resolve, reject) => {
        let convertedPayload = undefined;
        if (payload) {
            convertedPayload = JSON.stringify(payload)
        }

        let options = {
            hostname: hostname,
            port: 80,
            path: path,
            method: method
        }

        if (convertedPayload) {
            options.headers = {
                'Content-Type': 'application/json',
                'Content-Length': convertedPayload.length
            }
        }

        const req = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)

            res.on('data', d => {
                let response = JSON.parse(d);
                if (![200,400].includes(res.statusCode)) {
                    response.statusCode = res.statusCode;
                    reject(response);
                } else {
                    if (res.statusCode === 400) {
                        console.error(JSON.stringify(response));
                    }
                    resolve(response);
                }
            })
        })

        req.on('error', error => {
            console.error(error)
            reject(error);
        })

        if (['POST','DELETE'].includes(options.method)) {
            req.write(convertedPayload);
        }
        req.end();
    });
}

module.exports = new TeamsServiceImpl;
