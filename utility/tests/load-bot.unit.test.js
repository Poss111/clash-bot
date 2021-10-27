const discordModulePath = 'discord.js';
const commandsModulePath = '../../commands';
const Discord = require('discord.js');
const botCommands = require(commandsModulePath);
const helpMenu = require('../../templates/help-menu');
const userServiceImpl = require('../../services/user-service-impl');
const updateNotification = require('../../templates/update-notification');
const loadBot = require('../load-bot');

jest.mock(discordModulePath);
jest.mock(commandsModulePath);
jest.mock('../../services/user-service-impl')

beforeEach(() => {
    jest.resetAllMocks();
    delete process.env.LOCAL;
    delete process.env.INTEGRATION_TEST;
    delete process.env.TOKEN;
})

describe('Load Bot', () => {
    test('Loading the bot should call all expected event listeners if not integration role.', () => {
        process.env.TOKEN = 'SampleToken';
        let loginMockObject = jest.fn().mockResolvedValue(jest.fn());
        let commandSetMockObject = jest.fn();
        let actualEvents = new Map();
        Discord.Client = jest.fn().mockReturnValue({
            login: loginMockObject,
            on: jest.fn().mockImplementation((eventName, callback) => actualEvents.set(eventName, callback))
        });
        Discord.Collection = jest.fn().mockReturnValue({set: commandSetMockObject});

        return loadBot.initializeBot().then((botSetup) => {
            expect(commandSetMockObject).toBeCalledTimes(Object.keys(botCommands).length);
            Object.keys(botCommands).forEach((value, index) => {
                expect(commandSetMockObject).toHaveBeenNthCalledWith(index + 1, botCommands[value].name, botCommands[value]);
            });
            expect(loginMockObject).toBeCalledWith(process.env.TOKEN);
            expect(actualEvents.size).toEqual(3);
            expect(actualEvents.get('ready')).toBeTruthy();
            expect(actualEvents.get('guildCreate')).toBeTruthy();
            expect(actualEvents.get('message')).toBeTruthy();
            expect(botSetup).toBeTruthy();
        })
    })

})
describe('Load Bot - INTEGRATION_TEST', () => {
    test('Loading the bot should call all expected event listeners if it is integration role.', () => {
        process.env.TOKEN = 'SampleToken';
        process.env.INTEGRATION_TEST = true;
        let loginMockObject = jest.fn().mockResolvedValue(jest.fn());
        let commandSetMockObject = jest.fn();
        let actualEvents = new Map();
        Discord.Client = jest.fn().mockReturnValue({
            login: loginMockObject,
            on: jest.fn().mockImplementation((eventName, callback) => actualEvents.set(eventName, callback))
        });
        Discord.Collection = jest.fn().mockReturnValue({set: commandSetMockObject});

        return loadBot.initializeBot().then((botSetup) => {
            expect(commandSetMockObject).toBeCalledTimes(Object.keys(botCommands).length);
            Object.keys(botCommands).forEach((value, index) => {
                expect(commandSetMockObject).toHaveBeenNthCalledWith(index + 1, botCommands[value].name, botCommands[value]);
            });
            expect(loginMockObject).toBeCalledWith(process.env.TOKEN);
            expect(actualEvents.size).toEqual(3);
            expect(actualEvents.get('guildCreate')).toBeTruthy();
            expect(actualEvents.get('message')).toBeTruthy();
            expect(actualEvents.get('ready')).toBeTruthy();
            expect(botSetup).toBeTruthy();
        })
    })
})

