const {parseUserInfo} = require('../user-information-service-impl')

describe('User Information Service', () => {
    test('If a interaction type is passed down, then the users name, id and guild should be pulled from it.', () => {
        const interaction = {
            user: {
                id: '299370234228506627',
                bot: false,
                system: false,
                username: 'Roïdräge',
                discriminator: '2657',
                avatar: '6c92da2b38d007faeec00430035822f4'
            },
            member: {
                guild: {
                    id: '837685892885512202',
                    name: 'LoL-ClashBotSupport',
                    icon: null,
                    features: []
                }
            }
        };
        const response = parseUserInfo(interaction);
        expect(response.id).toEqual(interaction.user.id)
        expect(response.username).toEqual(interaction.user.username)
        expect(response.guild).toEqual(interaction.member.guild.name)
    })

    test('If a message type is passed down, then the users name, id and guild should be pulled from it.', () => {
        const message = {
            author: {
                id: '299370234228506627',
                bot: false,
                system: false,
                username: 'Roïdräge',
                discriminator: '2657',
                avatar: '6c92da2b38d007faeec00430035822f4'
            },
            guild: {
                id: '837685892885512202',
                name: 'LoL-ClashBotSupport',
                icon: null,
                features: []
            }
        };
        const response = parseUserInfo(message);
        expect(response.id).toEqual(message.author.id)
        expect(response.username).toEqual(message.author.username)
        expect(response.guild).toEqual(message.guild.name)
    })
})
