const parseUserInfo = (interaction) => {
    let userInfo = { username: '', id: 0, guild: ''};
    if(interaction.user) {
        userInfo = buildUserInfo(interaction.user.id, interaction.user.username, interaction.member.guild.name);
    } else {
        userInfo = buildUserInfo(interaction.author.id, interaction.author.username, interaction.guild.name);
    }
    return userInfo;
};

const buildUserInfo = (id, username, guild) => {
    return {
        id: id,
        username: username,
        guild: guild
    };
};

module.exports.parseUserInfo = parseUserInfo;
