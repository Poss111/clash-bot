const dynamodb = require('dynamodb');
const dynamoDbHelper = require('./impl/dynamo-db-helper');
const Joi = require('joi');
const names = require('../random-names');

class ClashTeamsDbImpl {
    Team;
    tentative = [];
    tableName = 'ClashTeam';

    constructor() {
    }

    initialize() {
        return new Promise((resolve, reject) => {
            dynamoDbHelper.initialize(this.tableName, {
                hashKey: 'key',
                timestamps: true,
                schema: {
                    key: Joi.string(),
                    teamName: Joi.string(),
                    serverName: Joi.string(),
                    players: dynamodb.types.stringSet(),
                    tournamentName: Joi.string(),
                    tournamentDay: Joi.string(),
                    startTime: Joi.string()
                }
            }).then(data => {
                console.log(`Successfully setup table def for ('${this.tableName}')`);
                this.Team = data;
                resolve(data);
            }).catch((err) => reject(err));
        })
    }

    buildTournamentToTeamsMap(playerName, teamsList) {
        let tournamentMap = new Map();
        teamsList.forEach(team => {
            let key = `${team.tournamentName}#${team.tournamentDay}`;
            let teamDetailsForTournament = tournamentMap.get(key);
            if (!teamDetailsForTournament) teamDetailsForTournament = {};

            if (team.players && team.players.includes(playerName)) {
                teamDetailsForTournament.teamCurrentlyOn = team;
                if (team.players.length <= 1) {
                    teamDetailsForTournament.unableToJoin = true;
                }
            } else {
                if (Array.isArray(teamDetailsForTournament.availableTeams)) teamDetailsForTournament.availableTeams.push(team);
                else teamDetailsForTournament.availableTeams = [team];
            }

            tournamentMap.set(`${team.tournamentName}#${team.tournamentDay}`, teamDetailsForTournament);
        });
        return tournamentMap;
    }

    registerPlayer(playerName, serverName, tournaments) {
        return new Promise((resolve, reject) => {
            this.getTeams(serverName).then((data) => {
                let teams = data;
                console.log(JSON.stringify(teams));
                const tournamentToTeamMap = this.buildTournamentToTeamsMap(playerName, data);
                let teamsCurrentlyOn = [];
                let availableTeam = undefined;
                let tournamentToUseKey = undefined;
                tournaments.every((entry) => {
                    tournamentToUseKey = `${entry.tournamentName}#${entry.tournamentDay}`;
                    let teamsForTournamentDetails = tournamentToTeamMap.get(tournamentToUseKey);
                    if (teamsForTournamentDetails) {
                        teamsCurrentlyOn.push(teamsForTournamentDetails.teamCurrentlyOn)
                        if (teamsForTournamentDetails.unableToJoin) {
                            tournamentToUseKey = undefined;
                            return true;
                        } else {
                            availableTeam = teamsForTournamentDetails.availableTeams;
                            return false;
                        }
                    } else {
                        return false;
                    }
                });
                console.log(`Number of Tournaments from Teams found => ('${tournamentToTeamMap.size}')`);
                console.log(`Requesting User ('${playerName}') Tournament To Use ('${tournamentToUseKey}')`);
                console.log(`Requesting User ('${playerName}') Available Team ('${JSON.stringify(availableTeam)}')`);
                console.log(`Requesting User ('${playerName}') Teams Currently on ('${JSON.stringify(teamsCurrentlyOn)}')`);
                if (!tournamentToUseKey) {
                    teamsCurrentlyOn.forEach(record => record.exist = true);
                    resolve(teamsCurrentlyOn);
                } else {
                    let tournamentToUse = tournaments.find(tournament => {
                        let tourneyKeySplit = tournamentToUseKey.split('#');
                        return tournament.tournamentName === tourneyKeySplit[0]
                            && tournament.tournamentDay === tourneyKeySplit[1];
                    });
                    this.removeIfExistingInTentative(playerName, serverName, tournamentToUse);

                    let updateCallback = (err, record) => {
                        if (err) reject(err);
                        else {
                            console.log(`Added ${playerName} to ${record.attrs.teamName}.`);
                            if (tournamentToTeamMap.get(tournamentToUseKey)
                                && tournamentToTeamMap.get(tournamentToUseKey).teamCurrentlyOn) {
                                this.unregisterPlayerWithSpecificTeam(playerName,
                                    [tournamentToTeamMap.get(tournamentToUseKey).teamCurrentlyOn]
                                    , serverName, reject);
                            }
                            resolve(record.attrs);
                        }
                    };
                    
                    availableTeam = Array.isArray(availableTeam) ? availableTeam.find(record => !record.players) : availableTeam;

                    if (availableTeam) {
                        console.log(`Adding ${playerName} to first available team ${availableTeam.teamName}...`);
                        this.addUserToTeam(playerName, availableTeam, updateCallback);
                    } else {
                        this.createNewTeam(playerName, serverName, tournamentToUse, teams.length + 1, updateCallback);
                    }
                }
            });
        });
    }

