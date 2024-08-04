const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("소환사")
        .setDescription("롤 소환사 정보 불러오기")
        .addStringOption(option =>
            option.setName("region")
                .setDescription("Summoner Regions")
                .setRequired(true)
                .addChoices(
                    { name: "NA1", value: "NA1" },
                    { name: "KR", value: "KR" }
                ))
        .addStringOption(option =>
            option.setName("username")
                .setDescription("Summoner Name")
                .setRequired(true)
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
        const summonerName = interaction.options.getString("username");
        const apiSummoner = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`;

        await interaction.deferReply();

        axios.get(apiSummoner)
            .then(async res => {
                let summonerData = res.data;
                let summonerID = summonerData.id;
                let summonerAccID = summonerData.accountId;
                let summonerPuuID = summonerData.puuid;
                let summonerLv = summonerData.summonerLevel;

                await interaction.editReply({ content: `**${summonerName}** 소환사님은 레벨 **${summonerLv}**에요!` });

                const apiLeagueEntry = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=${apiKey}`;
                axios.get(apiLeagueEntry)
                    .then(async res => {
                        let leagueData = res.data;
                        let lg = "Unrank";
                        if (leagueData[0]) lg = `${leagueData[0].tier} ${leagueData[0].rank}`;
                        console.log(leagueData);
                        await interaction.followUp({ content: `그리고 티어는 **${lg}**(이)라네요~!` });
                    })
                    .catch(error => {
                        console.error("Error fetching data:", error.message);
                    });
            })
            .catch(error => {
                console.error("Error fetching data:", error.message);
                interaction.editReply({ content: `그런 소환사 들어본 적도 없습니다...` });
            });
    }
}