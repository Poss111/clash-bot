const templateBuilder = require('../template-builder');

describe('Build message from JSON Object and template', () => {
    test('I should be able to pass a JSON Object and replace all matching keys.', () => {
        let data = {
            championName: 'Ahri',
            championTitle: 'The quick',
            Blurb: 'I love to create apps',
            tagOne: 'Mage',
            tagTwo: 'Assassin',
            imageUrl: 'Ahri-0.png'
        };

        let template = {
            title: ":championName - :championTitle",
            description: ":Blurb",
            color: null,
            fields: [
                {
                    name: "Type",
                    value: ":tagOne - :tagTwo"
                }
            ],
            thumbnail: {
                url: "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/:imageUrl"
            }
        };

        let actualMessage = templateBuilder.buildMessage(template, data);
        expect(actualMessage.title).toEqual(`${data.championName} - ${data.championTitle}`);
        expect(actualMessage.description).toEqual(data.Blurb);
        expect(actualMessage.fields[0].value).toEqual(`${data.tagOne} - ${data.tagTwo}`);
        expect(actualMessage.thumbnail.url).toContain(data.imageUrl);
    })

    test('I should return with an empty object if no template is passed.', () => {
        expect(templateBuilder.buildMessage(undefined, {})).toEqual({});
    })

    test('I should return with an the template if an empty data is passed.', () => {
        let template = {
            title: ":championName - :championTitle",
            description: ":Blurb",
            color: null,
            fields: [
                {
                    name: "Type",
                    value: ":tagOne - :tagTwo"
                }
            ],
            thumbnail: {
                url: "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/:imageUrl"
            }
        };
        expect(templateBuilder.buildMessage(template, {})).toEqual(template);
    });

    test('I should return with an the template if no data is passed.', () => {
        let template = {
            title: ":championName - :championTitle",
            description: ":Blurb",
            color: null,
            fields: [
                {
                    name: "Type",
                    value: ":tagOne - :tagTwo"
                }
            ],
            thumbnail: {
                url: "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/:imageUrl"
            }
        };
        expect(templateBuilder.buildMessage(template)).toEqual({});
    });
})