    registerWithSpecificTeam(playerName, serverName, tournaments, teamName) {
        return new Promise((resolve, reject) => {
            this.getTeams(serverName).then((teams) => {
                teams = teams.filter(team => team.tournamentName === tournaments[0].tournamentName
                    && team.tournamentDay === tournaments[0].tournamentDay);
                let foundTeam = teams.find(team => this.doesTeamNameMatch(teamName, team)
                    && team.players
                    && !team.players.includes(playerName)
                    && team.players.length < 5);
                let currentTeam = teams.find(team => team.players
                    && team.players.includes(playerName));
                console.log(`Team to be assigned to : ('${JSON.stringify(foundTeam)}')...`);
                if (!foundTeam) {
                    resolve(foundTeam);
                }
                this.removeIfExistingInTentative(playerName, serverName, {
                    tournamentName: foundTeam.tournamentName,
                    tournamentDay: foundTeam.tournamentDay
                })
                if (currentTeam) {
                    this.unregisterPlayerWithSpecificTeam(playerName, [currentTeam], serverName, reject);
                }
                let callback = (err, data) => {
                    if (err) reject(err);
                    else {
                        console.log(`Successfully added user to Team ('${JSON.stringify(data)}').`);
                        foundTeam = data.attrs;
                        resolve(foundTeam);
                    }
                };
                this.addUserToTeam(playerName, foundTeam, callback);
            }).catch(err => reject(err));
        })
    }

    doesTeamNameMatch(teamNameToSearch, team) {
        if (!teamNameToSearch || !team || !team.teamName) {
            return false;
        }
        let expectedName = team.teamName.toLowerCase();
        teamNameToSearch = teamNameToSearch.toLowerCase();
        return expectedName === teamNameToSearch || expectedName.includes(teamNameToSearch);
    }

    addUserToTeam(playerName, foundTeam, callback) {
        let params = {};
        params.UpdateExpression = 'ADD players :playerName';
        params.ExpressionAttributeValues = {
            ':playerName': dynamodb.Set([playerName], 'S')
        };
        this.Team.update({
            key: this.getKey(foundTeam.teamName,
                foundTeam.serverName,
                foundTeam.tournamentName,
                foundTeam.tournamentDay)
        }, params, (err, record) => callback(err, record));
    }

    removeIfExistingInTentative(playerName, serverName, tournamentToUse) {
        if (this.tentative.some(record => record.playerName === playerName
            && record.serverName === serverName
            && record.tournamentName === tournamentToUse.tournamentName)) {
            this.handleTentative(playerName, serverName, tournamentToUse.tournamentName).then((data) => {
                if (data) console.log('Pulled off tentative');
            });
        }
    }

    buildTeamLogic(tournaments, tournamentToTeamMap) {
        let teamToJoin;
        let currentTeams = [];
        let createNewTeam = false;
        let tournamentToUse;
        for (let i = 0; i < tournaments.length; i++) {
            tournamentToUse = tournaments[i];
            let key = `${tournamentToUse.tournamentName}#${tournamentToUse.tournamentDay}`;
            let teamDetailsForTournament = tournamentToTeamMap.get(key);
            if (!teamDetailsForTournament) {
                createNewTeam = true;
                break;
            } else {
                if (teamDetailsForTournament.availableTeams && teamDetailsForTournament.availableTeams.length > 0) {
                    teamToJoin = {
                        existingTeams: teamDetailsForTournament.availableTeams.filter(team => team.players),
                        emptyTeams: teamDetailsForTournament.availableTeams.filter(team => !team.players)
                    };
                    currentTeams = teamDetailsForTournament.teamCurrentlyOn;
                    break;
                } else {
                    if (teamDetailsForTournament.teamCurrentlyOn)
                        currentTeams.push(teamDetailsForTournament.teamCurrentlyOn)
                }
            }
        }
        return {teamToJoin, currentTeams, tournamentToUse, createNewTeam};
    }

