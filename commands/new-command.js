const {BaseMessageComponent, Message, MessageActionRow, MessageSelectMenu} = require("discord.js");
module.exports = {
    name: 'test',
    description: 'Testing out component messages.',
    execute: async function(msg) {
        let messageActionRow = new MessageActionRow();
        let messageSelectMenu = new MessageSelectMenu();
        messageSelectMenu.setCustomId('role');
        messageSelectMenu.setMaxValues(1);
        messageSelectMenu.setMinValues(1);
        messageSelectMenu.setPlaceholder('Select your role...');
        messageSelectMenu.setOptions([
            {
                label: "Top",
                value: "top",
                description: "Top lane, best lane.",
                default: false
            },
            {
                label: "Mid",
                value: "mid",
                description: "Mid lane.",
                default: false
            },
            {
                label: "Jungle",
                value: "jg",
                description: "Sneaky sneaky.",
                default: false
            },
            {
                label: "ADC",
                value: "bot",
                description: "Throw stuff at people.",
                default: false
            },
            {
                label: "Support",
                value: "Supp",
                description: "The team lead.",
                default: false
            }
        ]);
        messageActionRow.addComponents(messageSelectMenu);

        msg.reply({components: [messageActionRow], ephemeral: true })
            .then(() => {
                console.log('Successfully sent message.')
            });
        const filter = i => i.customId === 'role';
        let messageComponentCollector = msg.createMessageComponentCollector({ filter, time: 15000 });
        messageComponentCollector.on('collect', async i => {
            if (i.customId === 'role') {
                await i.update({ content: 'Submitted.', components: [] });
            }
        });

        messageComponentCollector.on('end', collected => console.log(`Collected ${collected.size} items`));
    }
}