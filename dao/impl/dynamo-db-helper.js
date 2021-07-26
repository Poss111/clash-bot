const dynamodb = require('dynamodb');

class DynamoDbHelper {

    setupConfig;

    initialize(tableName, tableDef) {
        return new Promise((resolve) => {
            if (!this.setupConfig) {
                if (process.env.LOCAL) {
                    console.log('Loading credentials from local.');
                    dynamodb.AWS.config.loadFromPath('./credentials.json');
                    tableName = `${tableName}`;
                    this.setupConfig = true;
                } else {
                    console.log('Loading credentials from remote.');
                    dynamodb.AWS.config.update({
                        region: `${process.env.REGION}`
                    });
                    this.setupConfig = true;
                }
            }
            resolve(dynamodb.define(tableName, tableDef));
        });
    }
}

module.exports = new DynamoDbHelper;
