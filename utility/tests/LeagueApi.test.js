const LeagueApi = require('../LeagueApi');
const nock = require('nock');

test('Should fail a return with a reject if the RIOT_TOKEN is not passed.', () => {
    return expect(LeagueApi.initializeLeagueData()).rejects.toMatch('RIOT_TOKEN not found.');
})

test('Should fail a return with a reject if the TOKEN is not passed.', () => {
    process.env.RIOT_TOKEN = 'testToken';
    return expect(LeagueApi.initializeLeagueData()).rejects.toMatch('TOKEN not found.');
})

test('Should return a parsed array of human readable dates from the League Clash API.', () => {
    process.env.TOKEN = 'testToken';
    process.env.RIOT_TOKEN = 'testToken';

    nock('https://na1.api.riotgames.com').get('/lol/clash/v1/tournaments').reply(200, [
        {
            "id": 3461,
            "themeId": 24,
            "nameKey": "msi2021",
            "nameKeySecondary": "day_3",
            "schedule": [
                {
                    "id": 3581,
                    "registrationTime": 1622330100000,
                    "startTime": 1622340000000,
                    "cancelled": false
                }
            ]
        },
        {
            "id": 3481,
            "themeId": 24,
            "nameKey": "msi2021",
            "nameKeySecondary": "day_4",
            "schedule": [
                {
                    "id": 3601,
                    "registrationTime": 1622416500000,
                    "startTime": 1622426400000,
                    "cancelled": false
                }
            ]
        }
    ]);

    return LeagueApi.initializeLeagueData().then(data => {
        expect(data).toBeTruthy();
        expect(data.length).toBe(2);
        data.forEach(tournament => {
            expect(tournament.startTime).toContain('May');
            expect(tournament.registrationTime).toContain('May');
        })
    });
})

test('Should error out and return with a reject if the value of the json is not parsable.', () => {
    process.env.TOKEN = 'testToken';
    process.env.RIOT_TOKEN = 'testToken';

    nock('https://na1.api.riotgames.com')
        .get('/lol/clash/v1/tournaments')
        .reply(403, {error: 'failed'});

    return expect(LeagueApi.initializeLeagueData()).rejects.toMatch('Failed to retrieve league Clash API data due to => ');
})

test('Should be able to set time if correctData is passed.', () => {
    const times = [{time: 1}, {time: 2}];
    LeagueApi.setLeagueTimes(times);
    expect(LeagueApi.getLeagueTimes()).toEqual(times);
})

describe('Find Tournament', () => {
    test('I should be able to search for a tournament by its exact name and it should be returned if matching.', () => {
        LeagueApi.leagueTimes = [
            {
                "name": "msi2021",
                "nameSecondary": "day_3",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                "name": "msi2021",
                "nameSecondary": "day_4",
                "startTime": "May 30 2021 07:00 pm PDT",
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
        expect(LeagueApi.findTournament('msi2021')).toEqual(LeagueApi.leagueTimes[0]);
    })

    test('I should be returned an empty value if a match is not found.', () => {
        LeagueApi.leagueTimes = [
            {
                "name": "msi2021",
                "nameSecondary": "day_3",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                "name": "msi2021",
                "nameSecondary": "day_4",
                "startTime": "May 30 2021 07:00 pm PDT",
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
        expect(LeagueApi.findTournament('abcde')).toBeFalsy();
    })

    test('I should be returned an empty value if a tournament name match is not found due to date being in the past.', () => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        const currentDateTwo = new Date();
        currentDateTwo.setDate(currentDateTwo.getDate() - 2);
        LeagueApi.leagueTimes = [
            {
                "name": "msi2021",
                "nameSecondary": "day_3",
                "startTime": currentDate,
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                "name": "msi2021",
                "nameSecondary": "day_4",
                "startTime": currentDateTwo,
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
        expect(LeagueApi.findTournament('msi2021')).toBeFalsy();
    })

    test('I should be returned an empty value if a tournament name and day match is not found due to date being in the past.', () => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        const currentDateTwo = new Date();
        currentDateTwo.setDate(currentDateTwo.getDate() - 2);
        LeagueApi.leagueTimes = [
            {
                "name": "msi2021",
                "nameSecondary": "day_3",
                "startTime": currentDate,
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                "name": "msi2021",
                "nameSecondary": "day_4",
                "startTime": currentDateTwo,
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
        expect(LeagueApi.findTournament('msi2021', '3')).toBeFalsy();
    })

    test('I should be able to search for a tournament and a day.', () => {
        LeagueApi.leagueTimes = [
            {
                "name": "msi2021",
                "nameSecondary": "day_3",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                "name": "msi2021",
                "nameSecondary": "day_4",
                "startTime": "May 30 2021 07:00 pm PDT",
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
        expect(LeagueApi.findTournament('msi2021', '4')).toEqual(LeagueApi.leagueTimes[1]);
    })

    test('I should be able to search for a partial name of a tournament.', () => {
        LeagueApi.leagueTimes = [
            {
                "name": "msi2021",
                "nameSecondary": "day_3",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                "name": "msi2021",
                "nameSecondary": "day_4",
                "startTime": "May 30 2021 07:00 pm PDT",
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
        expect(LeagueApi.findTournament('msi')).toEqual(LeagueApi.leagueTimes[0]);
    })

    test('I should be able to search for a partial name and regardless of case for a tournament.', () => {
        LeagueApi.leagueTimes = [
            {
                "name": "msi2021",
                "nameSecondary": "day_3",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                "name": "msi2021",
                "nameSecondary": "day_4",
                "startTime": "May 30 2021 07:00 pm PDT",
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
        expect(LeagueApi.findTournament('MSI')).toEqual(LeagueApi.leagueTimes[0]);
    })

    test('I should be able to return the first available tournament if nothing is passed', () => {
        LeagueApi.leagueTimes = [
            {
                "name": "msi2021",
                "nameSecondary": "day_3",
                "startTime": "May 29 2021 07:00 pm PDT",
                "registrationTime": "May 29 2021 04:15 pm PDT"
            },
            {
                "name": "msi2021",
                "nameSecondary": "day_4",
                "startTime": "May 30 2021 07:00 pm PDT",
                "registrationTime": "May 30 2021 04:15 pm PDT"
            }
        ];
        expect(LeagueApi.findTournament()).toEqual(LeagueApi.leagueTimes[0]);
    })
})
