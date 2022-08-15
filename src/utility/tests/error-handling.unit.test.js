const errorHandler = require('../error-handling');
const {buildMockInteraction} = require('../../commands/tests/shared-test-utilities/shared-test-utilities.test');

describe('Error Handling', () => {
    test('Should respond with a generic message based on the command passed.', () => {
        const msg = buildMockInteraction();
        const userMessage = 'Sample Test Message to be given to the user';
        const constantSuffix = '. Please reach out to <@299370234228506627>.';
        errorHandler.handleError('test', 'Test error.', msg, userMessage, {});
        expect(msg.editReply).toHaveBeenCalledWith(userMessage + constantSuffix);
    });
})
