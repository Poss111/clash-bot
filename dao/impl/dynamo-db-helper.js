const dynamodb = require('dynamodb');

class DynamoDbHelper {

    setupConfig;

    initialize(tableName, tableDef) {
        return new Promise((resolve) => {
            if (!this.setupConfig) {
                if (process.env.INTEGRATION_TEST) {
                    console.log('Loading credentials for Integration Test.');
                    dynamodb.AWS.config.update({
                        region: `${process.env.REGION}`,
                        endpoint: process.env.IP_ADDRESS ? `http://${process.env.IP_ADDRESS}:8000` : 'http://localhost:8000',
                        accessKeyId: 'Dummy',
                        secretAccessKey: 'Dummy'
                    })
                    this.setupConfig = true;
                } else if (process.env.LOCAL) {
                    console.log('Loading credentials for local.');
                    dynamodb.AWS.config.loadFromPath('./credentials.json');
                    this.setupConfig = true;
                } else {
                    console.log('Loading credentials for remote.');
                    dynamodb.AWS.config.update({
                        region: `${process.env.REGION}`
                    });
                    this.setupConfig = true;
                }
            }
            console.log(`Loaded table def ('${tableName}').`);
            resolve(dynamodb.define(tableName, tableDef));
        })
    }
}

module.exports = new DynamoDbHelper;
