const register = require('../register');

describe('Register', () => {
    test('User should be notified that the register command is now deprecated and to use the newTeam command instead.', async () => {
        let messagePassed = '';
        let msg = {
            reply: (value) => messagePassed = value
        };
        register.execute(msg)
        expect(messagePassed).toBe('Register is going to be removed. ***newTeam*** (If you want to create a brand new team) and ***join*** (If you want to join an existing one, the team must exist) are now the go to commands. Please use !clash help if you would like to view their usage.');
    })
})
