const time = require('../time');
const clashTimeMenu = require('../../templates/clash-times-menu');
const clashTimeFields = require('../../templates/clash-time-fields');
const templateBuilder = require('../../utility/template-builder');
const {buildMockInteraction} = require('./shared-test-utilities/shared-test-utilities.test');
const moment = require('moment-timezone');
const clashBotRestClient = require('clash-bot-rest-client');

jest.mock('clash-bot-rest-client');

const expectedDateFormat = 'MMMM DD yyyy hh:mm a z';
const expectedTournamentFormat = 'MMMM DD yyyy';
const expectedTierTimeFormat = 'h:mm a z';

beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
});

function buildExpectedTournamentTimesResponse(sampleTime) {
    let copy = JSON.parse(JSON.stringify(clashTimeMenu));
    moment.tz.setDefault('America/Los_Angeles');
    sampleTime.forEach(time => {
        let timeCopy = JSON.parse(JSON.stringify(clashTimeFields));
        const expectedParsedTournamentDate = new moment(time.registrationTime, expectedDateFormat)
            .format(expectedTournamentFormat);
        const expectedParsedRegistrationDate = new moment(time.registrationTime, expectedDateFormat);
        const tierFourTime = new moment(time.registrationTime, expectedDateFormat).format(expectedTierTimeFormat);
        const tierThreeTime = new moment(expectedParsedRegistrationDate).add('45', 'minutes')
            .format(expectedTierTimeFormat);
        const tierTwoTime = new moment(expectedParsedRegistrationDate).add('90', 'minutes')
            .format(expectedTierTimeFormat);
        const tierOneTime = new moment(expectedParsedRegistrationDate).add('135', 'minutes')
            .format(expectedTierTimeFormat);
        const expectedPayload = {
            tournamentName: time.tournamentName,
            tournamentDay: time.tournamentDay,
            tournamentDate: expectedParsedTournamentDate,
            tierFourTime: tierFourTime,
            tierThreeTime: tierThreeTime,
            tierTwoTime: tierTwoTime,
            tierOneTime: tierOneTime
        };
        copy.fields.push(templateBuilder.buildMessage(timeCopy, expectedPayload));
    });
    return copy;
}

function buildExpectedNoTimesAvailableResponse() {
    let copy = JSON.parse(JSON.stringify(clashTimeMenu));
    copy.fields.push({
        name: 'No times available',
        value: 'N/A',
        inline: false
    });
    return copy;
}

function setupGetTournamentsMock(sampleTime) {
    let getTournamentsMock = jest.fn();
    clashBotRestClient.TournamentApi.mockReturnValue({
        getTournaments: getTournamentsMock.mockResolvedValue(sampleTime)
    });
    return getTournamentsMock;
}

describe('League Clash Times', () => {

    test('When league times returns successfully, there should be a formatted time for each available clash and tier returned.', async () => {
        let msg = buildMockInteraction();
        let sampleTime = [
            {
                tournamentName: 'awesome_sauce',
                tournamentDay: '1',
                startTime: 'June 26 2021 07:00 pm PDT',
                registrationTime: 'June 26 2021 04:15 pm PDT'
            }
        ];
        let copy = buildExpectedTournamentTimesResponse(sampleTime);
        let getTournamentsMock = setupGetTournamentsMock(sampleTime);
        await time.execute(msg);
        expect(getTournamentsMock).toHaveBeenCalledTimes(1);
        expect(getTournamentsMock).toHaveBeenCalledWith({});
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith({embeds: [copy]});
    });

    test('When league times returns as undefined, there should be a no times available message returned.', async () => {
        let msg = buildMockInteraction();
        let copy = buildExpectedNoTimesAvailableResponse();
        let getTournamentsMock = setupGetTournamentsMock(undefined);
        await time.execute(msg);
        expect(getTournamentsMock).toHaveBeenCalledTimes(1);
        expect(getTournamentsMock).toHaveBeenCalledWith({});
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith({embeds: [copy]});
    });

    test('When league times returns as empty, there should be a no times available message returned.', async () => {
        let msg = buildMockInteraction();
        let copy = buildExpectedNoTimesAvailableResponse();
        let getTournamentsMock = setupGetTournamentsMock([]);
        await time.execute(msg);
        expect(getTournamentsMock).toHaveBeenCalledTimes(1);
        expect(getTournamentsMock).toHaveBeenCalledWith({});
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith({embeds: [copy]});
    });

    test('When there are more than 4 tournaments returned, then it should be trimmed to only work with 4.', async () => {
        let msg = buildMockInteraction();
        let sampleTime = [
            {
                tournamentName: 'awesome_sauce',
                tournamentDay: '1',
                startTime: 'June 26 2021 07:00 pm PDT',
                registrationTime: 'June 26 2021 04:15 pm PDT'
            },
            {
                tournamentName: 'awesome_sauce',
                tournamentDay: '2',
                startTime: 'June 26 2021 07:00 pm PDT',
                registrationTime: 'June 26 2021 04:15 pm PDT'
            },
            {
                tournamentName: 'awesome_sauce',
                tournamentDay: '3',
                startTime: 'June 26 2021 07:00 pm PDT',
                registrationTime: 'June 26 2021 04:15 pm PDT'
            },
            {
                tournamentName: 'awesome_sauce',
                tournamentDay: '4',
                startTime: 'June 26 2021 07:00 pm PDT',
                registrationTime: 'June 26 2021 04:15 pm PDT'
            },
            {
                tournamentName: 'awesome_sauce',
                tournamentDay: '5',
                startTime: 'June 26 2021 07:00 pm PDT',
                registrationTime: 'June 26 2021 04:15 pm PDT'
            }
        ];
        let copy = buildExpectedTournamentTimesResponse(sampleTime);
        copy.fields = copy.fields.slice(0,4);
        let getTournamentsMock = setupGetTournamentsMock(sampleTime);
        await time.execute(msg);
        expect(getTournamentsMock).toHaveBeenCalledTimes(1);
        expect(getTournamentsMock).toHaveBeenCalledWith({});
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledTimes(1);
        expect(msg.editReply).toHaveBeenCalledWith({embeds: [copy]});
    });

});