describe('Login Bot - LOCAL', () => {

    test('Loading the bot should call all expected event listeners and run in the test channel if it is Local.', () => {
        process.env.TOKEN = 'SampleToken';
        process.env.LOCAL = true;
        delete process.env.INTEGRATION_TEST;
        let loginMockObject = jest.fn().mockResolvedValue(jest.fn());
        let commandSetMockObject = jest.fn();
        let actualEvents = new Map();
        Discord.Client = jest.fn().mockReturnValue({
            login: loginMockObject,
            on: jest.fn().mockImplementation((eventName, callback) => actualEvents.set(eventName, callback))
        });
        Discord.Collection = jest.fn().mockReturnValue({set: commandSetMockObject});

        return loadBot.initializeBot().then((botSetup) => {
            expect(commandSetMockObject).toBeCalledTimes(Object.keys(botCommands).length);
            Object.keys(botCommands).forEach((value, index) => {
                expect(commandSetMockObject).toHaveBeenNthCalledWith(index + 1, botCommands[value].name, botCommands[value]);
            });
            expect(loginMockObject).toBeCalledWith(process.env.TOKEN);
            expect(actualEvents.size).toEqual(3);
            expect(actualEvents.get('guildCreate')).toBeTruthy();
            expect(actualEvents.get('message')).toBeTruthy();
            expect(botSetup).toBeTruthy();
        })
    })
})

