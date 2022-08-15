const discordModulePath = 'discord.js';
const botCommands = require('../commands');
const helpMenu = require('../templates/help-menu');
const clashTimeMenu = require('../templates/clash-times-menu');
const loadBot = require('../utility/load-bot');
const {buildMockInteraction} = require('../commands/tests/shared-test-utilities/shared-test-utilities.test');
const ClashBotRestClient = require('clash-bot-rest-client');
const logger = require('../utility/logger');
const {client} = require('../utility/rest-api-utilities');

jest.mock(discordModulePath);

const timeoutPromise = (timeout) => new Promise((resolve) => setTimeout(() => resolve(true), timeout));
const testServerName = 'LoL-ClashBotSupport';

beforeAll(async () => {
    process.env.INTEGRATION_TEST = true;
    process.env.SHOW_RELEASE_MESSAGE = false;
    process.env.REGION = 'us-east-1';
    process.env.HEADER_KEY = 'dummy-header-key';
    let counter = 0;
    const serviceDataHealthcheckPromise = () => new Promise((resolve, reject) => {
        try {
            logger.info('Checking if service is available...');
            const teamApi = new ClashBotRestClient.TeamApi(client());
            teamApi.getTeam(testServerName)
              .then((data) => {
                    if (Array.isArray(data) && data.length > 0) {
                        logger.info('It is available!');
                        resolve(true);
                    } else {
                        reject('Service is not available. Data not loaded yet.');
                    }
                })
                .catch((error) => reject('Service is not available! => ' + error.message));
        } catch (error) {
            logger.error('Clash Bot Service is not available.');
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
            logger.info(counter);
            await timeoutPromise(3000);
        }
    }
    if (!serviceLoaded) {
        logger.error('Clash Bot Service is not available.');
        process.exit(1);
    }
}, 120000);

beforeEach(async () => {
    jest.resetAllMocks();
    delete process.env.LOCAL;
    delete process.env.TOKEN;
});

describe('Commands', () => {
    describe('/help', () => {
        test('When a message event is received, the message should execute the expected command from channel league and the command following the prefix !clash', async () => {
            let {mockDiscordMessage, mockDiscordBot} = setupBotCommand('help');
            let copy = JSON.parse(JSON.stringify(helpMenu));
            await loadBot.interactionHandler(mockDiscordMessage, mockDiscordBot);
            expect(mockDiscordMessage.reply).toBeCalledTimes(1);
            expect(mockDiscordMessage.reply).toBeCalledWith({embeds: [copy]});
        });
    });

    describe('/time', () => {
        test('When the data store has available Tournament dates in it, it should return with actual dates and not No times available.', async () => {
            let {mockDiscordMessage, mockDiscordBot} = setupBotCommand('time');
            let copy = JSON.parse(JSON.stringify(clashTimeMenu));
            copy.fields.push({
                name: 'No times available',
                value: 'N/A',
                inline: false,
            });
            await loadBot.interactionHandler(mockDiscordMessage, mockDiscordBot);
            expect(mockDiscordMessage.editReply).toBeCalledTimes(1);
            expect(mockDiscordMessage.editReply).not.toHaveBeenCalledWith({embeds: [copy]});
        });
    });

    describe('/teams', () => {
        test('When the data store has available Teams for the specific Tournaments, it should return the given Teams.', async () => {
            let {mockDiscordMessage, mockDiscordBot} = setupBotCommand('teams');
            await loadBot.interactionHandler(mockDiscordMessage, mockDiscordBot);
            expect(mockDiscordMessage.editReply).toBeCalledTimes(1);
            expect(mockDiscordMessage.editReply.mock.calls[0][0]).toBeTruthy();
        });
    });

    describe('/un/subscribe', () => {
        test('When the User wants to subscribe, their data should be stored successfully to be picked up by the Notification Lambda.', async () => {
            let testUserId = '321654987';
            let {mockDiscordMessage, mockDiscordBot} = setupBotCommand('subscribe', testUserId);
            await loadBot.interactionHandler(mockDiscordMessage, mockDiscordBot);
            expect(mockDiscordMessage.editReply).toBeCalledTimes(1);
            expect(mockDiscordMessage.editReply).toHaveBeenCalledWith('You have subscribed. You will receive a notification the Monday before ' +
                'a Clash Tournament weekend. If you want to unsubscribe at any time please use /unsubscribe');
        });

        test('When the User wants to unsubscribe, their data should be reflected that they no longer want a subscription.', async () => {
            let testUserId = '321654987';
            let {mockDiscordMessage, mockDiscordBot} = setupBotCommand('unsubscribe', testUserId);
            await loadBot.interactionHandler(mockDiscordMessage, mockDiscordBot);
            expect(mockDiscordMessage.editReply).toBeCalledTimes(1);
            expect(mockDiscordMessage.editReply).toHaveBeenCalledWith('You have successfully unsubscribed.');
        });
    });

    describe('/join', () => {
        test('When the User wants to join a specific Team, they should be able to pass the team name and be successfully assigned to them.', async () => {
            let {mockDiscordMessage, mockDiscordBot} = setupBotCommand('join');
            const expectedTeamName = 'Charizard';
            const expectedRole = 'Top';
            mockDiscordMessage.options = {
                data: [
                    {
                        'name': 'role',
                        'type': 'STRING',
                        'value': 'Top'
                    },
                    {
                        'name': 'tournament',
                        'type': 'STRING',
                        'value': 'awesome_sauce'
                    },
                    {
                        'name': 'day',
                        'type': 'INTEGER',
                        'value': 4
                    },
                    {
                        'name': 'team-name',
                        'type': 'STRING',
                        'value': expectedTeamName
                    }
                ]
            };
            await loadBot.interactionHandler(mockDiscordMessage, mockDiscordBot);
            logger.info(mockDiscordMessage.editReply.mock.calls);
            expect(mockDiscordMessage.editReply.mock.calls[0])
              .toBeTruthy();
            expect(mockDiscordMessage.editReply.mock.calls[0][0])
              .toBeTruthy();
            const reply = mockDiscordMessage.editReply.mock.calls[0][0].embeds[0];
            expect(reply.description).not
                .toContain('Failed to find');
            expect(reply.fields[0].name)
                .toContain(`${expectedTeamName}`);
            expect(reply.fields[0].value)
                .toEqual([expectedRole + ' - ' + mockDiscordMessage.user.username, 'Supp - TheIncentive'].join('\n'));
        });
    });

    describe('/new-team', () => {
        test('When the User wants to create a new Team, they should be able to create for the specified Tournament and Day.', async () => {
            let {mockDiscordMessage, mockDiscordBot} = setupBotCommand('new-team');
            const expectedRole = 'Top';
            mockDiscordMessage.options = {
                data: [
                    {
                        'name': 'role',
                        'type': 'STRING',
                        'value': expectedRole
                    },
                    {
                        'name': 'tournament',
                        'type': 'STRING',
                        'value': 'awesome_sauce'
                    }
                ]
            };
            await loadBot.interactionHandler(mockDiscordMessage, mockDiscordBot);
            const firstMessage = mockDiscordMessage.editReply.mock.calls[0][0];
            const secondMessage = mockDiscordMessage.editReply.mock.calls[1][0];
            expect(firstMessage).toBeTruthy();
            expect(secondMessage).not.toContain('We were unable to find a Tournament with');
            expect(secondMessage).toBeTruthy();
            expect(secondMessage.embeds).toBeTruthy();
            expect(secondMessage.embeds[0]).toBeTruthy();
            expect(secondMessage.embeds[0].fields[0].value)
                .toEqual([expectedRole + ' - ' + mockDiscordMessage.user.username].join('\n'));
            expect(secondMessage.embeds[0].fields[1].name).toContain('Tournament Details');
            expect(secondMessage.embeds[0].fields[1].value).toEqual('awesome_sauce Day 1');
        });
    });
});

function setupBotCommand(command, userId) {
    let mockDiscordMessage = buildMockInteraction();
    mockDiscordMessage.commandName = command;
    if (userId) {
        mockDiscordMessage.user.id = userId;
    }
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
        case 'new-team':
            module = botCommands.NewTeam;
            break;
    }
    mockCommands.set(command, module);
    let mockDiscordBot = {
        commands: mockCommands
    };
    return {mockDiscordMessage, mockDiscordBot};
}

