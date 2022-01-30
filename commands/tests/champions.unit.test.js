const champions = require('../champions');
const championTemplate = require('../../templates/champion-description');
const templateBuilder = require('../../utility/template-builder');
const template = require('../../templates/champion-description');
const riotApi = require('@fightmegg/riot-api');
const {buildMockInteraction} = require('./shared-test-utilities/shared-test-utilities.test');

const aatroxData = require('./test-data/aatrox-data');
const ahriData = require('./test-data/ahri-data');
const akaliData = require('./test-data/akali-data');
const alistarData = require('./test-data/alistar-data');
const aniviaData = require('./test-data/anivia-data');

jest.mock('@fightmegg/riot-api/');

describe('Champions Command', () => {

    test('The champions command should return an embedded message with at most 5 champions specified to the specific user.', async () => {
        const msg = buildMockInteraction();
        let createDmResponse = {
          send: jest.fn()
        };

        let expectedArguments = buildExpectedChampionList();
        msg.createDM.mockResolvedValue(createDmResponse);

        await champions.execute(msg);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.createDM).toHaveBeenCalledTimes(1);
        expect(msg.createDM).toHaveBeenCalledWith(false);
        expect(createDmResponse.send).toHaveBeenCalledTimes(1);
        expect(createDmResponse.send).toHaveBeenCalledWith(expectedArguments);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith({ content: 'Check your DMs.', ephemeral: true});
    })

    test('The champions command should return a specific champion if one is passed.', async () => {
        const msg = buildMockInteraction();
        let createDmResponse = {
            send: jest.fn()
        };

        let expectedArguments = buildExpectedChampionList();
        msg.createDM.mockResolvedValue(createDmResponse);

        expectedArguments.embeds = expectedArguments.embeds
            .filter(record => record.title.includes('Aatrox'));

        await champions.execute(msg, ['Aatrox']);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.createDM).toHaveBeenCalledTimes(1);
        expect(msg.createDM).toHaveBeenCalledWith(false);
        expect(createDmResponse.send).toHaveBeenCalledTimes(1);
        expect(createDmResponse.send).toHaveBeenCalledWith(expectedArguments);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith({ content: 'Check your DMs.', ephemeral: true});
    })

    test('The champions command should return a specific champion if one is partially passed.', async () => {
        const msg = buildMockInteraction();
        let createDmResponse = {
            send: jest.fn()
        };

        let expectedArguments = buildExpectedChampionList();
        msg.createDM.mockResolvedValue(createDmResponse);

        expectedArguments.embeds = expectedArguments.embeds
            .filter(record => record.title.includes('Aa'));

        await champions.execute(msg, ['Aa']);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.createDM).toHaveBeenCalledTimes(1);
        expect(msg.createDM).toHaveBeenCalledWith(false);
        expect(createDmResponse.send).toHaveBeenCalledTimes(1);
        expect(createDmResponse.send).toHaveBeenCalledWith(expectedArguments);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith({ content: 'Check your DMs.', ephemeral: true});
    })

    test('The champions command should return a specific champion if one is in a different case is passed.', async () => {
        const msg = buildMockInteraction();
        let createDmResponse = {
            send: jest.fn()
        };

        let expectedArguments = buildExpectedChampionList();
        msg.createDM.mockResolvedValue(createDmResponse);

        expectedArguments.embeds = expectedArguments.embeds
            .filter(record => record.title.includes('Aa'));

        await champions.execute(msg, ['aa']);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.createDM).toHaveBeenCalledTimes(1);
        expect(msg.createDM).toHaveBeenCalledWith(false);
        expect(createDmResponse.send).toHaveBeenCalledTimes(1);
        expect(createDmResponse.send).toHaveBeenCalledWith(expectedArguments);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith({ content: 'Check your DMs.', ephemeral: true});
    })

    test('If the champion they specified is not found, then send a response to let them know.', async () => {
        const msg = buildMockInteraction();
        buildExpectedChampionList();

        await champions.execute(msg, ['DNE']);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith('Could not find the champion specified.');
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
    return templateBuilder.buildMessage(template, dataAnivia);
}

function buildExpectedChampionReturn(expectedChampionNameArray) {
    let expectedArguments = [];
    let expectedChampionsData = {data: {}};
    for (const championNameIndex in expectedChampionNameArray) {
        expectedChampionsData.data[expectedChampionNameArray[championNameIndex]]
            = buildListOfChampionData(expectedChampionNameArray[championNameIndex]);
        expectedArguments.push(buildEmbeddedMessage(getChampionData(expectedChampionNameArray[championNameIndex])));
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
    return { embeds: expectedArguments};
}
