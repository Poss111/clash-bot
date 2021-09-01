const http = require('http');

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
            console.log(`path: ('${options.path}') method: ('${options.method}') statusCode: ('${res.statusCode}')`);

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

module.exports.httpCall = httpCall;
