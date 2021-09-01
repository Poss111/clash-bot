const http = require('http');

class TeamsServiceImpl {

    retrieveActiveTeamsForServer(expectedServerName) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 80,
                path: `/api/teams/${encodeURI(expectedServerName)}`,
                method: 'GET'
            }

            const req = http.request(options, res => {
                console.log(`statusCode: ${res.statusCode}`)

                res.on('data', d => {
                    let response = JSON.parse(d);
                    if (res.statusCode !== 200) {
                        response.statusCode = res.statusCode;
                        reject(response);
                    } else {
                        resolve(response);
                    }
                })
            })

            req.on('error', error => {
                console.error(error)
                reject(error);
            })

            req.end()
        });
    }

    postForNewTeam(id, serverName, tournamentName, tournamentDay, startTime) {
        return new Promise((resolve, reject) => {
            const payload = JSON.stringify({
                id: id,
                serverName: serverName,
                tournamentName: tournamentName,
                tournamentDay: tournamentDay,
                startTime: startTime
            })

            const options = {
                hostname: 'localhost',
                port: 80,
                path: `/api/teams`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': payload.length
                }
            }

            const req = http.request(options, res => {
                console.log(`statusCode: ${res.statusCode}`)

                res.on('data', d => {
                    let response = JSON.parse(d);
                    if (res.statusCode !== 200) {
                        response.statusCode = res.statusCode;
                        reject(response);
                    } else {
                        resolve(response);
                    }
                })
            })

            req.on('error', error => {
                console.error(error)
                reject(error);
            })

            req.write(payload);
            req.end();
        });
    }

}

module.exports = new TeamsServiceImpl;
