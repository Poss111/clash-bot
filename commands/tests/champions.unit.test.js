const champions = require('../champions');
const templateBuilder = require('../../utility/template-builder');
const template = require('../../templates/champion-description');
const riotApi = require('@fightmegg/riot-api');

const aatroxData = require('./test-data/aatrox-data');
const ahriData = require('./test-data/ahri-data');
const akaliData = require('./test-data/akali-data');
const alistarData = require('./test-data/alistar-data');
const aniviaData = require('./test-data/anivia-data');

jest.mock('@fightmegg/riot-api/');

describe('Champions Command', () => {

    test('The champions command should return an embedded message with at most 5 champions specified to the specific user.', async () => {
        let msg = {
            member: {
                send: jest.fn()
            }
        };

        let expectedArguments = buildExpectedChampionList();

        await champions.execute(msg);
        expect(msg.member.send.mock.calls).toEqual(expectedArguments);
    })

    test('The champions command should return a specific champion if one is passed.', async () => {
        let msg = {
            member: {
                send: jest.fn()
            }
        };

        let expectedArguments = buildExpectedChampionList();
        let expectedMessage = expectedArguments.filter(record => record[0].embed.title.includes('Aatrox'));

        await champions.execute(msg, ['Aatrox']);
        expect(msg.member.send.mock.calls).toEqual(expectedMessage);
    })

    test('The champions command should return a specific champion if one is partially passed.', async () => {
        let msg = {
            member: {
                send: jest.fn()
            },
            reply: jest.fn()
        };

        let expectedArguments = buildExpectedChampionList();
        let expectedMessage = expectedArguments.filter(record => record[0].embed.title.includes('Aatrox'));

        await champions.execute(msg, ['Aa']);
        expect(msg.member.send.mock.calls).toEqual(expectedMessage);
    })

    test('The champions command should return a specific champion if one is in a different case is passed.', async () => {
        let msg = {
            member: {
                send: jest.fn()
            },
            reply: jest.fn()
        };

        let expectedArguments = buildExpectedChampionList();
        let expectedMessage = expectedArguments.filter(record => record[0].embed.title.includes('Aatrox'));

        await champions.execute(msg, ['aa']);
        expect(msg.member.send.mock.calls).toEqual(expectedMessage);
    })

    test('If the champion they specified is not found, then send a response to let them know.', async () => {
        let msg = {
            member: {
                send: jest.fn()
            },
            reply: jest.fn()
        };
        buildExpectedChampionList();

        await champions.execute(msg, ['DNE']);
        expect(msg.reply.mock.calls).toEqual([['Could not find the champion specified.']]);
    })
})

function buildExpectedChampionList() {
    return buildExpectedChampionReturn(['Aatrox', 'Ahri', 'Akali', 'Alistar', 'Anivia']);
}

function getChampionDataByName(championName) {
    let championData = {};
    switch (championName) {
        case 'Aatrox':
            championData = aatroxData;
            break;
        case 'Ahri':
            championData = ahriData;
            break;
        case 'Akali':
            championData = akaliData;
            break;
        case 'Alistar':
            championData = alistarData;
            break;
        case 'Anivia':
            championData = aniviaData;
            break;
    }
    return championData;
}

function getChampionData(championName) {
    const championData = getChampionDataByName(championName);
    return {
        championName: championName,
        championTitle: championData.data[championName].title,
        lore: championData.data[championName].lore,
        tag: championData.data[championName].tags[1] ?
            `${championData.data[championName].tags[0]} - ${championData.data[championName].tags[1]}`
            : championData.data[championName].tags[0],
        imageUrl: championData.data[championName].image.full,
        version: championData.version
    };
}

function buildListOfChampionData(championName) {
    return {id: championName};
}

function buildEmbeddedMessage(dataAnivia) {
    return {embed: templateBuilder.buildMessage(template, dataAnivia)};
}

function buildExpectedChampionReturn(expectedChampionNameArray) {
    let expectedArguments = [];
    let expectedChampionsData = {data: {}};
    for (const championNameIndex in expectedChampionNameArray) {
        expectedChampionsData.data[expectedChampionNameArray[championNameIndex]] = buildListOfChampionData(expectedChampionNameArray[championNameIndex]);
        expectedArguments.push([buildEmbeddedMessage(getChampionData(expectedChampionNameArray[championNameIndex]))]);
    }
    riotApi.DDragon = jest.fn().mockImplementation(() => {
        return {
            champion: {
                all: jest.fn().mockReturnValue(expectedChampionsData),
                byName: jest.fn().mockImplementation(({championName: name}) => {
                    return getChampionDataByName(name);
                })
            }
        };
    });
    return expectedArguments;
}
