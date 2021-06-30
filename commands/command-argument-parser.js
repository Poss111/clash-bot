class CommandArgumentParser {

    parse(args) {
        let commands = {
            createNewTeam: false
        };
        if (args) {
            args.forEach(record => {
                let re = new RegExp('^[0-9]{0,2}$');
                if (record === 'newTeam') {
                    commands.createNewTeam = true;
                } else if (re.test(record)) {
                    commands.tournamentDay = record;
                } else {
                    commands.tournamentName = record;
                }
            });
        }
        return commands;
    }

}

module.exports = new CommandArgumentParser;
