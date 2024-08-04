const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { newData, readData } = require("../../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("계좌정보")
        .setDescription("본인 혹은 타인의 계좌 정보를 조회합니다.")
        .addStringOption(option =>
            option.setName("username")
                .setDescription("조회할 계좌 소유자 닉네임")
                .setRequired(false)
        ),
    option: {
        category: "BANK",
        devOnly: false,
        adminOnly: false,
        maintenance: false,
        cooltime: 10
    },

    async execute(interaction, client) {
        await interaction.deferReply();

        const guild = client.guilds.cache.get(interaction.guildId);
        const userName = interaction.options.getString("username");
        let accountUser;

        if (userName) {
            accountUser = guild.members.cache.get(userName.replace(/[^0-9]/g, ""));
            if (!accountUser) return await interaction.editReply({ content: `존재하지 않는 유저입니다.` });
        } else {
            accountUser = guild.members.cache.get(interaction.user.id);
        }

        const query = { userId: accountUser.user.id };
        const allData = await readData("User");
        const userData = await readData("User", query);

        const emMessage = new EmbedBuilder()
            .setTimestamp()
            .setFooter({ text: '🏦 Bank of Chamchi' });

        if (!userData[0] && accountUser.user.id == interaction.user.id) {
            const checkNickname = guild.members.cache.get(accountUser.user.id).nickname;
            const newUserData = {
                userId: accountUser.user.id,
                userName: checkNickname || accountUser.user.username,
                userGName: accountUser.user.globalName,
                avatarId: accountUser.user.avatar,
                role: 1,
                userMoney: 100000
            };
            const dbCheck = await newData("User", newUserData);

            emMessage.setAuthor({ name: newUserData.userName, iconURL: `https://cdn.discordapp.com/avatars/${newUserData.userId}/${newUserData.avatarId}` });
            emMessage.setTitle(`신규 계좌 생성 정보`);
            emMessage.setColor("#DFFF00");
            emMessage.setDescription(`💰 총 자산 규모: 100,000원\n💵 잔액: 100,000원`);
        } else if (!userData[0]) {
            emMessage.setAuthor({ name: accountUser.nickname || accountUser.user.globalName, iconURL: `https://cdn.discordapp.com/avatars/${accountUser.user.id}/${accountUser.user.avatar}` });
            emMessage.setTitle(`계좌 조회 불가`);
            emMessage.setColor("#FF0000");
            emMessage.setDescription(`해당 계좌는 정지되었거나 존재하지 않습니다.`);
        } else {
            emMessage.setAuthor({ name: accountUser.nickname || accountUser.user.globalName, iconURL: `https://cdn.discordapp.com/avatars/${userData[0].userId}/${userData[0].avatarId}` });
            emMessage.setTitle(`계좌 조회 정보 [?위]`);
            emMessage.setColor("#50C878");
            emMessage.setDescription(`💰 총 자산 규모: ${userData[0].userMoney.toLocaleString('en-US')}원\n💵 잔액: ${userData[0].userMoney.toLocaleString('en-US')}원`);
        }

        await interaction.editReply({ embeds: [emMessage] });
    }
}