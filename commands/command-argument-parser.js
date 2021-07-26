class CommandArgumentParser {

    parse(args) {
        let commands = {};
        if (args) {
            args.forEach(record => {
                let re = new RegExp('^[0-9]{0,2}$');
                if (re.test(record)) {
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
