import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface ImageMetadata {
  id: number;
  prompt: string;
  seed: number;
  width: number;
  height: number;
  contentType: string;
  hasNsfwConcepts: string;
  fullResult: string;
  imageData: Buffer;
  createdAt: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  credits: number;
  membershipTier?: string | null;
  membershipExpiry?: number | null;
}

export class DatabaseAPI {
  private pool: Pool | null = null;

  async initialize() {
    if (this.pool) return;

    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:ukedAhWBKMnlkFQAnBylDuHDkkWYeMhY@monorail.proxy.rlwy.net:50047/railway'
    });

    // Create tables if they don't exist
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        credits INTEGER DEFAULT 10,
        membershipTier TEXT,
        membershipExpiry TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS image_metadata (
        id SERIAL PRIMARY KEY,
        prompt TEXT,
        seed INTEGER,
        width INTEGER,
        height INTEGER,
        contentType TEXT,
        hasNsfwConcepts TEXT,
        fullResult TEXT,
        imageData BYTEA,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        userId UUID REFERENCES users(id)
      );
    `);
  }

  // Create a new user
  async createUser(name: string, email: string, password: string): Promise<User> {
    if (!this.pool) throw new Error('Database not initialized');

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user with default credits
      const newId = uuidv4();
      const result = await client.query(
        'INSERT INTO users (id, name, email, password, credits) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [newId, name, email, hashedPassword, 10]
      );

      const user = result.rows[0];
      if (!user) throw new Error('Failed to create user');

      await client.query('COMMIT');
      return user;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Retrieve a user by email
  async getUserByEmail(email: string): Promise<User | null> {
    if (!this.pool) throw new Error('Database not initialized');

    const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  // Retrieve a user by ID
  async getUserById(id: string): Promise<User | null> {
    if (!this.pool) throw new Error('Database not initialized');

    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  // Verify user credentials during login
  async verifyUserCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Save image metadata
  async saveImageMetadata(data: Omit<ImageMetadata, 'id' | 'createdAt'>): Promise<ImageMetadata> {
    if (!this.pool) throw new Error('Database not initialized');

    const result = await this.pool.query(
      `INSERT INTO image_metadata (
        prompt, seed, width, height, contentType, hasNsfwConcepts, fullResult, imageData, userId
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        data.prompt,
        data.seed,
        data.width,
        data.height,
        data.contentType,
        data.hasNsfwConcepts,
        data.fullResult,
        data.imageData,
        data.userId,
      ]
    );

    const savedData = result.rows[0];
    if (!savedData) throw new Error('Failed to retrieve saved data');

    return savedData;
  }

  // Get recent images (optionally filtered by user)
  async getRecentImages(limit: number = 20, userId?: string): Promise<ImageMetadata[]> {
    if (!this.pool) throw new Error('Database not initialized');

    const query = userId 
      ? 'SELECT * FROM image_metadata WHERE userId = $1 ORDER BY createdAt DESC LIMIT $2'
      : 'SELECT * FROM image_metadata ORDER BY createdAt DESC LIMIT $1';

    const params = userId ? [userId, limit] : [limit];
    const result = await this.pool.query(query, params);

    return result.rows;
  }

  // Get user credits
  async getUserCredits(userId: string): Promise<number> {
    if (!this.pool) throw new Error('Database not initialized');

    const result = await this.pool.query('SELECT credits FROM users WHERE id = $1', [userId]);
    return result.rows[0]?.credits || 0;
  }

  // Update user credits
  async updateUserCredits(userId: string, creditChange: number): Promise<void> {
    if (!this.pool) throw new Error('Database not initialized');

    await this.pool.query(
      'UPDATE users SET credits = credits + $1 WHERE id = $2',
      [creditChange, userId]
    );
  }

  // Get cached membership status for a user
  async getCachedMembershipStatus(userId: string): Promise<{ membershipTier: string | null, membershipExpiry: number | null } | null> {
    if (!this.pool) throw new Error('Database not initialized');

    const result = await this.pool.query(
      'SELECT membershipTier, membershipExpiry FROM users WHERE id = $1',
      [userId]
    );

    if (!result.rows[0]) return null;

    return {
      membershipTier: result.rows[0].membershipTier,
      membershipExpiry: result.rows[0].membershipExpiry
    };
  }

  // Cache membership status with expiration time
  async cacheMembershipStatus(userId: string, membershipTier: string, expiry: number): Promise<void> {
    if (!this.pool) throw new Error('Database not initialized');

    await this.pool.query(
      'UPDATE users SET membershipTier = $1, membershipExpiry = $2 WHERE id = $3',
      [membershipTier, expiry, userId]
    );
  }

  // Close the database connection
  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}

export const databaseAPI = new DatabaseAPI();
