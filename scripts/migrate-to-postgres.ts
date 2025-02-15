const sqlite3 = require('sqlite3');
const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const sqlite = require('sqlite');

// Load environment variables
dotenv.config();

interface SQLiteUser {
  id: number;
  name: string;
  email: string;
  password: string;
  credits: number | null;
  membershipTier: string | null;
  membershipExpiry: number | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  credits: number;
  membershipTier: string | null;
  membershipExpiry: Date | null;
}

interface ImageMetadata {
  id: number;
  prompt: string;
  imageUrl: string;
  backblazeUrl: string;
  seed: number;
  width: number;
  height: number;
  contentType: string;
  hasNsfwConcepts: string;
  fullResult: string;
  createdAt: string;
  userId: string; // Changed to string for UUID
}

async function migrate() {
  // Initialize SQLite connection
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  const sqliteDb = await sqlite.open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Initialize PostgreSQL connection
  const pg = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:ukedAhWBKMnlkFQAnBylDuHDkkWYeMhY@monorail.proxy.rlwy.net:50047/railway'
  });

  try {
    // Create tables in PostgreSQL
    await pg.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        credits INTEGER NOT NULL DEFAULT 10,
        membership_tier VARCHAR(50),
        membership_expiry TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_membership ON users(membership_tier, membership_expiry);

      DROP TABLE IF EXISTS image_metadata;
      
      CREATE TABLE IF NOT EXISTS image_metadata (
        id SERIAL PRIMARY KEY,
        prompt TEXT,
        imageUrl TEXT,
        backblazeUrl TEXT,
        seed INTEGER,
        width INTEGER,
        height INTEGER,
        contentType TEXT,
        hasNsfwConcepts TEXT,
        fullResult TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        userId UUID REFERENCES users(id)
      );
    `);

    // Migrate users
    console.log('Migrating users...');
    const sqliteUsers = await sqliteDb.all('SELECT * FROM users') as SQLiteUser[];
    
    // Create a map to store old ID to new UUID mapping
    const idMapping = new Map<number, string>();
    
    // Convert SQLite users to PostgreSQL format with UUIDs
    const users: User[] = sqliteUsers.map(user => {
      const newId = uuidv4();
      idMapping.set(user.id, newId);
      return {
        id: newId,
        name: user.name,
        email: user.email,
        password: user.password,
        credits: user.credits || 10,
        membershipTier: user.membershipTier || null,
        membershipExpiry: user.membershipExpiry ? new Date(user.membershipExpiry) : null
      };
    });
    
    for (const user of users) {
      await pg.query(
        `INSERT INTO users (id, name, email, password, credits, membership_tier, membership_expiry)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           email = EXCLUDED.email,
           password = EXCLUDED.password,
           credits = EXCLUDED.credits,
           membership_tier = EXCLUDED.membership_tier,
           membership_expiry = EXCLUDED.membership_expiry`,
        [
          user.id,
          user.name,
          user.email,
          user.password,
          user.credits,
          user.membershipTier,
          user.membershipExpiry
        ]
      );
    }
    console.log(`Migrated ${users.length} users`);

    // Migrate image metadata
    console.log('Migrating image metadata...');
    const images = await sqliteDb.all('SELECT * FROM image_metadata') as ImageMetadata[];
    
    for (const image of images) {
      const newUserId = idMapping.get(Number(image.userId));
      if (!newUserId) {
        console.warn(`Skipping image ${image.id} - user ${image.userId} not found`);
        continue;
      }

      await pg.query(
        `INSERT INTO image_metadata (
          id, prompt, imageUrl, backblazeUrl, seed, width, height,
          contentType, hasNsfwConcepts, fullResult, createdAt, userId
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          prompt = EXCLUDED.prompt,
          imageUrl = EXCLUDED.imageUrl,
          backblazeUrl = EXCLUDED.backblazeUrl,
          seed = EXCLUDED.seed,
          width = EXCLUDED.width,
          height = EXCLUDED.height,
          contentType = EXCLUDED.contentType,
          hasNsfwConcepts = EXCLUDED.hasNsfwConcepts,
          fullResult = EXCLUDED.fullResult,
          createdAt = EXCLUDED.createdAt,
          userId = EXCLUDED.userId`,
        [
          image.id,
          image.prompt,
          image.imageUrl,
          image.backblazeUrl,
          image.seed,
          image.width,
          image.height,
          image.contentType,
          image.hasNsfwConcepts,
          image.fullResult,
          image.createdAt,
          newUserId
        ]
      );
    }
    console.log(`Migrated ${images.length} images`);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await sqliteDb.close();
    await pg.end();
  }
}

// Run migration
migrate().catch(console.error);

// Make this file a module
export {};
