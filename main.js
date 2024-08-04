const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { connectDB } = require("./utils/database");

/*===== Client =====*/
global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageTyping
    ],
    disableMentions: "everyone"
});

/*===== Client Configuration =====*/
client.config = require("./config");
client.ws.setMaxListeners(Infinity);

/*===== Database Connection =====*/
const uri = client.config.db.uri;
connectDB(uri).then(() => {
    /*===== Load Files =====*/
    require("./handlers/loader");
});

/*===== Error Handlers =====*/
client.on("error", (error) => {
    console.error(`[!] 에러 발셍: ${error}`);
});

/*===== Login =====*/
client.login(client.config.app.token);
