const axios = require('axios');

let httpCall = (hostname, path, method, payload) => {
    return new Promise((resolve, reject) => {
        axios({
            method: method,
            url: hostname + path,
            data: payload,
            timeout: 10000
        }).then(response => {
            console.log(`hostname: ('${hostname}') path: ('${path}') method: ('${method}') statusCode: ('${response.status}')`);
            resolve(response.data);
        }).catch(err => {
            if (err.response && err.response.status === 400) {
                console.warn(`hostname: ('${hostname}') path: ('${path}') method: ('${method}') statusCode: ('${err.code}') message: ('${JSON.stringify(err.response.data)})')`);
                resolve(err.response.data);
            } else {
                console.error(`hostname: ('${hostname}') path: ('${path}') method: ('${method}') statusCode: ('${err.code}')`);
                reject(err.message);
            }
        })
    });
}

module.exports.httpCall = httpCall;
