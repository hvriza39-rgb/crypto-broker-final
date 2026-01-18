import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  // If you don't have a .env file yet, this uses a default local database
  // You can change "broker-dashboard" to whatever your database name is
  process.env.MONGODB_URI = "mongodb://localhost:27017/broker-dashboard";
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a helper function to get the DB directly
export async function getDb() {
  const client = await clientPromise;
  return client.db(); 
}

// Export the client promise for other uses (like NextAuth adapters)
export default clientPromise;