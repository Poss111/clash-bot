const help = require('../help');
const helpMenu = require('../../templates/help-menu.js');
const {buildMockInteraction} = require('./shared-test-utilities/shared-test-utilities.test');

test('help should return an embedded object to be posted in discord.', () => {
    const msg = buildMockInteraction();
    help.execute(msg);
    expect(msg.reply).toHaveBeenCalledTimes(1);
    expect(msg.reply).toHaveBeenCalledWith({ embeds: [ helpMenu ]});
});
