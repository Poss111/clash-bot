const http = require('http');
const queryString = require('query-string');

class TentativeServiceImpl {

    retrieveTentativeListForServer(serverName) {
        return new Promise((resolve, reject) => {
            const queryParams = {serverName: serverName};
            const options = {
                hostname: 'localhost',
                port: 80,
                path: `/api/tentative?${queryString.stringify(queryParams)}`,
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
}

module.exports = new TentativeServiceImpl;