    deregisterPlayer(playerName, serverName, tournaments) {
        return new Promise((resolve, reject) => {
            this.getTeams(serverName).then((data) => {
                let filter = [];
                data.forEach(record => {
                    if (record.players && record.players.includes(playerName)
                        && tournaments.some(tournament => tournament.tournamentName === record.tournamentName
                            && tournament.tournamentDay === record.tournamentDay)) {
                        filter.push(record);
                    }
                });
                if (filter.length > 0) {
                    this.unregisterPlayerWithSpecificTeam(playerName, filter, serverName, reject);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    unregisterPlayerWithSpecificTeam(playerName, teamsToBeRemovedFrom, serverName, callback) {
        console.log(`Unregistering ${playerName} from teams ('${teamsToBeRemovedFrom.map(team => team.teamName)}')...`);
        teamsToBeRemovedFrom.forEach(record => {
            console.log(`Unregistering ${playerName} from team ('${record.teamName}')...`);
            let params = {};
            params.UpdateExpression = 'DELETE players :playerName';
            params.ConditionExpression = 'teamName = :nameOfTeam';
            params.ExpressionAttributeValues = {
                ':playerName': dynamodb.Set([playerName], 'S'),
                ':nameOfTeam': record.teamName,
            };
            this.Team.update({
                    key: this.getKey(record.teamName,
                        serverName,
                        record.tournamentName,
                        record.tournamentDay)
                },
                params,
                function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log(`Successfully unregistered ('${playerName}') from ('${record.teamName}').`);
                    }
                });
        });
    }

    getTeams(serverName) {
        return new Promise((resolve, reject) => {
            let teams = [];
            let stream = this.Team.scan()
                .filterExpression('#serverName = :name')
                .expressionAttributeValues({':name': `${serverName}`})
                .expressionAttributeNames({'#serverName': 'serverName'})
                .exec();
            stream.on('readable', function () {
                let read = stream.read();
                if (read) {
                    read.Items.forEach((data) => {
                        teams.push(data.attrs)
                    });
                }
            });
            stream.on('end', function () {
                resolve(teams);
            });
            stream.on('error', (err) => reject(err));
        });
    }

    createNewTeam(playerName, serverName, tournament, number, callback) {
        console.log(`Creating new team for ${playerName} and Tournament ${tournament.tournamentName} and Day ${tournament.tournamentDay} since there are no available teams.`);
        let name = names[number];
        let createTeam = {
            teamName: `Team ${name}`,
            serverName: serverName,
            players: [playerName],
            tournamentName: tournament.tournamentName,
            tournamentDay: tournament.tournamentDay,
            startTime: tournament.startTime
        };
        createTeam.key = this.getKey(createTeam.teamName, serverName, tournament.tournamentName, tournament.tournamentDay);
        this.Team.update(createTeam, (err, data) => callback(err, data));
    }

    handleTentative(playerName, serverName, tournamentName) {
        return new Promise((resolve, reject) => {
            const index = this.tentative.findIndex((record) => record.playerName === playerName
                && record.serverName === serverName
                && record.tournamentName === tournamentName);
            if (index >= 0) {
                this.tentative.splice(index, 1);
                resolve(true);
            } else {
                const tournamentsToDeregister = [{
                    tournamentName: tournamentName,
                    tournamentDay: '1'
                },
                    {
                        tournamentName: tournamentName,
                        tournamentDay: '2'
                    },
                    {
                        tournamentName: tournamentName,
                        tournamentDay: '3'
                    },
                    {
                        tournamentName: tournamentName,
                        tournamentDay: '4'
                    }];
                this.deregisterPlayer(playerName, serverName, tournamentsToDeregister)
                    .then(() => {
                        this.tentative.push({
                            playerName: playerName,
                            serverName: serverName,
                            tournamentName: tournamentName
                        });
                        resolve(false);
                    })
                    .catch(err => reject(err));
            }
        });
    }

    removeFromTentative(playerName, serverName, tournamentName) {
        const index = this.tentative.findIndex((record) => record.playerName === playerName
            && record.serverName === serverName
            && record.tournamentName === tournamentName);
        if (index >= 0) {
            this.tentative.splice(index, 1);
        }
    }

    getKey(teamName, serverName, tournamentName, tournamentDay) {
        return `${teamName}#${serverName}#${tournamentName}#${tournamentDay}`;
    }

    getTentative(serverName) {
        return JSON.parse(JSON.stringify(this.tentative)).filter(data => data.serverName === serverName);
    }

    findFirstAvailableTeam(playerName, tournaments, teams) {
        if (teams && teams.length > 0) {
            const tournamentTeams = teams.filter(data =>
                tournaments.some(record =>
                    record.tournamentName === data.tournamentName && record.tournamentDay === data.tournamentDay));
            let i;
            for (i = 0; i < tournamentTeams.length; i++) {
                if (!tournamentTeams[i].players
                    || (tournamentTeams[i].players
                        && tournamentTeams[i].players.length < 5
                        && !tournamentTeams[i].players.includes(playerName))) {
                    return tournamentTeams[i];
                }
            }
        }
    }

    filterAvailableTournaments(tournaments, playerName, teams) {
        if (teams && teams.length > 0) {
            let availableTournaments = [];
            let tournamentToPlayersMap = new Map();
            teams.forEach((team) => {
                if (team.players) {
                    let key = `${team.tournamentName}#${team.tournamentDay}`;
                    if (tournamentToPlayersMap.get(key)) {
                        tournamentToPlayersMap.get(key).push(...team.players);
                    } else {
                        tournamentToPlayersMap.set(key, team.players);
                    }
                }
            });
            tournaments.forEach((tournament) => {
                const players = tournamentToPlayersMap.get(`${tournament.tournamentName}#${tournament.tournamentDay}`);
                if (!players || !players.includes(playerName)) {
                    availableTournaments.push(tournament);
                }
            });
            return availableTournaments;
        }
        return tournaments;
    }
}

module.exports = new ClashTeamsDbImpl;
