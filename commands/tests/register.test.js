const register = require('../register');

describe('Register', () => {
    test('User should be notified that the register command is now deprecated and to use the newTeam command instead.', async () => {
        let messagePassed = '';
        let msg = {
            reply: (value) => messagePassed = value
        };
        register.execute(msg)
        expect(messagePassed).toBe('Register is going to be removed. ***newTeam*** and ***join*** are now the go to commands. Please use !clash help if you would like to view their usage.');
    })
})