describe('Events', () => {
    describe('Message', () => {
        test('When a message event is received, the message should only accept commands from channel league and command should start with !clash', () => {
            let restrictedChannel = 'league';
            let commandPrefix = '!clash';
            let mockDiscordMessage = {
                channel: {
                    name: 'wrong-channel',
                    send: jest.fn()
                },
                content: `${commandPrefix} help`
            };
            let mockCommands = new Map();
            mockCommands.set('help', {execute: jest.fn()})
            let mockDiscordBot = {
                commands: mockCommands
            };
            loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
            expect(mockDiscordMessage.channel.send).toBeCalledTimes(0);
            expect(mockDiscordBot.commands.get('help').execute).toBeCalledTimes(0);
        })

        test('When a message event is received, the message should only accept commands with !clash', () => {
            let restrictedChannel = 'league';
            let commandPrefix = '!clash';
            let mockDiscordMessage = {
                channel: {
                    name: restrictedChannel,
                    send: jest.fn()
                },
                content: `!cash help`
            };
            let mockCommands = new Map();
            mockCommands.set('help', {execute: jest.fn()})
            let mockDiscordBot = {
                commands: mockCommands
            };
            loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
            expect(mockDiscordMessage.channel.send).toBeCalledTimes(0);
            expect(mockDiscordBot.commands.get('help').execute).toBeCalledTimes(0);
        })

        test('When a message event is received, the message should only accept commands with !clash (user gives no space between command and prefix)', () => {
            let restrictedChannel = 'league';
            let commandPrefix = '!clash';
            let mockDiscordMessage = {
                channel: {
                    name: restrictedChannel,
                    send: jest.fn()
                },
                content: `!cashhelp`
            };
            let mockCommands = new Map();
            mockCommands.set('help', {execute: jest.fn()})
            let mockDiscordBot = {
                commands: mockCommands
            };
            loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
            expect(mockDiscordMessage.channel.send).toBeCalledTimes(0);
            expect(mockDiscordBot.commands.get('help').execute).toBeCalledTimes(0);
        })

        test('When a message event is received, there should be no execution if there is not a matching command from the user with the channel league and the command following the prefix !clash', () => {
            let restrictedChannel = 'league';
            let commandPrefix = '!clash';
            let mockDiscordMessage = {
                channel: {
                    name: restrictedChannel,
                    send: jest.fn()
                },
                content: `${commandPrefix} dne`,
                author: {
                    username: 'Test User'
                }
            };
            let mockCommands = new Map();
            mockCommands.set('help', {execute: jest.fn()})
            let mockDiscordBot = {
                commands: mockCommands
            };
            loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
            expect(mockDiscordMessage.channel.send).toBeCalledTimes(0);
            expect(mockDiscordBot.commands.get('help').execute).toBeCalledTimes(0);
        })

        test('When a message event is received, the message should execute the expected command from channel league and the command following the prefix !clash', async () => {
            let restrictedChannel = 'league';
            let commandPrefix = '!clash';
            let mockDiscordMessage = {
                channel: {
                    name: restrictedChannel,
                    send: jest.fn()
                },
                content: `${commandPrefix} help`,
                author: {
                    username: 'Test User',
                    id: '1'
                },
                guild: {
                    name: 'Server'
                },
                reply: jest.fn()
            };
            let mockCommands = new Map();
            mockCommands.set('help', {execute: jest.fn()})
            let mockDiscordBot = {
                commands: mockCommands
            };
            userServiceImpl.postVerifyUser.mockResolvedValue({});
            await loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
            expect(mockDiscordMessage.channel.send).toBeCalledTimes(0);
            expect(mockDiscordBot.commands.get('help').execute).toBeCalledTimes(1);
            expect(userServiceImpl.postVerifyUser).toHaveBeenCalledTimes(1);
            expect(userServiceImpl.postVerifyUser).toHaveBeenCalledWith(mockDiscordMessage.author.id, mockDiscordMessage.author.username, mockDiscordMessage.guild.name);
        })

        test('When a message event is received, and the command is executed but fails to execute. A message replying to the Bot owner should be sent.', async () => {
            let restrictedChannel = 'league';
            let commandPrefix = '!clash';
            let mockDiscordMessage = {
                channel: {
                    name: restrictedChannel,
                    send: jest.fn()
                },
                content: `${commandPrefix} help`,
                author: {
                    username: 'Test User',
                    id: '1'
                },
                guild: {
                    name: 'Server'
                },
                reply: jest.fn()
            };
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
            userServiceImpl.postVerifyUser.mockResolvedValue({});
            await loadBot.messageHandler(mockDiscordMessage, restrictedChannel, commandPrefix, mockDiscordBot);
            expect(mockDiscordMessage.channel.send).toBeCalledTimes(1);
            expect(mockDiscordMessage.channel.send).toBeCalledWith('there was an error trying to execute that command! Please reach out to <@299370234228506627>.');
            expect(mockDiscordBot.commands.get('help').execute).toBeCalledTimes(1);
            expect(userServiceImpl.postVerifyUser).toHaveBeenCalledTimes(1);
            expect(userServiceImpl.postVerifyUser).toHaveBeenCalledWith(mockDiscordMessage.author.id, mockDiscordMessage.author.username, mockDiscordMessage.guild.name);
        })
    })

    describe('Guild Create', () => {
        test('When a guild create event is sent, a help-menu should be displayed on only the general channel.', () => {
            let mockGuildObject = {
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
                }
            };
            loadBot.guildCreateHandler(mockGuildObject);
            expect(mockGuildObject.channels.cache[0].send).toBeCalledTimes(1);
            expect(mockGuildObject.channels.cache[0].send).toBeCalledWith({embed: helpMenu});
            expect(mockGuildObject.channels.cache[1].send).toBeCalledTimes(0);
        })
    })

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
            }
            loadBot.readyHandler(mockDiscordBot, 'league');
            expect(mockDiscordBot.guilds.cache[0].channels.cache[0].send).toBeCalledTimes(0);
            expect(mockDiscordBot.guilds.cache[1].channels.cache[0].send).toBeCalledTimes(0);
            expect(mockDiscordBot.guilds.cache[1].channels.cache[1].send).toBeCalledTimes(1);
            expect(mockDiscordBot.guilds.cache[1].channels.cache[1].send).toBeCalledWith({ embed: updateNotification });
        })

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
            }
            loadBot.readyHandler(mockDiscordBot, 'league');
            expect(mockDiscordBot.guilds.cache[0].channels.cache[0].send).toBeCalledTimes(0);
            expect(mockDiscordBot.guilds.cache[0].channels.cache[1].send).toBeCalledTimes(1);
            expect(mockDiscordBot.guilds.cache[0].channels.cache[1].send).toBeCalledWith({ embed: updateNotification });
            expect(mockDiscordBot.guilds.cache[1].channels.cache[0].send).toBeCalledTimes(0);
            expect(mockDiscordBot.guilds.cache[1].channels.cache[1].send).toBeCalledTimes(1);
            expect(mockDiscordBot.guilds.cache[1].channels.cache[1].send).toBeCalledWith({ embed: updateNotification });
        })

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
            }
            loadBot.readyHandler(mockDiscordBot, 'league', true);
            expect(mockDiscordBot.guilds.cache[0].channels.cache[0].send).toBeCalledTimes(0);
            expect(mockDiscordBot.guilds.cache[1].channels.cache[0].send).toBeCalledTimes(0);
            expect(mockDiscordBot.guilds.cache[1].channels.cache[1].send).toBeCalledTimes(0);
        })
    })
})
