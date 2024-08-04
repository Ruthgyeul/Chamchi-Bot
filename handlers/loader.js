const { Collection } = require("discord.js");
const { readdirSync } = require("fs");

client.commands = new Collection();

/*===== Call Events =====*/
const DiscordEvents = readdirSync("./events/Discord/").filter(file => file.endsWith(".js"));

for (const file of DiscordEvents) {
    const DiscordEvent = require(`../events/Discord/${file}`);
    console.info(`[I] Loaded Discord Event ${file.split(".")[0]}`);
    client.on(file.split(".")[0], (interaction) => DiscordEvent(interaction, client));
}

/*===== Call Commands =====*/
readdirSync("./commands/").forEach(dirs => {
    const commands = readdirSync(`./commands/${dirs}`).filter(files => files.endsWith(".js"));

    for (const file of commands) {
        try {
            const command = require(`../commands/${dirs}/${file}`);

            if (!command.data || !command.data.name) {
                console.error(`[E] Invalid command structure in ${file}. Ensure "data" and "name" properties are defined.`);
                continue;
            }

            client.commands.set(command.data.name.toLowerCase(), command);
            console.info(`[I] Loaded Command ${command.data.name.toLowerCase()}`);
        } catch (error) {
            console.error(`[E] Error loading command from file ${file}: ${error}`);
            throw error;
        }
    }
});

/*===== Register Global Commands after Client is Ready =====*/
client.once("ready", () => {
    const commandsData = client.commands.map(command => command.data.toJSON());

    client.application.commands.set([])
        .then(() => client.application.commands.set(commandsData))
        .then(() => console.info("[I] Global Commands Registered."))
        .catch(error => console.error(`[E] Error registering global commands: ${error}`));
});
