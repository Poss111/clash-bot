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
        },
        options: {},
        isCommand: () => true
    };
}

module.exports.buildMockInteraction = buildMockInteraction