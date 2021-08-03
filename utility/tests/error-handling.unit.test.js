const errorHandler = require('../error-handling');

test('Should respond with a generic message based on the command passed.', () => {
    let messagePassed = '';
    let msg = {
        reply: (value) => messagePassed = value
    };
    const userMessage = 'Sample Test Message to be given to the user';
    const constantSuffix = '. Please reach out to <@299370234228506627>.';
    errorHandler.handleError('test', 'Test error.', msg, userMessage);
    expect(messagePassed).toEqual(userMessage + constantSuffix);
})
