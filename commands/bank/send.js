const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { updateData, readData } = require("../../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("송금")
        .setDescription("타인에게 돈을 송금합니다.")
        .addStringOption(option =>
            option.setName("username")
                .setDescription("송금할 계좌 소유자 닉네임")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("송금할 금액")
                .setRequired(true)
        ),
    option: {
        category: "BANK",
        devOnly: false,
        adminOnly: false,
        maintenance: false,
        cooltime: 5
    },

    async execute(interaction, client) {
        await interaction.deferReply();

        const guild = client.guilds.cache.get(interaction.guildId);
        const userName = interaction.options.getString("username");
        const sendAmount = interaction.options.getInteger("amount");
        const sendUser = guild.members.cache.get(interaction.user.id);
        const receiveUser = guild.members.cache.get(userName.replace(/[^0-9]/g, ""));
        if (sendUser.user.id == receiveUser.user.id) return await interaction.editReply({ content: `본인에게 송금할 수 없습니다.` });
        if (!receiveUser) return await interaction.editReply({ content: `존재하지 않는 유저입니다.` });
        if (sendAmount < 1) return await interaction.editReply({ content: `최소 송금 금액은 1원입니다.` });
        if (sendAmount > 10000000) return await interaction.editReply({ content: `최대 송금 금액은 10,000,000원입니다.` });

        const queryS = { userId: sendUser.user.id };
        const queryR = { userId: receiveUser.user.id };
        const sendData = await readData("User", queryS);
        const receiveData = await readData("User", queryR);

        const emMessage = new EmbedBuilder()
            .setTimestamp()
            .setFooter({ text: '🏦 Bank of Chamchi' });

        if (!sendData[0]) {
            emMessage.setAuthor({ name: sendUser.nickname || sendUser.user.globalName, iconURL: `https://cdn.discordapp.com/avatars/${sendUser.user.id}/${sendUser.user.avatar}` });
            emMessage.setTitle(`송금 불가: 계좌 없음`);
            emMessage.setColor("#FF0000");
            emMessage.setDescription(`본인 계좌가 존재하지 않습니다.`);
        } else if (!receiveData[0]) {
            emMessage.setAuthor({ name: receiveUser.nickname || receiveUser.user.globalName, iconURL: `https://cdn.discordapp.com/avatars/${receiveUser.user.id}/${receiveUser.user.avatar}` });
            emMessage.setTitle(`송금 불가: 대상 계좌 없음`);
            emMessage.setColor("#FF0000");
            emMessage.setDescription(`송금 대상 계좌가 존재하지 않습니다.`);
        } else if (sendAmount > sendData[0].userMoney) {
            emMessage.setAuthor({ name: sendUser.nickname || sendUser.user.globalName, iconURL: `https://cdn.discordapp.com/avatars/${sendUser.user.id}/${sendUser.user.avatar}` });
            emMessage.setTitle(`송금 불가: 잔액 부족`);
            emMessage.setColor("#FF0000");
            emMessage.setDescription(`계좌 잔액이 부족합니다.`);
        } else {
            emMessage.setAuthor({ name: sendUser.nickname || sendUser.user.globalName, iconURL: `https://cdn.discordapp.com/avatars/${sendUser.user.id}/${sendUser.user.avatar}` });
            emMessage.setTitle(`송금 완료`);
            emMessage.setColor("#50C878");
            emMessage.setDescription(`송금대상: ${receiveUser.nickname || receiveUser.user.globalName}\n송금금액: ${sendAmount.toLocaleString('en-US')}원\n잔액: ${(sendData[0].userMoney - sendAmount).toLocaleString('en-US')}원`);
        }

        const sendUserEdit = updateData("User", queryS, { userMoney: sendData[0].userMoney - sendAmount });
        const receiveUserEdit = updateData("User", queryR, { userMoney: receiveData[0].userMoney + sendAmount });

        await interaction.editReply({ embeds: [emMessage] });
    }
}