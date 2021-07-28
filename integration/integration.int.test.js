const discordModulePath = 'discord.js';
const botCommands = require('../commands');
const helpMenu = require('../templates/help-menu');
const loadBot = require('../utility/load-bot');
const dynamoDbUtility = require('./dynamo-db-utility.setup.test');

jest.mock(discordModulePath);

let clashTableData = new Map();

beforeAll(() => {
    process.env.INTEGRATION_TEST = true;
})

beforeEach(async () => {
    jest.resetAllMocks();
    delete process.env.LOCAL;
    delete process.env.TOKEN;
    await dynamoDbUtility.loadAllTables()
        .then(data => {
            console.log('Table data setup successfully.');
            clashTableData = data;
        })
        .catch(err => console.error('Failed to setup data', err));
})

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

describe('!clash time', () => {
    test('When the data store has available Tournament dates in it, it should return with actual dates and not No times available.', async () => {
        let {restrictedChannel, commandPrefix, mockDiscordMessage, mockDiscordBot} = setupBotCommand('time');
        await loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
        let tableData = clashTableData.get('clashtime');
        expect(mockDiscordMessage.channel.send).toBeCalledTimes(1);
        expect(mockDiscordMessage.channel.send.mock.calls[0][0]).toBeTruthy();
        let returnedMessage = mockDiscordMessage.channel.send.mock.calls[0][0].embed;
        expect(returnedMessage.fields.name).not.toEqual('No times available');
        expect(returnedMessage.fields.length).toEqual(tableData.dataPersisted.length * 4);
    })
});

describe('!clash teams', () => {
    test('When the data store has available Teams for the specific Tournaments, it should return the given Teams.', async () => {
        let {restrictedChannel, commandPrefix, mockDiscordMessage, mockDiscordBot} = setupBotCommand('teams');
        await loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
        let tableData = clashTableData.get('ClashTeam');
        expect(mockDiscordMessage.reply).toBeCalledTimes(1);
        expect(mockDiscordMessage.reply.mock.calls[0][0]).toBeTruthy();
        let returnedMessage = mockDiscordMessage.reply.mock.calls[0][0].embed;
        let expectedFilter = tableData.dataPersisted.filter(record => record.players);
        // number of teams + spaces between + Tournament Details (One per team)
        expect(returnedMessage.fields).toHaveLength(expectedFilter.length + (expectedFilter.length - 1) + expectedFilter.length);
    })
})

describe('!clash subscribe', () => {
    test('When the User wants to subscribe, their data should be stored successfully to be picked up by the Notification Lambda.', async () => {
        let {restrictedChannel, commandPrefix, mockDiscordMessage, mockDiscordBot} = setupBotCommand('subscribe');
        let tableData = clashTableData.get('clash-registered-user');
        await loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
        let updatedData = await dynamoDbUtility.getAllDataFromTable(tableData.table);
        expect(mockDiscordMessage.reply).toBeCalledTimes(1);
        expect(mockDiscordMessage.reply.mock.calls[0][0]).toEqual('You have subscribed. You will receive a notification the Monday before ' +
            'a Clash Tournament weekend. If you want to unsubscribe at any time please use !clash unsubscribe');
        expect(updatedData).toHaveLength(tableData.dataPersisted.length + 1);
    })
})

describe('!clash unsubscribe', () => {
    test('When the User wants to unsubscribe, their data should be reflected that they no longer want a subscription.', async () => {
        let testUserId = '321654987';
        let {restrictedChannel, commandPrefix, mockDiscordMessage, mockDiscordBot} = setupBotCommand('unsubscribe', testUserId);
        let tableData = clashTableData.get('clash-registered-user');
        expect(tableData.dataPersisted.find(data => data.key === testUserId).subscribed).toBeTruthy();
        await loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
        let updatedData = await dynamoDbUtility.getAllDataFromTable(tableData.table);
        expect(mockDiscordMessage.reply).toBeCalledTimes(1);
        let updatedUserRecord = updatedData.find(record => record.key === testUserId);
        expect(updatedUserRecord.subscribed).toBeFalsy();
    })
})

describe('!clash join', () => {
    test('When the User wants to join a specific Team, they should be able to pass the team name and be successfully assigned to them.', () => {

    })
})

describe('!clash newTeam', () => {
    test('When the User wants to create a new Team, they should be able to create for the specified Tournament and Day.', () => {

    })
})

function setupBotCommand(command, userId) {
    let restrictedChannel = 'league';
    let commandPrefix = '!clash';
    let mockDiscordMessage = {
        channel: {
            name: restrictedChannel,
            send: jest.fn()
        },
        content: `${commandPrefix} ${command}`,
        author: {
            username: 'Test User',
            id: userId ? userId : '123432112321'
        },
        guild: {
            name: 'Integration Server'
        },
        reply: jest.fn()
    };
    let mockCommands = new Map();
    let module = undefined;
    switch (command.toLowerCase()) {
        case 'help':
            module = botCommands.Help;
            break;
        case 'time':
            module = botCommands.Time;
            break;
        case 'teams':
            module = botCommands.Teams;
            break;
        case 'subscribe':
            module = botCommands.Subscribe;
            break;
        case 'unsubscribe':
            module = botCommands.Unsubscribe;
            break;
    }
    mockCommands.set(command, module);
    let mockDiscordBot = {
        commands: mockCommands
    };
    return {restrictedChannel, commandPrefix, mockDiscordMessage, mockDiscordBot};
}
