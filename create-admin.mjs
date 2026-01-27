import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load your environment variables from .env
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function createAdmin() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is missing in your .env file.');
    return;
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas.');

    const db = client.db(); // Uses the database name from your URI
    const usersCollection = db.collection('users');

    // 1. Define the Admin Credentials
    const adminEmail = 'admin@broker.com';
    const plainPassword = 'Admin123!';

    // 2. Check if user already exists
    const existingUser = await usersCollection.findOne({ email: adminEmail });
    if (existingUser) {
      console.log('⚠️ Admin user already exists. Updating password and role...');
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 4. Insert or Update the Admin User
    await usersCollection.updateOne(
      { email: adminEmail },
      {
        $set: {
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
          name: 'System Admin',
          createdAt: new Date(),
        },
      },
      { upsert: true } // Creates the user if they don't exist
    );

    console.log(`🎉 Success! Admin created/updated.`);
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${plainPassword}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

createAdmin();