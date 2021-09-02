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
            if (err.response && err.response.status === 400) {
                console.log(`path: ('${path}') method: ('${method}') statusCode: ('${err.code}') message: ('${JSON.stringify(err.response.data)})')`);
                resolve(err.response.data);
            } else {
                console.log(`path: ('${path}') method: ('${method}') statusCode: ('${err.code}')`);
                reject(err.message);
            }
        })
    });
}

module.exports.httpCall = httpCall;
