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
                // eslint-disable-next-line no-loss-of-precision
                id: 837685892885512202
            },
            createDM: jest.fn()
        },
        options: {},
        isCommand: () => true
    };
};

const create400HttpError = () => {
    return {
        error: 'No team found matching criteria \'\'.',
        headers: undefined,
        status: 400,
        statusText: 'Bad Request',
        url: 'https://localhost.com/api'
    };
};

const create404HttpError = () => {
    return {
        error: 'No team found matching criteria \'\'.',
        headers: undefined,
        status: 404,
        statusText: 'Not Found',
        url: 'https://localhost.com/api'
    };
};

const create500HttpError = () => {
    return {
        error: 'Failed to make call.',
        headers: undefined,
        status: 500,
        statusText: 'Bad Request',
        url: 'https://localhost.com/api'
    };
};

module.exports = {
    buildMockInteraction,
    create400HttpError,
    create404HttpError,
    create500HttpError,
};