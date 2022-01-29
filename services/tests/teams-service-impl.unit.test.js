const clashBotTeamsServiceImpl = require('../teams-service-impl');
const nock = require('nock');

describe('Clash Bot Teams Service', () => {
    describe('GET - Retrieve active Teams for Server', () => {
        test('When I make a call to the Clash Bot Webapp with a Server Name, I should be returned the active Teams for that server.', () => {
            const expectedServerName = 'Goon Squad';
            const expectedResponse = [
                {
                    teamName: 'Team Abra',
                    playersDetails: [
                        {
                            id: 1,
                            name: 'Roïdräge',
                            champions: ['Volibear', 'Ornn', 'Sett']
                        },
                        {
                            id: 2,
                            name: 'TheIncentive',
                            champions: ['Lucian']
                        },
                        {
                            id: 3,
                            name: 'Pepe Conrad',
                            champions: ['Lucian']
                        }
                    ],
                    tournamentDetails: {
                        tournamentName: 'awesome_sauce',
                        tournamentDay: '1'
                    },
                    playersRoleDetails: {
                        Top: 'Roïdräge',
                        Bot: 'TheIncentive',
                        Jg: 'Pepe Conrad'
                    }
                }
            ];
            nock('http://localhost')
                .get(`/api/v2/teams/${encodeURI(expectedServerName)}`)
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
                            id: 1,
                            name: 'Roïdräge',
                            champions: ['Volibear', 'Ornn', 'Sett']
                        },
                        {
                            id: 2,
                            name: 'TheIncentive',
                            champions: ['Lucian']
                        },
                        {
                            id: 3,
                            name: 'Pepe Conrad',
                            champions: ['Lucian']
                        }
                    ],
                    playersRoleDetails: {
                        Top: 'Roïdräge',
                        Bot: 'TheIncentive',
                        Supp: 'Pepe Conrad'
                    }
                }
            ];
            nock('http://localhost')
                .get(`/api/v2/teams/${encodeURI(expectedServerName)}`)
                .reply(200, expectedResponse);
            return clashBotTeamsServiceImpl.retrieveActiveTeamsForServer(expectedServerName).then(response => {
                expect(response).toEqual(expectedResponse);
            });
        })
    })

    describe('POST - Create new Team', () => {
        test('When a call is made with id, serverName, tournamentName, tournamentDay, and startTime then I should be able to retrieve the newly created team.', () => {
            const expectedPlayerId = '1';
            const expectedRole = 'Top';
            const expectedServerName = 'Goon Squad';
            const expectedTournamentName = 'awesome_sauce';
            const expectedTournamentDay = '1';
            const expectedStartTime = new Date().toISOString();
            const expectedResponse = {
                teamName: 'Abra',
                serverName: expectedServerName,
                playersDetails: [
                    {
                        id: 1,
                        name: 'Roidrage',
                        role: 'Top'
                    }
                ],
                tournamentDetails: {
                    tournamentName: expectedTournamentName,
                    tournamentDay: expectedTournamentDay
                },
                startTime: expectedStartTime
            };
            nock('http://localhost')
                .post(`/api/v2/team`, { id: expectedPlayerId, role: expectedRole, serverName: expectedServerName, tournamentName: expectedTournamentName, tournamentDay: expectedTournamentDay, startTime: expectedStartTime})
                .reply(200, expectedResponse);
            return clashBotTeamsServiceImpl.postForNewTeam(expectedPlayerId, expectedRole, expectedServerName, expectedTournamentName, expectedTournamentDay, expectedStartTime).then(response => {
                expect(response).toEqual(expectedResponse);
            });
        })
    })

    describe('POST - Register with Team', () => {
        test('When a call is made with id, teamName, serverName, tournamentName, and tournamentDay then I should be able to register to a specified team.', () => {
            const expectedPlayerId = '1';
            const expectedRole = 'Top';
            const expectedTeamName = 'Abra';
            const expectedServerName = 'Goon Squad';
            const expectedTournamentName = 'awesome_sauce';
            const expectedTournamentDay = '1';
            const expectedStartTime = new Date().toISOString();
            const expectedResponse = {
                teamName: 'Abra',
                serverName: expectedServerName,
                playersDetails: [
                    {
                        id: 1,
                        name: 'Roidrage',
                        role: 'Top'
                    }
                    ],
                tournamentDetails: {
                    tournamentName: expectedTournamentName,
                    tournamentDay: expectedTournamentDay
                },
                startTime: expectedStartTime
            };
            nock('http://localhost')
                .post(`/api/v2/team/register`, { id: expectedPlayerId, role: expectedRole,
                    teamName: expectedTeamName, serverName: expectedServerName,
                    tournamentName: expectedTournamentName, tournamentDay: expectedTournamentDay})
                .reply(200, expectedResponse);
            return clashBotTeamsServiceImpl.postForTeamRegistration(expectedPlayerId,
                expectedRole, expectedTeamName, expectedServerName, expectedTournamentName,
                expectedTournamentDay, expectedStartTime).then(response => {
                expect(response).toEqual(expectedResponse);
            });
        })
    })

    describe('DELETE - Unregister from Team', () => {
        test('When a call is made with id, serverName, tournamentName, and tournamentDay then I should be able to unregister from a team.', () => {
            const expectedPlayerId = '1';
            const expectedServerName = 'Goon Squad';
            const expectedTournamentName = 'awesome_sauce';
            const expectedTournamentDay = '1';
            const expectedStartTime = new Date().toISOString();
            const expectedResponse =  {message: 'Successfully removed from Team.'};
            nock('http://localhost')
                .delete(`/api/v2/team/register`, { id: expectedPlayerId, serverName: expectedServerName, tournamentName: expectedTournamentName, tournamentDay: expectedTournamentDay})
                .reply(200, expectedResponse);
            return clashBotTeamsServiceImpl.deleteFromTeam(expectedPlayerId, expectedServerName, expectedTournamentName, expectedTournamentDay, expectedStartTime).then(response => {
                expect(response).toEqual(expectedResponse);
            });
        })
    })
})
