const register = require('../register');
const dynamoDBUtils = require('../../dao/dynamo-db-impl');
const errorHandling = require('../../utility/error-handling');

jest.mock('../../dao/dynamo-db-impl');
jest.mock('../../utility/error-handling');

test('If a user is successfully register, then a reply stating the Team that the User has been registered to should be returned.', async () => {
    let messagePassed = '';
    let sendMessage = '';
    let msg = {
        reply: (value) => messagePassed = value,
        channel: {
            send: (value) => sendMessage = value
        },
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    const sampleRegisterReturn = { teamName: 'SampleTeam', players: [msg.author.username, 'Player2']};
    dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
    await register.execute(msg);
    expect(sendMessage).toEqual(`Registering ${msg.author.username}...`);
    expect(messagePassed).toEqual(`Registered on ${sampleRegisterReturn.teamName} your Team consists so far of ${sampleRegisterReturn.players}`);
})

test('If a user is already on a team, then a reply stating the Team that the User has been registered to should be returned.',  async () => {
    let messagePassed = '';
    let sendMessage = '';
    let msg = {
        reply: (value) => messagePassed = value,
        channel: {
            send: (value) => sendMessage = value
        },
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    const sampleRegisterReturn = { exist: true, teamName: 'ExistingTeam', players: [msg.author.username, 'Player2']};
    dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
    await register.execute(msg);
    expect(sendMessage).toEqual(`Registering ${msg.author.username}...`);
    expect(messagePassed).toEqual(`You are already registered to ${sampleRegisterReturn.teamName} your Team consists so far of ${sampleRegisterReturn.players}`);
})

test('If an error occurs, the error handler will be invoked.',  async () => {
    let messagePassed = '';
    let sendMessage = '';
    errorHandling.handleError = jest.fn();
    let msg = {
        reply: (value) => messagePassed = value,
        channel: {
            send: (value) => sendMessage = value
        },
        author: {
            username: 'TestPlayer'
        },
        guild: {
            name: 'TestServer'
        }
    };
    dynamoDBUtils.registerPlayer.mockRejectedValue('Some error occurred.');
    await register.execute(msg);
    expect(sendMessage).toEqual(`Registering ${msg.author.username}...`);
    expect(errorHandling.handleError.mock.calls.length).toEqual(1);
})
