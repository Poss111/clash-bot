const discordModulePath = 'discord.js';
const botCommands = require('../commands');
const helpMenu = require('../templates/help-menu');
const loadBot = require('../utility/load-bot');
const teamsServiceImpl = require('../services/teams-service-impl');

jest.mock(discordModulePath);

const timeoutPromise = (timeout) => new Promise((resolve) => setTimeout(() => resolve(true), timeout));
const testServerName = 'LoL-ClashBotSupport';

beforeAll(async () => {
    process.env.INTEGRATION_TEST = true;
    process.env.REGION = 'us-east-1';
    let counter = 0;
    const serviceDataHealthcheckPromise = () => new Promise((resolve, reject) => {
        try {
            console.log('Checking if service is available...');
            teamsServiceImpl.retrieveActiveTeamsForServer(testServerName)
                .then((data) => {
                    if (Array.isArray(data) && data.length > 0) {
                        console.log('It is available!');
                        resolve(true);
                    } else {
                        reject('Service is not available. Data not loaded yet.')
                    }
                })
                .catch((error) => reject('Service is not available! => ' + error.message));
        } catch (error) {
            console.error('Clash Bot Service is not available.');
            reject('Service is not available! => ' + error.message);
        }
    });
    let serviceLoaded = false;
    while (!serviceLoaded && counter < 10) {
        try {
            await serviceDataHealthcheckPromise();
            serviceLoaded = true;
        } catch (err) {
            counter++;
            console.log(counter);
            await timeoutPromise(3000);
        }
    }
    if (!serviceLoaded) {
        console.error('Clash Bot Service is not available.');
        process.exit(1);
    }
}, 120000)

beforeEach(async () => {
    jest.resetAllMocks();
    delete process.env.LOCAL;
    delete process.env.TOKEN;
})

describe('!clash help', () => {
    test('When a message event is received, the message should execute the expected command from channel league and the command following the prefix !clash', async () => {
        let {restrictedChannel, commandPrefix, mockDiscordMessage, mockDiscordBot} = setupBotCommand('help');
        let copy = JSON.parse(JSON.stringify(helpMenu));
        await loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
        expect(mockDiscordMessage.channel.send).toBeCalledTimes(1);
        expect(mockDiscordMessage.channel.send).toBeCalledWith({embed: copy});
    })
})

describe('!clash time', () => {
    test('When the data store has available Tournament dates in it, it should return with actual dates and not No times available.', async () => {
        let {restrictedChannel, commandPrefix, mockDiscordMessage, mockDiscordBot} = setupBotCommand('time');
        await loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
        expect(mockDiscordMessage.channel.send).toBeCalledTimes(1);
        expect(mockDiscordMessage.channel.send.mock.calls[0][0]).toBeTruthy();
        let returnedMessage = mockDiscordMessage.channel.send.mock.calls[0][0].embed;
        expect(returnedMessage.fields.name).not.toEqual('No times available');
    })
});

describe('!clash teams', () => {
    test('When the data store has available Teams for the specific Tournaments, it should return the given Teams.', async () => {
        let {restrictedChannel, commandPrefix, mockDiscordMessage, mockDiscordBot} = setupBotCommand('teams');
        await loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
        expect(mockDiscordMessage.reply).toBeCalledTimes(2);
        expect(mockDiscordMessage.reply.mock.calls[1][0]).toBeTruthy();
    })
})

describe('!clash un/subscribe', () => {
    test('When the User wants to unsubscribe, their data should be reflected that they no longer want a subscription.', async () => {
        let testUserId = '321654987';
        let {restrictedChannel, commandPrefix, mockDiscordMessage, mockDiscordBot} = setupBotCommand('unsubscribe', testUserId);
        await loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
        expect(mockDiscordMessage.reply).toBeCalledTimes(2);
    })

    test('When the User wants to subscribe, their data should be stored successfully to be picked up by the Notification Lambda.', async () => {
        let {restrictedChannel, commandPrefix, mockDiscordMessage, mockDiscordBot} = setupBotCommand('subscribe');
        await loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
        expect(mockDiscordMessage.reply).toBeCalledTimes(2);
        expect(mockDiscordMessage.reply.mock.calls[1][0]).toEqual('You have subscribed. You will receive a notification the Monday before ' +
            'a Clash Tournament weekend. If you want to unsubscribe at any time please use !clash unsubscribe');
    })
})

describe('!clash join', () => {
    test('When the User wants to join a specific Team, they should be able to pass the team name and be successfully assigned to them.', async () => {
        let {restrictedChannel, commandPrefix, mockDiscordMessage, mockDiscordBot} = setupBotCommand('join');
        const expectedTeamName = "Charizard";
        mockDiscordMessage.content = mockDiscordMessage.content.concat(" awesome_sauce 4 " + expectedTeamName);
        await loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
        expect(mockDiscordMessage.reply.mock.calls[1][0].embed.description).not.toContain('Failed to find');
        expect(mockDiscordMessage.reply.mock.calls[1][0].embed.fields[0].name).toContain(`Team ${expectedTeamName}`);
        expect(mockDiscordMessage.reply.mock.calls[1][0].embed.fields[0].value).toContain(mockDiscordMessage.author.username);
    })
})

describe('!clash newTeam', () => {
    test('When the User wants to create a new Team, they should be able to create for the specified Tournament and Day.', async () => {
        let {restrictedChannel, commandPrefix, mockDiscordMessage, mockDiscordBot} = setupBotCommand('newTeam');
        mockDiscordMessage.content = mockDiscordMessage.content.concat(" awesome_sauce");
        await loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
        expect(mockDiscordMessage.reply.mock.calls[1][0]).not.toContain('We were unable to find a Tournament with');
        expect(mockDiscordMessage.reply.mock.calls[1][0].embed.fields[0].value).toContain(mockDiscordMessage.author.username);
        expect(mockDiscordMessage.reply.mock.calls[1][0].embed.fields[1].name).toContain('Tournament Details');
        expect(mockDiscordMessage.reply.mock.calls[1][0].embed.fields[1].value).toEqual('awesome_sauce Day 1');
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
            username: 'Roïdräge',
            id: userId ? userId : '299370234228506627'
        },
        guild: {
            name: 'LoL-ClashBotSupport'
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
        case 'join':
            module = botCommands.JoinTeamByName;
            break;
        case 'newteam':
            module = botCommands.NewTeam;
            break;
    }
    mockCommands.set(command, module);
    let mockDiscordBot = {
        commands: mockCommands
    };
    return {restrictedChannel, commandPrefix, mockDiscordMessage, mockDiscordBot};
}
