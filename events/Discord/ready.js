module.exports = async (client) => {
    const sServerN = client.guilds.cache.size;
    const sUserN = client.guilds.cache.reduce((users, value) => users + value.memberCount, 0);

    console.info(`[I] Login as ${client.user.username}`);
    console.info(`[I] Service on ${sServerN} servers`);
    console.info(`[I] Using by ${sUserN} users`);

    client.user.setActivity(client.config.app.activity[0]); 

    return console.info(`[I] Bot is now Ready.`);
};