const clashBotTeamsServiceImpl = require('../clash-bot-teams-service-impl');
const nock = require('nock');

describe('Clash Bot Teams Service', () => {
    describe('Retrieve active Teams for Server', () => {

        test('When I make a call to the Clash Bot Webapp with a Server Name, I should be returned the active Teams for that server.', () => {
            const expectedServerName = 'Goon Squad';
            const expectedResponse = [
                {
                    teamName: 'Team Abra',
                    playersDetails: [
                        {
                            name: 'Roïdräge',
                            champions: ['Volibear', 'Ornn', 'Sett'],
                            role: 'Top'
                        },
                        {
                            name: 'TheIncentive',
                            champions: ['Lucian'],
                            role: 'ADC'
                        },
                        {
                            name: 'Pepe Conrad',
                            champions: ['Lucian'],
                            role: 'Jg'
                        }
                    ],
                    tournamentDetails: {
                        tournamentName: 'awesome_sauce',
                        tournamentDay: '1'
                    }
                }
            ];
            nock('http://localhost')
                .get(`/api/teams/${encodeURI(expectedServerName)}`)
                .reply(200, expectedResponse);
            return clashBotTeamsServiceImpl.retrieveActiveTeamsForServer(expectedServerName).then(response => {
                expect(response).toEqual(expectedResponse);
            });
        })

        test('When I make a call to the Clash Bot Webapp with a Server Name for local testing, I should call localhost and I should be returned the active Teams for that server.', () => {
            const expectedServerName = 'Goon Squad';
            const expectedResponse = [
                {
                    teamName: 'Team Abra',
                    playersDetails: [
                        {
                            name: 'Roïdräge',
                            champions: ['Volibear', 'Ornn', 'Sett'],
                            role: 'Top'
                        },
                        {
                            name: 'TheIncentive',
                            champions: ['Lucian'],
                            role: 'ADC'
                        },
                        {
                            name: 'Pepe Conrad',
                            champions: ['Lucian'],
                            role: 'Jg'
                        }
                    ]
                }
            ];
            nock('http://localhost')
                .get(`/api/teams/${encodeURI(expectedServerName)}`)
                .reply(200, expectedResponse);
            return clashBotTeamsServiceImpl.retrieveActiveTeamsForServer(expectedServerName).then(response => {
                expect(response).toEqual(expectedResponse);
            });
        })

        test('Error - Http Error - If an http error occurs, it should be rejected successfully.', () => {
            const expectedServerName = 'Goon Squad';
            const expectedApiResponse = { error: 'Missing required detail.'};
            nock('http://localhost')
                .get(`/api/teams/${encodeURI(expectedServerName)}`)
                .reply(400, expectedApiResponse);
            return clashBotTeamsServiceImpl.retrieveActiveTeamsForServer(expectedServerName).then(() => {
                expect(true).toBeFalsy();
            }).catch(err => {
                let expectedResponse = JSON.parse(JSON.stringify(expectedApiResponse));
                expectedResponse.statusCode = 400;
                expect(err).toEqual(expectedResponse);
            });
        })

        test('Error - Error with Call - If an http error occurs, it should be rejected successfully.', () => {
            const expectedServerName = 'Goon Squad';
            nock('http://localhost')
                .get(`/api/teams/${encodeURI(expectedServerName)}`)
                .replyWithError({ message: 'Failed to make call.', code: 500 });
            return clashBotTeamsServiceImpl.retrieveActiveTeamsForServer(expectedServerName).then(() => {
                expect(true).toBeFalsy();
            }).catch(err => {
                expect(err).toEqual({ message: 'Failed to make call.', code: 500 });
            });
        })
    })
})
