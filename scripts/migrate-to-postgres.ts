const sqlite3 = require('sqlite3');
const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  credits: number;
  membershipTier: string | null;
  membershipExpiry: number | null;
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
  userId: number;
}

async function migrate() {
  // Initialize SQLite connection
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  const sqlite = await require('sqlite').open({
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
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        credits INTEGER DEFAULT 10,
        membershipTier TEXT,
        membershipExpiry BIGINT
      );

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
        userId INTEGER REFERENCES users(id)
      );
    `);

    // Migrate users
    console.log('Migrating users...');
    const users = await sqlite.all('SELECT * FROM users') as User[];
    
    for (const user of users) {
      await pg.query(
        `INSERT INTO users (id, name, email, password, credits, membershipTier, membershipExpiry)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           email = EXCLUDED.email,
           password = EXCLUDED.password,
           credits = EXCLUDED.credits,
           membershipTier = EXCLUDED.membershipTier,
           membershipExpiry = EXCLUDED.membershipExpiry`,
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
    const images = await sqlite.all('SELECT * FROM image_metadata') as ImageMetadata[];
    
    for (const image of images) {
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
          image.userId
        ]
      );
    }
    console.log(`Migrated ${images.length} images`);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await sqlite.close();
    await pg.end();
  }
}

// Run migration
migrate().catch(console.error);
