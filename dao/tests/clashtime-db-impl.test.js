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
    expectedData.sort((a, b) => parseInt(a.tournamentDay) - parseInt(b.tournamentDay));

    return clashtimeDb.initializeLeagueData().then(data => {
        expect(data).toEqual(expectedData);
    });
})

describe('Find Tournament', () => {

    function buildSampleTournamentList(tournamentName, days, daysBehind) {
        let tournaments = [];
        let expectedTournaments = [];
        const dateFormat = 'MMMM DD yyyy hh:mm a z';
        for (let i = 0; i < days; i++) {
            if (!daysBehind) {
                daysBehind = 0;
            }
            let firstDate = new moment()
                .add(i - daysBehind, 'day').format(dateFormat);
            let secondDate = new moment()
                .add(i - daysBehind, 'day')
                .add(1, 'hour').format(dateFormat);
            let tournament = {
                key: `${tournamentName}#${i}`,
                tournamentName: tournamentName,
                tournamentDay: `${i}`,
                registrationTime: firstDate,
                startTime: secondDate,
            };
            tournaments.push(
                {
                    attrs: tournament
                }
            )
            expectedTournaments.push(tournament);
        }
        const value = {Items: tournaments};

        const mockStream = jest.fn().mockImplementation(() => streamTest.v2.fromObjects([value]));
        clashtimeDb.clashTimesTable = {
            scan: jest.fn().mockReturnThis(),
            filterExpression: jest.fn().mockReturnThis(),
            expressionAttributeValues: jest.fn().mockReturnThis(),
            expressionAttributeNames: jest.fn().mockReturnThis(),
            exec: mockStream
        };
        return expectedTournaments;
    }

    test('I should be able to search for a tournament by its exact name and it should be returned if matching.', () => {
        let expectedData = buildSampleTournamentList('msi2021', 2);
        return clashtimeDb.findTournament('msi2021').then(data => {
            expect(data).toEqual(expectedData);
        })
    })

    test('I should be returned an empty value if a match is not found.', () => {
        buildSampleTournamentList('msi2021', 2);
        return clashtimeDb.findTournament('abcde').then(data => {
            expect(data).toHaveLength(0);
        });
    })

    test('I should be returned an empty value if a tournament name match is not found due to date being in the past.', () => {
        buildSampleTournamentList('msi2021', 2, 2);
        return clashtimeDb.findTournament('msi2021').then(data => {
            expect(data).toHaveLength(0);
        });
    })

    test('I should be returned an empty value if a tournament name and day match is not found due to date being in the past.', () => {
        buildSampleTournamentList('msi2021', 2, 2);
        return clashtimeDb.findTournament('msi2021', 2).then(data => {
            expect(data).toHaveLength(0);
        });
    })

    test('I should be able to search for a tournament and a day.', () => {
        let expectedData = buildSampleTournamentList('msi2021', 2);
        return clashtimeDb.findTournament('msi2021', 0).then(data => {
            expect(data).toEqual([expectedData[0]]);
        })
    })

    test('I should be able to search for a partial name of a tournament.', () => {
        let expectedData = buildSampleTournamentList('msi2021', 2);
        return clashtimeDb.findTournament('msi').then(data => {
            expect(data).toEqual(expectedData);
        })
    })

    test('I should be able to search for a partial name and regardless of case for a tournament.', () => {
        let expectedData = buildSampleTournamentList('msi2021', 2);
        return clashtimeDb.findTournament('MSI').then(data => {
            expect(data).toEqual(expectedData);
        })
    })

    test('I should be able to return the all available tournaments based on the current date if nothing is passed', () => {
        let expectedData = buildSampleTournamentList('msi2021', 2);
        return clashtimeDb.findTournament().then(data => {
            expect(data).toEqual(expectedData);
        })
    })

    test('I should be able to return no tournaments if there are none available for the current date if nothing is passed.', () => {
        buildSampleTournamentList('msi2021', 2, 2);
        return clashtimeDb.findTournament().then(data => {
            expect(data).toHaveLength(0);
        })
    })
})

describe('Retrieve Tournaments', () => {
    test('Should be able to retrieve all tournaments from stream and should be sorted by greatest to least day number.', () => {
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
        clashtimeDb.clashTimesTable = {
            scan: jest.fn().mockReturnThis(),
            filterExpression: jest.fn().mockReturnThis(),
            expressionAttributeValues: jest.fn().mockReturnThis(),
            expressionAttributeNames: jest.fn().mockReturnThis(),
            exec: mockStream
        };
        let expectedData = [];
        value.Items.forEach(record => {
            expectedData.push(JSON.parse(JSON.stringify(record.attrs)));
        });
        expectedData.sort((a, b) => parseInt(a.tournamentDay) - parseInt(b.tournamentDay));

        return clashtimeDb.retrieveTournaments().then(data => {
            expect(data).toEqual(expectedData);
        });
    })
})
