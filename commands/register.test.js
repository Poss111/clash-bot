const register = require('./register');
const dynamoDBUtils = require('../dao/dynamo-db-impl');

jest.mock('../dao/dynamo-db-impl');

test('If a user is successfully register, then a reply stating the Team that the User has been registered to should be returned.', (done) => {
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
    function callback() {
        try {
            expect(messagePassed).toEqual(`Registered on ${sampleRegisterReturn.teamName} your Team consists so far of ${sampleRegisterReturn.players}`);
            done();
        } catch(error) {
            done(error);
        }
    }
    dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
    register.execute(msg, callback);
    expect(sendMessage).toEqual(`Registering ${msg.author.username}...`)
})

test('If a user is already on a team, then a reply stating the Team that the User has been registered to should be returned.', (done) => {
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
    function callback() {
        try {
            expect(messagePassed).toEqual(`You are already registered to ${sampleRegisterReturn.teamName} your Team consists so far of ${sampleRegisterReturn.players}`);
            done();
        } catch(error) {
            done(error);
        }
    }
    dynamoDBUtils.registerPlayer.mockResolvedValue(sampleRegisterReturn);
    register.execute(msg, callback);
    expect(sendMessage).toEqual(`Registering ${msg.author.username}...`)
})

test('If an error occurs, the error handler will be invoked.', (done) => {
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
    function callback() {
        try {
            done();
        } catch(error) {
            expect(errorHandling.mock.calls.length).toEqual(1);
            done(error);
        }
    }
    dynamoDBUtils.registerPlayer.mockRejectedValue('Some error occurred.');
    register.execute(msg, callback);
    expect(sendMessage).toEqual(`Registering ${msg.author.username}...`)
})
