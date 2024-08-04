const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("롤서버")
        .setDescription("롤 서버 다운됐는지 확인")
        .addStringOption(option =>
            option.setName("region")
                .setDescription("Summoner Regions")
                .setRequired(true)
                .addChoices(
                    { name: "NA1", value: "NA1" },
                    { name: "KR", value: "KR" }
                )
        ),
    option: {
        category: "DEV",
        devOnly: false,
        adminOnly: false,
        maintenance: true,
        cooltime: 0
    },

    async execute(interaction, client) {
        const apiKey = client.config.api.riot
        const region = interaction.options.getString("region");
        const apiPlatform = `https://${region}.api.riotgames.com/lol/status/v4/platform-data?api_key=${apiKey}`;

        await interaction.deferReply();

        axios.get(apiPlatform)
            .then(async res => {
                let platformData = res.data;
                let maintenances = platformData.maintenances;
                let status = "정상 운영 중";
                let info = "정보 없음..."

                if (maintenances) {
                    for (var i = 0; i < maintenances.length; i++) {
                        if (maintenances[i].maintenance_status == "in_progress") {
                            status = "서버 점검 진행 중";
                            info = maintenances[i].titles[15].content;
                            break;
                        }
                    }
                }

                //console.log(platformData);

                await interaction.editReply({ content: `현재 **${region}** 서버는 **${status}**(이)에요 주인님!\n> ${info}` });
            })
            .catch(error => {
                console.error("Error fetching data:", error.message);
            });
    }
}