const commandArgumentParser = require('../command-argument-parser');

describe('Command Argument Parser', () => {
    test('When nothing is passed, it should be an empty object.', () => {
        let args = [];

        let commands = commandArgumentParser.parse(args);

        expect(commands).toEqual({});
    });

    test('When undefined is passed, it should be an empty object.', () => {
        let commands = commandArgumentParser.parse(undefined);

        expect(commands).toEqual({});
    });

    test('When argument tournament name is passed as first argument, it should be parsed into and object and used.', () => {
        let args = ['msi2021'];

        let commands = commandArgumentParser.parse(args);

        expect(commands).toEqual({
            tournamentName: args[0]
        });
    });

    test('When argument tournament day and tournament name are passed as arguments, it should be parsed into and object and used.', () => {
        let args = ['2', 'msi2021'];

        let commands = commandArgumentParser.parse(args);

        expect(commands).toEqual({
            tournamentName: args[1],
            tournamentDay: args[0]
        });
    });

    test('When argument tournament number is passed as first argument, it should be parsed into and object and used.', () => {
        let args = ['2'];

        let commands = commandArgumentParser.parse(args);

        expect(commands).toEqual({
            tournamentDay: args[0]
        });
    });

    test('Test out all possible orders of list of acceptable arrangement arguments for array, should be parsed in the expected order.', () => {
        let args = ['msi2021', '23'];
        for (let i = 0; i < args.length; i++) {
            for (let j = 0; j < args.length; j++) {
                let copy = JSON.parse(JSON.stringify(args));
                let expectedTournamentName = copy[0];
                let expectedTournamentDay = copy[1];
                let swapOne = copy[i];
                let swapTwo = copy[j];
                copy[j] = swapOne;
                copy[i] = swapTwo;
                let commands = commandArgumentParser.parse(copy);

                expect(commands).toEqual({
                    tournamentName: expectedTournamentName,
                    tournamentDay: expectedTournamentDay
                });
            }
        }
    });
});
