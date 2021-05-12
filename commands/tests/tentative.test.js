const tentative = require('../tentative');
const dynamoDBUtils = require('../../dao/dynamo-db-impl');
const errorHandling = require('../../utility/error-handling');

jest.mock('../../dao/dynamo-db-impl');
jest.mock('../../utility/error-handling');

test('Should respond with user has been placed on tentative if the player name does not exist in the tentative list.', async () => {
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
    dynamoDBUtils.handleTentative.mockResolvedValue(false);
    await tentative.execute(msg);
    expect(messagePassed).toEqual(`We placed you into the tentative queue. If you were on a team, you have been removed. tip: Use '!clash teams' to view current team status`);
})

test('Should respond with user has been taken off tentative if the player name does exist in the tentative list.', async () => {
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
    dynamoDBUtils.handleTentative.mockResolvedValue(true);
    await tentative.execute(msg);
    expect(messagePassed).toEqual(`We have taken you off of tentative queue. tip: Use '!clash teams' to view current team status`);
})

test('If an error occurs, the error handler will be invoked.', async () => {
    errorHandling.handleError = jest.fn();
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
    dynamoDBUtils.handleTentative.mockRejectedValue('Some error occurred.');
    await tentative.execute(msg);
    expect(errorHandling.handleError.mock.calls.length).toEqual(1);
})
