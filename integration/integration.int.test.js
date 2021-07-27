const discordModulePath = 'discord.js';
const botCommands = require('../commands');
const helpMenu = require('../templates/help-menu');
const loadBot = require('../utility/load-bot');
const dynamoDbUtility = require('./dynamo-db-utility.int.test');

jest.mock(discordModulePath);

let clashTableData = new Map();

beforeAll(async () => {
    process.env.INTEGRATION_TEST = true;
    await dynamoDbUtility.loadAllTables()
        .then(data => {
            console.log('Table data setup successfully.');
            clashTableData = data;
        })
        .catch(err => console.error('Failed to setup data', err));
})

beforeEach(() => {
    jest.resetAllMocks();
    delete process.env.LOCAL;
    delete process.env.TOKEN;
})

function setupBotCommand(command) {
    let restrictedChannel = 'league';
    let commandPrefix = '!clash';
    let mockDiscordMessage = {
        channel: {
            name: restrictedChannel,
            send: jest.fn()
        },
        content: `${commandPrefix} ${command}`,
        author: {
            username: 'Test User'
        }
    };
    let mockCommands = new Map();
    let module = undefined;
    switch(command.toLowerCase()) {
        case 'help':
            module = botCommands.Help;
            break;
        case 'time':
            module = botCommands.Time;
            break;
        case 'teams':
            module = botCommands.Teams;
            break;
    }
    mockCommands.set(command, module);
    let mockDiscordBot = {
        commands: mockCommands
    };
    return {restrictedChannel, commandPrefix, mockDiscordMessage, mockDiscordBot};
}

describe('!clash help', () => {

    test('When a message event is received, the message should execute the expected command from channel league and the command following the prefix !clash', () => {
        let {restrictedChannel, commandPrefix, mockDiscordMessage, mockDiscordBot} = setupBotCommand('help');
        let copy = JSON.parse(JSON.stringify(helpMenu));
        loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
        expect(mockDiscordMessage.channel.send).toBeCalledTimes(1);
        expect(mockDiscordMessage.channel.send).toBeCalledWith({embed: copy});
        mockDiscordBot.commands.get(0)
    })
})

describe('!clash time',() => {
    test('When the data store has available Tournament dates in it, it should return with actual dates and not No times available.', async () => {
        let {restrictedChannel, commandPrefix, mockDiscordMessage, mockDiscordBot} = setupBotCommand('time');
        await loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
        expect(mockDiscordMessage.channel.send).toBeCalledTimes(1);
        expect(mockDiscordMessage.channel.send.mock.calls[0][0]).toBeTruthy();
        let returnedMessage = mockDiscordMessage.channel.send.mock.calls[0][0].embed;
        expect(returnedMessage.fields.name).not.toEqual('No times available');
        mockDiscordBot.commands.get(0)
    })
});
