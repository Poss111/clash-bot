const clashtimeDb = require('../clashtime-db-impl');
const dynamodb = require('dynamodb');
const streamTest = require('streamtest');
const moment = require('moment-timezone');

jest.mock('dynamodb');

test('Should fail a return with a reject if the TOKEN is not passed.', () => {
    return expect(clashtimeDb.initializeLeagueData()).rejects.toMatch('TOKEN not found.');
})

test('Should return a parsed array of human readable dates from the League Clash API and should be sorted by day.', () => {
    process.env.TOKEN = 'testToken';
    const value = {
        Items: [{
            attrs: {
                key: "msi2021#3",
                tournamentName: "msi2021",
                tournamentDay: "4",
                registrationTime: "June 13 2021 04:15 pm PDT",
                startTime: "June 13 2021 05:15 pm PDT"
            }
        }, {
            attrs: {
                    key: "msi2021#4",
                    tournamentName: "msi2021",
                    tournamentDay: "3",
                    registrationTime: "June 12 2021 04:15 pm PDT",
                    startTime: "June 12 2021 05:15 pm PDT",
                }
        }]
    };
    const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromObjects([value]));
    dynamodb.define = jest.fn().mockReturnValue({
        scan: jest.fn().mockReturnThis(),
        filterExpression: jest.fn().mockReturnThis(),
        expressionAttributeValues: jest.fn().mockReturnThis(),
        expressionAttributeNames: jest.fn().mockReturnThis(),
        exec: mockStream
    });

    let expectedData = [];
    value.Items.forEach(record => {
        expectedData.push(JSON.parse(JSON.stringify(record.attrs)));
    });
    expectedData.sort((a,b) => parseInt(a.tournamentDay) - parseInt(b.tournamentDay));

    return clashtimeDb.initializeLeagueData().then(data => {
        expect(data).toEqual(expectedData);
    });
})

test('Should be able to set time if correctData is passed.', () => {
    const times = [{time: 1}, {time: 2}];
    clashtimeDb.setLeagueTimes(times);
    expect(clashtimeDb.getLeagueTimes()).toEqual(times);
})

describe('Find Tournament', () => {
    test('I should be able to search for a tournament by its exact name and it should be returned if matching.', () => {
        const dateFormat = 'MMMM DD yyyy hh:mm a z';
        let currentDate = new moment().add(1, 'hour').format(dateFormat);
        let nextDate = new moment().add(1, 'hour').add(1, 'day').format(dateFormat);
        clashtimeDb.leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "3",
                startTime: currentDate,
                registrationTime: currentDate
            },
            {
                tournamentName: "msi2021",
                tournamentDay: "4",
                startTime: nextDate,
                registrationTime: nextDate
            }
        ];
        expect(clashtimeDb.findTournament('msi2021')).toEqual(clashtimeDb.leagueTimes);
    })

    test('I should be returned an empty value if a match is not found.', () => {
        clashtimeDb.leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "3",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                tournamentName: "msi2021",
                tournamentDay: "4",
                "startTime": "May 30 2021 07:00 pm PDT",
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
        expect(clashtimeDb.findTournament('abcde')).toHaveLength(0);
    })

    test('I should be returned an empty value if a tournament name match is not found due to date being in the past.', () => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        const currentDateTwo = new Date();
        currentDateTwo.setDate(currentDateTwo.getDate() - 2);
        clashtimeDb.leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "3",
                "startTime": currentDate,
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                tournamentName: "msi2021",
                tournamentDay: "4",
                "startTime": currentDateTwo,
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
        expect(clashtimeDb.findTournament('msi2021')).toHaveLength(0);
    })

    test('I should be returned an empty value if a tournament name and day match is not found due to date being in the past.', () => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        const currentDateTwo = new Date();
        currentDateTwo.setDate(currentDateTwo.getDate() - 2);
        clashtimeDb.leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "3",
                "startTime": currentDate,
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                tournamentName: "msi2021",
                tournamentDay: "4",
                "startTime": currentDateTwo,
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
        expect(clashtimeDb.findTournament('msi2021', '3')).toHaveLength(0);
    })

    test('I should be able to search for a tournament and a day.', () => {
        const dateFormat = 'MMMM DD yyyy hh:mm a z';
        let currentDate = new moment().add(1, 'hour').format(dateFormat);
        let nextDate = new moment().add(1, 'hour').add(1, 'day').format(dateFormat);
        clashtimeDb.leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "3",
                startTime: currentDate,
                registrationTime: currentDate
            },
            {
                tournamentName: "msi2021",
                tournamentDay: "4",
                startTime: nextDate,
                registrationTime: nextDate
            }
        ];
        expect(clashtimeDb.findTournament('msi2021', '4')).toEqual([clashtimeDb.leagueTimes[1]]);
    })

    test('I should be able to search for a partial name of a tournament.', () => {
        const dateFormat = 'MMMM DD yyyy hh:mm a z';
        let currentDate = new moment().add(1, 'hour').format(dateFormat);
        let nextDate = new moment().add(1, 'hour').add(1, 'day').format(dateFormat);
        clashtimeDb.leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "3",
                "startTime": currentDate,
                "registrationTime": currentDate
            },
            {
                tournamentName: "msi2021",
                tournamentDay: "4",
                "startTime": nextDate,
                "registrationTime": nextDate
            }
        ];
        expect(clashtimeDb.findTournament('msi')).toEqual(clashtimeDb.leagueTimes);
    })

    test('I should be able to search for a partial name and regardless of case for a tournament.', () => {
        const dateFormat = 'MMMM DD yyyy hh:mm a z';
        let currentDate = new moment().add(1, 'hour').format(dateFormat);
        let nextDate = new moment().add(1, 'hour').add(1, 'day').format(dateFormat);
        clashtimeDb.leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "3",
                "startTime": currentDate,
                "registrationTime": currentDate
            },
            {
                tournamentName: "msi2021",
                tournamentDay: "4",
                "startTime": nextDate,
                "registrationTime": nextDate
            }
        ];
        expect(clashtimeDb.findTournament('MSI')).toEqual(clashtimeDb.leagueTimes);
    })

    test('I should be able to return the all available tournaments based on the current date if nothing is passed', () => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        const currentDateTwo = new Date();
        currentDateTwo.setDate(currentDateTwo.getDate() + 1);
        clashtimeDb.leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "3",
                "startTime": currentDate,
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                tournamentName: "msi2021",
                tournamentDay: "4",
                "startTime": currentDateTwo.toDateString(),
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
        expect(clashtimeDb.findTournament()).toEqual([clashtimeDb.leagueTimes[1]]);
    })

    test('I should be able to return no tournaments if there are none available for the current date if nothing is passed.', () => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 2);
        const currentDateTwo = new Date();
        currentDateTwo.setDate(currentDateTwo.getDate() - 1);
        clashtimeDb.leagueTimes = [
            {
                tournamentName: "msi2021",
                tournamentDay: "3",
                "startTime": currentDate,
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                1: "msi2021",
                tournamentDay: "4",
                "startTime": currentDateTwo,
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
        expect(clashtimeDb.findTournament()).toHaveLength(0);
    })
})
