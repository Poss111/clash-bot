const tentative = require('./tentative');
const dynamoDBUtils = require('../dao/dynamo-db-impl');
const errorHandling = require('../utility/error-handling');

jest.mock('../dao/dynamo-db-impl');
jest.mock('../utility/error-handling');

test('Should respond with user has been placed on tentative if the player name does not exist in the tentative list.', (done) => {
    let messagePassed = '';
    let msg = {
        reply: (value) => messagePassed = value,
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    function callback() {
        try {
            expect(messagePassed).toEqual(`We placed you into the tentative queue. If you were on a team, you have been removed. tip: Use '!clash teams' to view current team status`);
            done();
        } catch(error) {
            done(error);
        }
    }
    dynamoDBUtils.handleTentative.mockResolvedValue(false);
    tentative.execute(msg, callback);
})

test('Should respond with user has been taken off tentative if the player name does exist in the tentative list.', (done) => {
    let messagePassed = '';
    let msg = {
        reply: (value) => messagePassed = value,
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    function callback() {
        try {
            expect(messagePassed).toEqual(`We have taken you off of tentative queue. tip: Use '!clash teams' to view current team status`);
            done();
        } catch(error) {
            done(error);
        }
    }
    dynamoDBUtils.handleTentative.mockResolvedValue(true);
    tentative.execute(msg, callback);
})

test('If an error occurs, the error handler will be invoked.', (done) => {
    let messagePassed = '';
    let msg = {
        reply: (value) => messagePassed = value,
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    function callback() {
        try {
            done();
        } catch(error) {
            expect(errorHandling.mock.calls.length).toEqual(1);
            done(error);
        }
    }
    dynamoDBUtils.handleTentative.mockRejectedValue('Some error occurred.');
    tentative.execute(msg, callback);
})
