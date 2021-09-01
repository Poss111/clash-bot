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

    async postForNewTeam(id, serverName, tournamentName, tournamentDay, startTime) {
        return httpCall('localhost', `/api/team`, 'POST', {
            id: id,
            serverName: serverName,
            tournamentName: tournamentName,
            tournamentDay: tournamentDay,
            startTime: startTime
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

        if (options.method === 'POST') {
            req.write(convertedPayload);
        }
        req.end();
    });
}

module.exports = new TeamsServiceImpl;
