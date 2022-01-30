const time = require('../time');
const tournamentsServiceImpl = require('../../services/tournaments-service-impl');
const clashTimeMenu = require('../../templates/clash-times-menu');
const clashTimeFields = require('../../templates/clash-time-fields');
const templateBuilder = require('../../utility/template-builder');
const { buildMockInteraction } = require('./shared-test-utilities/shared-test-utilities.test');
const moment = require('moment-timezone');

jest.mock('../../services/tournaments-service-impl');

const expectedDateFormat = 'MMMM DD yyyy hh:mm a z';
const expectedTournamentFormat = 'MMMM DD yyyy';
const expectedTierTimeFormat = 'h:mm a z';

beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
})

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
        }
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

describe('League Clash Times', () => {

    test('When league times returns successfully, there should be a formatted time for each available clash and tier returned.', async () => {
        let msg = buildMockInteraction();
        let sampleTime =  [
            {
                tournamentName: 'awesome_sauce',
                tournamentDay: '1',
                startTime: 'June 26 2021 07:00 pm PDT',
                registrationTime: 'June 26 2021 04:15 pm PDT'
            }];
        let copy = buildExpectedTournamentTimesResponse(sampleTime);
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(sampleTime);
        await time.execute(msg);
        expect(tournamentsServiceImpl.retrieveAllActiveTournaments).toHaveBeenCalledTimes(1);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith({ embeds: [ copy ]});
    })

    test('When league times returns as undefined, there should be a no times available message returned.', async () => {
        let msg = buildMockInteraction();
        let copy = buildExpectedNoTimesAvailableResponse();
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue(undefined);
        await time.execute(msg);
        expect(tournamentsServiceImpl.retrieveAllActiveTournaments).toHaveBeenCalledTimes(1);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith({ embeds: [ copy ]});
    })

    test('When league times returns as empty, there should be a no times available message returned.', async () => {
        let msg = buildMockInteraction();
        let copy = buildExpectedNoTimesAvailableResponse();
        tournamentsServiceImpl.retrieveAllActiveTournaments.mockResolvedValue([]);
        await time.execute(msg);
        expect(msg.deferReply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledTimes(1);
        expect(msg.reply).toHaveBeenCalledWith({ embeds: [ copy ]});
    })

})
