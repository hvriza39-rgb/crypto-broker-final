import clientPromise from './mongoClient';

export async function getDb() {
  const client = await clientPromise;
  return client.db(); // uses database from connection string
}
