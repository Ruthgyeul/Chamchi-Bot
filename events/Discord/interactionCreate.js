const { Interaction } = require("discord.js");

module.exports = async (interaction, client) => {
    if (!interaction || !interaction.isCommand) return;

    try {
        // Assuming isCommand is a function or property present in a valid Interaction instance
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName.toLowerCase());

        if (!command) return;
        if (command.option.maintenance && interaction.user.id != client.config.app.author) return await interaction.reply({ content: "현재 유지 보수 진행 중인 명령어입니다!", ephemeral: true });
        if (command.option.devOnly && interaction.user.id != client.config.app.author) return await interaction.reply({ content: "개발자 전용 명령어입니다!", ephemeral: true });
        //if (command.option.adminOnly && interaction.user.id permission!!!) return await interaction.reply({ content: "관리자 전용 명령어입니다!", ephemeral: true });

        //console.log(interaction.user);

        await command.execute(interaction, client);
    } catch (error) {
        console.error(`Error in interactionCreate event: ${error}`);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: false,
        });
    }
};
