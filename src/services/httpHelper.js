const axios = require('axios');
const logger = require('pino')();

let httpCall = (hostname, path, method, payload) => {
    return new Promise((resolve, reject) => {
        let headers = {};
        headers[process.env.HEADER_KEY] = 'freljord';
        axios({
            method: method,
            url: hostname + path,
            data: payload,
            timeout: 10000,
            headers: headers
        }).then(response => {
            logger.info(`hostname: ('${hostname}') path: ('${path}') method: ('${method}') statusCode: ('${response.status}')`);
            logger.debug(`Path: ${path} Response: ${JSON.stringify(response.data)}`);
            resolve(response.data);
        }).catch(err => {
            if (err.response && err.response.status === 400) {
                logger.warn(`hostname: ('${hostname}') path: ('${path}') method: ('${method}') statusCode: ('${err.code}') message: ('${JSON.stringify(err.response.data)})')`);
                resolve(err.response.data);
            } else {
                logger.error(`hostname: ('${hostname}') path: ('${path}') method: ('${method}') statusCode: ('${err.code}')`);
                reject(err.message);
            }
        })
    });
}

module.exports.httpCall = httpCall;
