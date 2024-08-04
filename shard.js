const { ShardingManager } = require("discord.js");
const config = require("./config");

const shard = new ShardingManager("./main.js", {
    totalShards: "auto", // This will spawn the amount of shards you need automatically
    token: config.app.token,
});

shard.on("shardCreate", shard => console.info(`[I] Launched shard ${shard.id}`));

shard.spawn();
