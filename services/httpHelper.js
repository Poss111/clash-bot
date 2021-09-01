const axios = require('axios');

let httpCall = (hostname, path, method, payload) => {
    return new Promise((resolve, reject) => {
        axios({
            method: method,
            url: path,
            data: payload
        }).then(response => {
            console.log(`path: ('${path}') method: ('${method}') statusCode: ('${response.status}')`);
            resolve(response.data);
        }).catch(err => {
            console.log(`path: ('${path}') method: ('${method}') statusCode: ('${err.response.status}') message: ('${JSON.stringify(err.response.data)})')`);
            if (err.response.status === 400) {
                resolve(err.response.data);
            } else {
                reject(err.message);
            }
        })
    });
}

module.exports.httpCall = httpCall;
