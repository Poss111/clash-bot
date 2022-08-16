const discordModulePath = 'discord.js';
const commandsModulePath = '../../commands';
const Discord = require('discord.js');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const botCommands = require(commandsModulePath);
const helpMenu = require('../../templates/help-menu');
const updateNotification = require('../../templates/update-notification');
const loadBot = require('../load-bot');
const { buildMockInteraction, create404HttpError, create500HttpError} = require('../../commands/tests/shared-test-utilities/shared-test-utilities.test');
const templateBuilder = require('../template-builder');
const clashBotRestClient = require('clash-bot-rest-client');

jest.mock(discordModulePath);
jest.mock('@discordjs/rest');
jest.mock('discord-api-types/v9');
jest.mock('clash-bot-rest-client');

beforeEach(() => {
    jest.resetAllMocks();
    delete process.env.LOCAL;
    delete process.env.INTEGRATION_TEST;
    delete process.env.TOKEN;
    delete process.env.CLIENT_ID;
});

describe('Load Bot - All', () => {
    describe('Load Bot', () => {
        test('Loading the bot should call all expected event listeners if not integration role.', () => {
            process.env.TOKEN = 'SampleToken';
            process.env.CLIENT_ID = '123321123321123211231231';
            let restMock = {
                put: jest.fn()
            };
            REST.mockImplementation(() => {
                return {
                    setToken: () => restMock
                };
            });
            let loginMockObject = jest.fn().mockResolvedValue(jest.fn());
            let expectedCommandsPayload = Object.keys(botCommands).map(key => {
                let payload = { name: botCommands[key].name, description: botCommands[key].description};
                if (botCommands[key].options) {
                    payload.options = botCommands[key].options;
                }
                return payload;
            });
            let commandSetMockObject = jest.fn();
            let actualEvents = new Map();
            Discord.Client = jest.fn().mockReturnValue({
                login: loginMockObject,
                on: jest.fn().mockImplementation((eventName, callback) => actualEvents.set(eventName, callback))
            });
            Discord.Collection = jest.fn().mockReturnValue({set: commandSetMockObject});

            return loadBot.initializeBot().then((botSetup) => {
                expect(restMock.put).toHaveBeenCalledTimes(1);
                expect(restMock.put).toHaveBeenCalledWith(undefined, { body: expectedCommandsPayload });
                expect(Routes.applicationCommands).toHaveBeenCalledTimes(1);
                expect(Routes.applicationCommands).toHaveBeenCalledWith(process.env.CLIENT_ID);
                expect(commandSetMockObject).toBeCalledTimes(Object.keys(botCommands).length);
                Object.keys(botCommands).forEach((value, index) => {
                    expect(commandSetMockObject)
                        .toHaveBeenNthCalledWith(index + 1, botCommands[value].name, botCommands[value]);
                });
                expect(loginMockObject).toBeCalledWith(process.env.TOKEN);
                expect([...actualEvents.keys()])
                    .toEqual(['ready', 'guildCreate', 'messageCreate', 'interactionCreate']);
                expect(botSetup).toBeTruthy();
            });
        });

    });

    describe('Load Bot - INTEGRATION_TEST', () => {
        test('Loading the bot should call all expected event listeners if it is integration role.', () => {
            process.env.TOKEN = 'SampleToken';
            process.env.CLIENT_ID = '123321123321123211231231';
            process.env.INTEGRATION_TEST = true;
            let restMock = {
                put: jest.fn()
            };
            REST.mockImplementation(() => {
                return {
                    setToken: () => restMock
                };
            });
            let expectedCommandsPayload = Object.keys(botCommands).map(key => {
                let payload = { name: botCommands[key].name, description: botCommands[key].description};
                if (botCommands[key].options) {
                    payload.options = botCommands[key].options;
                }
                return payload;
            });
            let loginMockObject = jest.fn().mockResolvedValue(jest.fn());
            let commandSetMockObject = jest.fn();
            let actualEvents = new Map();
            Discord.Client = jest.fn().mockReturnValue({
                login: loginMockObject,
                on: jest.fn().mockImplementation((eventName, callback) => actualEvents.set(eventName, callback))
            });
            Discord.Collection = jest.fn().mockReturnValue({set: commandSetMockObject});

            return loadBot.initializeBot().then((botSetup) => {
                expect(restMock.put).toHaveBeenCalledTimes(1);
                expect(restMock.put).toHaveBeenCalledWith(undefined, { body: expectedCommandsPayload });
                expect(Routes.applicationCommands).toHaveBeenCalledTimes(1);
                expect(Routes.applicationCommands).toHaveBeenCalledWith(process.env.CLIENT_ID);
                expect(commandSetMockObject).toBeCalledTimes(Object.keys(botCommands).length);
                Object.keys(botCommands).forEach((value, index) => {
                    expect(commandSetMockObject).toHaveBeenNthCalledWith(index + 1, botCommands[value].name, botCommands[value]);
                });
                expect(loginMockObject).toBeCalledWith(process.env.TOKEN);
                expect([...actualEvents.keys()])
                    .toEqual(['ready', 'guildCreate', 'messageCreate', 'interactionCreate']);
                expect(botSetup).toBeTruthy();
            });
        });
    });

    describe('Login Bot - LOCAL', () => {

        test('Loading the bot should call all expected event listeners and run in the test channel if it is Local.', () => {
            process.env.TOKEN = 'SampleToken';
            process.env.CLIENT_ID = '123321123321123211231231';
            process.env.LOCAL = true;
            delete process.env.INTEGRATION_TEST;
            let restMock = {
                put: jest.fn()
            };
            REST.mockImplementation(() => {
                return {
                    setToken: () => restMock
                };
            });
            let expectedCommandsPayload = Object.keys(botCommands).map(key => {
                let payload = { name: botCommands[key].name, description: botCommands[key].description};
                if (botCommands[key].options) {
                    payload.options = botCommands[key].options;
                }
                return payload;
            });
            let loginMockObject = jest.fn().mockResolvedValue(jest.fn());
            let commandSetMockObject = jest.fn();
            let actualEvents = new Map();
            Discord.Client = jest.fn().mockReturnValue({
                login: loginMockObject,
                on: jest.fn().mockImplementation((eventName, callback) => actualEvents.set(eventName, callback))
            });
            Discord.Collection = jest.fn().mockReturnValue({set: commandSetMockObject});

            return loadBot.initializeBot().then((botSetup) => {
                expect(restMock.put).toHaveBeenCalledTimes(1);
                expect(restMock.put).toHaveBeenCalledWith(undefined, { body: expectedCommandsPayload });
                expect(Routes.applicationCommands).toHaveBeenCalledTimes(1);
                expect(Routes.applicationCommands).toHaveBeenCalledWith(process.env.CLIENT_ID);
                expect(commandSetMockObject).toBeCalledTimes(Object.keys(botCommands).length);
                Object.keys(botCommands).forEach((value, index) => {
                    expect(commandSetMockObject).toHaveBeenNthCalledWith(index + 1, botCommands[value].name, botCommands[value]);
                });
                expect(loginMockObject).toBeCalledWith(process.env.TOKEN);
                expect([...actualEvents.keys()])
                    .toEqual(['ready', 'guildCreate', 'messageCreate', 'interactionCreate']);
                expect(botSetup).toBeTruthy();
            });
        });
    });

    describe('Events', () => {

        describe('Message', () => {
            test('When a message event is received. The user should be notified of the new slash commands and the command' +
                'should not be executed..', () => {
                let mockDiscordMessage = {
                    channel: {
                        send: jest.fn()
                    }
                };
                loadBot.messageHandler(mockDiscordMessage);
                expect(mockDiscordMessage.channel.send).toBeCalledTimes(1);
                expect(mockDiscordMessage.channel.send).toHaveBeenCalledWith('Living in the past I see. ' +
                    'Try out our new slash commands! Just type /teams');
            });
        });

        describe('CommandInteraction', () => {
            test('When a Command Interaction event is received, no command should be executed if it does not match.', async () => {
                let msg = buildMockInteraction();
                msg.options = {};
                msg.commandName = 'not-found';
                let mockCommands = new Map();
                mockCommands.set('help', {execute: jest.fn()});
                let mockDiscordBot = {
                    commands: mockCommands
                };
                await loadBot.interactionHandler(msg, mockDiscordBot);
                expect(msg.reply).toBeCalledTimes(0);
                expect(mockDiscordBot.commands.get('help').execute).toBeCalledTimes(0);
            });

            test('When a Command Interaction event is received, the message should execute the expected command.', async () => {
                let msg = buildMockInteraction();
                msg.options = {};
                msg.commandName = 'help';
                let mockCommands = new Map();
                mockCommands.set('help', {execute: jest.fn()});
                let mockDiscordBot = {
                    commands: mockCommands
                };
                const getUserMock = jest.fn();
                const createUserMock = jest.fn();
                clashBotRestClient.UserApi.mockReturnValue({
                    getUser: getUserMock.mockResolvedValue({
                        id: msg.user.id,
                        name: msg.user.username,
                        champions: [],
                        subscriptions: [],
                        serverName: msg.member.guild.name
                    }),
                    createUser: createUserMock.mockResolvedValue({}),
                });
                await loadBot.interactionHandler(msg, mockDiscordBot);
                expect(getUserMock).toHaveBeenCalledTimes(1);
                expect(getUserMock).toHaveBeenCalledWith(msg.user.id);
                expect(msg.reply).not.toHaveBeenCalled();
                expect(mockDiscordBot.commands.get('help').execute).toBeCalledTimes(1);
                expect(createUserMock)
                  .not
                  .toHaveBeenCalled();
            });

            test('When a Command Interaction event is received, and the user does not have a record on the server.', async () => {
                let msg = buildMockInteraction();
                msg.options = {};
                msg.commandName = 'help';
                let mockCommands = new Map();
                mockCommands.set('help', {execute: jest.fn()});
                let mockDiscordBot = {
                    commands: mockCommands
                };
                const getUserMock = jest.fn();
                const createUserMock = jest.fn();
                const expectedRequest = {
                    createUserRequest: {
                        id: msg.user.id,
                        name: msg.user.name,
                        serverName: msg.member.guild.name
                    }
                };
                clashBotRestClient.CreateUserRequest
                  .mockReturnValue(expectedRequest.createUserRequest);
                clashBotRestClient.UserApi.mockReturnValue({
                    getUser: getUserMock.mockRejectedValue(create404HttpError()),
                    createUser: createUserMock.mockResolvedValue({
                        id: msg.user.id,
                        name: msg.user.username,
                        champions: [],
                        subscriptions: [],
                        serverName: msg.member.guild.name
                    }),
                });
                await loadBot.interactionHandler(msg, mockDiscordBot);
                expect(getUserMock).toHaveBeenCalledTimes(1);
                expect(getUserMock).toHaveBeenCalledWith(msg.user.id);
                expect(msg.reply).not.toHaveBeenCalled();
                expect(mockDiscordBot.commands.get('help').execute).toBeCalledTimes(1);
                expect(createUserMock).toHaveBeenCalledTimes(1);
                expect(createUserMock).toHaveBeenCalledWith(expectedRequest);
            });

            test('When a Command Interaction event is received, and fails to retrieve user on the server.', async () => {
                let msg = buildMockInteraction();
                msg.options = {};
                msg.commandName = 'help';
                let mockCommands = new Map();
                mockCommands.set('help', {execute: jest.fn()});
                let mockDiscordBot = {
                    commands: mockCommands
                };
                const getUserMock = jest.fn();
                const createUserMock = jest.fn();
                clashBotRestClient.UserApi.mockReturnValue({
                    getUser: getUserMock.mockRejectedValue(create500HttpError()),
                    createUser: createUserMock.mockResolvedValue({}),
                });
                await loadBot.interactionHandler(msg, mockDiscordBot);
                expect(getUserMock).toHaveBeenCalledTimes(1);
                expect(getUserMock).toHaveBeenCalledWith(msg.user.id);
                expect(createUserMock).not.toHaveBeenCalled();
                expect(msg.reply).toBeCalledTimes(1);
                expect(msg.reply).toBeCalledWith('there was an error trying to execute that command! ' +
                  'Please reach out to <@299370234228506627>.');
                expect(mockDiscordBot.commands.get('help').execute).toBeCalledTimes(0);
            });

            test('When a Command Interaction event is received, and fails to persist the user before executing. A message replying to the Bot owner should be sent.', async () => {
                let msg = buildMockInteraction();
                msg.options = {};
                msg.commandName = 'help';
                let mockCommands = new Map();
                mockCommands.set('help', {
                    name: 'help',
                    execute: jest.fn().mockImplementation(() => {
                            let failure = undefined;
                            // noinspection JSObjectNullOrUndefined
                            failure.hello;
                        }
                    )
                });
                let mockDiscordBot = {
                    commands: mockCommands
                };
                const getUserMock = jest.fn();
                const createUserMock = jest.fn();
                const expectedRequest = {
                    createUserRequest: {
                        id: msg.user.id,
                        name: msg.user.name,
                        serverName: msg.member.guild.name
                    }
                };
                clashBotRestClient.CreateUserRequest
                  .mockReturnValue(expectedRequest.createUserRequest);
                clashBotRestClient.UserApi.mockReturnValue({
                    getUser: getUserMock.mockRejectedValue(create404HttpError()),
                    createUser: createUserMock.mockRejectedValue(create500HttpError()),
                });
                await loadBot.interactionHandler(msg, mockDiscordBot);
                expect(getUserMock).toHaveBeenCalledTimes(1);
                expect(getUserMock).toHaveBeenCalledWith(msg.user.id);
                expect(createUserMock).toHaveBeenCalledTimes(1);
                expect(createUserMock).toHaveBeenCalledWith(expectedRequest);
                expect(msg.reply).toBeCalledTimes(1);
                expect(msg.reply).toBeCalledWith('there was an error trying to execute that command! ' +
                    'Please reach out to <@299370234228506627>.');
                expect(mockDiscordBot.commands.get('help').execute).not.toHaveBeenCalled();
            });

            test('When a Command Interaction event is received, and fails to execute the command. A message replying to the Bot owner should be sent.', async () => {
                let msg = buildMockInteraction();
                msg.options = {};
                msg.commandName = 'help';
                let mockCommands = new Map();
                mockCommands.set('help', {
                    name: 'help',
                    execute: jest.fn().mockImplementation(() => {
                            let failure = undefined;
                            // noinspection JSObjectNullOrUndefined
                            failure.hello;
                        }
                    )
                });
                let mockDiscordBot = {
                    commands: mockCommands
                };
                const getUserMock = jest.fn();
                const createUserMock = jest.fn();
                clashBotRestClient.UserApi.mockReturnValue({
                    getUser: getUserMock.mockResolvedValue({
                        id: msg.user.id,
                        name: msg.user.username,
                        champions: [],
                        subscriptions: [],
                        serverName: msg.member.guild.name
                    }),
                    createUser: createUserMock.mockResolvedValue({}),
                });
                await loadBot.interactionHandler(msg, mockDiscordBot);
                expect(getUserMock).toHaveBeenCalledTimes(1);
                expect(getUserMock).toHaveBeenCalledWith(msg.user.id);
                expect(createUserMock).not.toHaveBeenCalled();
                expect(msg.reply).toBeCalledTimes(1);
                expect(msg.reply).toBeCalledWith('there was an error trying to execute that command! ' +
                    'Please reach out to <@299370234228506627>.');
                expect(mockDiscordBot.commands.get('help').execute).toBeCalledTimes(1);
            });
        });

        describe('Guild Create', () => {
            test('When a guild create event is sent, a help-menu should be displayed on only the general channel.', () => {
                let mockGuildObject = {
                    channels: {
                        cache: [
                            {
                                name: 'general',
                                send: jest.fn().mockResolvedValue({ status: 'Done' })
                            },
                            {
                                name: 'league',
                                send: jest.fn()
                            }
                        ]
                    }
                };
                loadBot.guildCreateHandler(mockGuildObject);
                expect(mockGuildObject.channels.cache[0].send).toBeCalledTimes(1);
                expect(mockGuildObject.channels.cache[0].send).toBeCalledWith({embeds: [helpMenu]});
                expect(mockGuildObject.channels.cache[1].send).toBeCalledTimes(0);
            });

            test('When a guild create event is sent, do not send a message if no channel with the name of general is found.', () => {
                let mockGuildObject = {
                    channels: {
                        cache: [
                            {
                                name: 'league',
                                send: jest.fn()
                            }
                        ]
                    }
                };
                loadBot.guildCreateHandler(mockGuildObject);
                expect(mockGuildObject.channels.cache[0].send).toBeCalledTimes(0);
            });

            test('When a guild create event is sent, and an error occurs then the error should be handled gracefully.', () => {
                let mockGuildObject = {
                    name: 'New Guild',
                };
                expect(() => loadBot.guildCreateHandler(mockGuildObject)).not.toThrow();
            });
        });

        describe('Ready', () => {
            test('When the bot is ready, it should send out an embedded message to only the league channels about the discord bot having an update and to check the Releases page.', () => {
                let mockDiscordBot = {
                    user: {
                        tag: 'ClashBot-Test:1234'
                    },
                    guilds: {
                        cache: [
                            {
                                name: 'Guild 1',
                                channels: {
                                    cache: [
                                        {
                                            name: 'general',
                                            send: jest.fn()
                                        }
                                    ]
                                },
                            },
                            {
                                name: 'Guild 2',
                                channels: {
                                    cache: [
                                        {
                                            name: 'general',
                                            send: jest.fn()
                                        },
                                        {
                                            name: 'league',
                                            send: jest.fn()
                                        }
                                    ]
                                },
                            },
                        ]
                    }
                };
                process.env.DISCORD_BOT_RELEASE_TITLE = 'v1.0.4';
                loadBot.readyHandler(mockDiscordBot, 'league', true);

                let copy = JSON.parse(JSON.stringify(updateNotification));
                copy = templateBuilder.buildMessage(copy, { releaseTitle: process.env.DISCORD_BOT_RELEASE_TITLE });

                expect(mockDiscordBot.guilds.cache[0].channels.cache[0].send).toBeCalledTimes(0);
                expect(mockDiscordBot.guilds.cache[1].channels.cache[0].send).toBeCalledTimes(0);
                expect(mockDiscordBot.guilds.cache[1].channels.cache[1].send).toBeCalledTimes(1);
                expect(mockDiscordBot.guilds.cache[1].channels.cache[1].send).toBeCalledWith({ embeds: [ copy ]});
            });

            test('When the bot is ready, if an error occurs while sending to a guild, it should print it out and continue with the rest.', () => {
                let mockDiscordBot = {
                    user: {
                        tag: 'ClashBot-Test:1234'
                    },
                    guilds: {
                        cache: [
                            {
                                name: 'Guild 1',
                                channels: {
                                    cache: [
                                        {
                                            name: 'general',
                                            send: jest.fn()
                                        },
                                        {
                                            name: 'league',
                                            send: jest.fn().mockImplementation(() => {
                                                    let failure = undefined;
                                                    // noinspection JSObjectNullOrUndefined
                                                    failure.hello;
                                                }
                                            )
                                        }
                                    ]
                                },
                            },
                            {
                                name: 'Guild 2',
                                channels: {
                                    cache: [
                                        {
                                            name: 'general',
                                            send: jest.fn()
                                        },
                                        {
                                            name: 'league',
                                            send: jest.fn()
                                        }
                                    ]
                                },
                            },
                        ]
                    }
                };
                process.env.DISCORD_BOT_RELEASE_TITLE = 'v1.0.4';
                loadBot.readyHandler(mockDiscordBot, 'league', true);

                let copy = JSON.parse(JSON.stringify(updateNotification));
                copy = templateBuilder.buildMessage(copy, { releaseTitle: process.env.DISCORD_BOT_RELEASE_TITLE });
                expect(mockDiscordBot.guilds.cache[0].channels.cache[0].send).toBeCalledTimes(0);
                expect(mockDiscordBot.guilds.cache[0].channels.cache[1].send).toBeCalledTimes(1);
                expect(mockDiscordBot.guilds.cache[0].channels.cache[1].send).toBeCalledWith({ embeds: [ copy ]});
                expect(mockDiscordBot.guilds.cache[1].channels.cache[0].send).toBeCalledTimes(0);
                expect(mockDiscordBot.guilds.cache[1].channels.cache[1].send).toBeCalledTimes(1);
                expect(mockDiscordBot.guilds.cache[1].channels.cache[1].send).toBeCalledWith({ embeds: [ copy ]});
            });

            test('When the integration test argument is given, then the ready command should not send the update.', () => {
                let mockDiscordBot = {
                    user: {
                        tag: 'ClashBot-Test:1234'
                    },
                    guilds: {
                        cache: [
                            {
                                name: 'Guild 1',
                                channels: {
                                    cache: [
                                        {
                                            name: 'general',
                                            send: jest.fn()
                                        }
                                    ]
                                },
                            },
                            {
                                name: 'Guild 2',
                                channels: {
                                    cache: [
                                        {
                                            name: 'general',
                                            send: jest.fn()
                                        },
                                        {
                                            name: 'league',
                                            send: jest.fn()
                                        }
                                    ]
                                },
                            },
                        ]
                    }
                };
                loadBot.readyHandler(mockDiscordBot, 'league', false);
                expect(mockDiscordBot.guilds.cache[0].channels.cache[0].send).toBeCalledTimes(0);
                expect(mockDiscordBot.guilds.cache[1].channels.cache[0].send).toBeCalledTimes(0);
                expect(mockDiscordBot.guilds.cache[1].channels.cache[1].send).toBeCalledTimes(0);
            });
        });
    });
});