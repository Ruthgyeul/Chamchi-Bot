const { SlashCommandBuilder } = require("discord.js");
const { pingDB } = require("../../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("은행서버")
        .setDescription("은행 서비스들이 정상 운영 중인지 체크!"),
    option: {
        category: "DEV",
        devOnly: false,
        adminOnly: false,
        maintenance: false,
        cooltime: 0
    },

    async execute(interaction, client) {
        await interaction.deferReply();

        const bankDB = await pingDB();
        const totalStatus = "리모델링 중";
        
        await interaction.editReply({ content: `현재 참치은행은 ${totalStatus}입니다.\n> 서버 핑: \`\`${client.ws.ping} ms\`\`\n> 은행 금고: \`\`${bankDB}\`\`` });
    }
}