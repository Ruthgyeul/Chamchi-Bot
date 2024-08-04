const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("개발")
        .setDescription("개발자 전용 명령어"),
    option: {
        category: "DEV",
        devOnly: true,
        adminOnly: false,
        maintenance: false,
        cooltime: 0
    },

    async execute(interaction, client) {
        await interaction.deferReply();

        const guild = client.guilds.cache.get(interaction.guildId);
        const accountUser = guild.members.cache.get(interaction.user.id);
        const user = interaction.user;
        console.log(interaction);
        
        await interaction.editReply({ content: `콘솔 출력 완료` });
    }
}