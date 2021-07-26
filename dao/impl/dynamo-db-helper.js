const dynamodb = require('dynamodb');

class DynamoDbHelper {

    setupConfig;

    initialize(tableName, tableDef) {
        return new Promise((resolve) => {
            console.log(`Loading table def ('${tableName}')...`);
            if (!this.setupConfig) {
                if (process.env.LOCAL) {
                    console.log('Loading credentials for local.');
                    dynamodb.AWS.config.loadFromPath('./credentials.json');
                    this.setupConfig = true;
                } else if (process.env.INTEGRATION_TEST) {
                    console.log('Loading credentials for Integration Test.');
                    dynamodb.AWS.config.loadFromPath('./credentials.json');
                    dynamodb.AWS.config.update({endpoint: 'http://localhost:8000'})
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
        });
    }
}

module.exports = new DynamoDbHelper;
