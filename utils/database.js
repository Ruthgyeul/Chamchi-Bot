const { MongoClient, ServerApiVersion } = require("mongodb");
let db;

async function connectDB(uri) {
    const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

    try {
        await client.connect();
        db = client.db();
        console.log("[IDB] Connected to MongoDB");
    } catch (error) {
        console.error(`[!DB] Failed to connect to MongoDB: ${error}`);
        process.exit(1);
    }
}

async function pingDB() {
    try {
        const result = await db.command({ ping: 1 });
        if (result.ok == 1) return "보안 장치 정상 작동 중";
        return "보안 장치 오류 발생";
    } catch (error) {
        console.error(`[!DB] Failed to ping MongoDB: ${error}`);
        return "도난 당해 존재하지 않음";
    }
}

async function newData(collectionName, dataJson) {
    try {
        const collection = db.collection(collectionName);
        const result = await collection.insertOne(dataJson);
        return result;
    } catch (error) {
        console.error(`[!DB] Failed to insert data: ${error}`);
        return [{ error: error }];
    }
}

async function updateData(collectionName, query, updateJson) {
    try {
        const collection = db.collection(collectionName);
        const result = await collection.updateOne(query, { $set: updateJson });
        return result;
    } catch (error) {
        console.error(`[!DB] Failed to update data: ${error}`);
        return [{ error: error }];
    }
}

async function deleteData(collectionName, query) {
    try {
        const collection = db.collection(collectionName);
        const result = await collection.deleteOne(query);
        return result;
    } catch (error) {
        console.error(`[!DB] Failed to delete data: ${error}`);
        return [{ error: error }];
    }
}

async function readData(collectionName, query = {}) {
    try {
        const collection = db.collection(collectionName);
        const result = await collection.find(query).toArray();
        return result;
    } catch (error) {
        console.error(`[!DB] Failed to read data for collection ${collectionName} with query ${JSON.stringify(query)}: ${error}`);
        return [{ error: error }];
    }
}


module.exports = { connectDB, pingDB, newData, updateData, deleteData, readData };
