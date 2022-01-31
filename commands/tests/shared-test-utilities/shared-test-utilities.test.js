const buildMockInteraction = () => {
    return {
        deferReply: jest.fn(),
        reply: jest.fn(),
        editReply: jest.fn(),
        followUp: jest.fn(),
        user: {
            id: '1',
            username: 'TestPlayer'
        },
        member: {
            guild: {
                name: 'TestServer'
            },
            createDM: jest.fn()
        }
    };
}

module.exports.buildMockInteraction = buildMockInteraction