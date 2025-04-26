import { configDotenv } from "dotenv";
configDotenv();

import { MongoClient, ServerApiVersion } from "mongodb";

const {DB_CONNECTION_URI} = process.env;

const client = new MongoClient(DB_CONNECTION_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB database");
}

run().catch(console.dir);

export default client.db("simplestreaksbot");