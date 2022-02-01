const buildMockInteraction = () => {
    return {
        deferReply: jest.fn(),
        reply: jest.fn(),
        editReply: jest.fn(),
        followUp: jest.fn(),
        user: {
            id: '1',
            username: 'Shiragaku'
        },
        member: {
            guild: {
                name: 'LoL-ClashBotSupport',
                id: 837685892885512202
            },
            createDM: jest.fn()
        },
        options: {},
        isCommand: () => true
    };
}

module.exports.buildMockInteraction = buildMockInteraction