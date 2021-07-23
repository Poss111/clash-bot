
const http = require('http');

class DdragonService {
    getChampions() {
        return new Promise((resolve, reject) => {

            this.getLatestVersion().then((version) => {
                const params = {
                    hostname: 'ddragon.leagueoflegends.com',
                    path: `/cdn/${version}/data/en_US/champion.json`
                };
                http.get(params, (res) => {
                    let data = [];
                    if (res.statusCode !== 200) {
                        reject('Failed to pull data.');
                    }

                    res.on('data', (chunk) => {
                        data.push(chunk);
                    });

                    res.on('end', () => {
                        let parseResponse = Object.keys(JSON.parse(Buffer.concat(data).toString()).data);
                        console.log(`Data received :: ${JSON.stringify(parseResponse)}`);
                        resolve(parseResponse);
                    })

                    res.on('error', (err) => {
                        reject(err)
                    })
                });
            })
        });
    }

    getLatestVersion() {
        return new Promise((resolve, reject) => {

            const params = {
                hostname: 'ddragon.leagueoflegends.com',
                path: '/api/versions.json'
            }
            http.get(params, (res) => {
                let data = [];
                if (res.statusCode !== 200) {
                    reject('Failed to pull data.');
                }

                res.on('data', (chunk) => {
                    data.push(chunk);
                });

                res.on('end', () => {
                    let parseResponse = JSON.parse(Buffer.concat(data).toString());
                    let latestVersion = parseResponse.shift();
                    console.log(`Data received :: ${JSON.stringify(parseResponse)}`);
                    console.log(`Latest version :: ${latestVersion}`);
                    resolve(latestVersion);
                })

                res.on('error', (err) => {
                    reject(err)
                })
            });
        });
    }
}
module.exports = new DdragonService;
