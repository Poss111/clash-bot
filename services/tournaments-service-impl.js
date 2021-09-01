const http = require('http');

class TournamentsServiceImpl {
    retrieveAllActiveTournaments() {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 80,
                path: `/api/tournaments`,
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
        })
    }
}

module.exports = new TournamentsServiceImpl;
