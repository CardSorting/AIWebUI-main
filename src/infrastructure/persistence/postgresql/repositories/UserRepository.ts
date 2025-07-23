import { Pool } from 'pg';
import { User } from '../../../../domain/entities/User';
import { Email } from '../../../../domain/value-objects/Email';
import { UserId } from '../../../../domain/value-objects/UserId';
import {
  IUserFactory,
  IUserQueries,
  IUserRepository,
} from '../../../../domain/repositories/IUserRepository';

export class PostgresUserRepository implements IUserRepository, IUserQueries {
  constructor(
    private readonly pool: Pool,
    private readonly userFactory: IUserFactory,
  ) {}

  async findById(id: UserId): Promise<User | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [
      id.value,
    ]);

    if (!result.rows[0]) return null;

    return this.userFactory.reconstitute({
      id: result.rows[0].id,
      email: result.rows[0].email,
      hashedPassword: result.rows[0].password,
      name: result.rows[0].name,
      credits: result.rows[0].credits,
      membershipTier: result.rows[0].membership_tier,
      membershipExpiry: result.rows[0].membership_expiry
        ? new Date(result.rows[0].membership_expiry)
        : undefined,
    });
  }

  async findByEmail(email: Email): Promise<User | null> {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.value],
    );

    if (!result.rows[0]) return null;

    return this.userFactory.reconstitute({
      id: result.rows[0].id,
      email: result.rows[0].email,
      hashedPassword: result.rows[0].password,
      name: result.rows[0].name,
      credits: result.rows[0].credits,
      membershipTier: result.rows[0].membership_tier,
      membershipExpiry: result.rows[0].membership_expiry
        ? new Date(result.rows[0].membership_expiry)
        : undefined,
    });
  }

  async save(user: User): Promise<void> {
    await this.pool.query(
      `INSERT INTO users (id, email, password, name, credits, membership_tier, membership_expiry)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        user.id,
        user.email,
        user.hashedPassword,
        user.name,
        user.credits,
        user.membershipTier,
        user.membershipExpiry,
      ],
    );
  }

  async update(user: User): Promise<void> {
    await this.pool.query(
      `UPDATE users 
       SET email = $2, name = $3, credits = $4, membership_tier = $5, membership_expiry = $6
       WHERE id = $1`,
      [
        user.id,
        user.email,
        user.name,
        user.credits,
        user.membershipTier,
        user.membershipExpiry,
      ],
    );
  }

  async delete(id: UserId): Promise<void> {
    await this.pool.query('DELETE FROM users WHERE id = $1', [id.value]);
  }

  async exists(email: Email): Promise<boolean> {
    const result = await this.pool.query(
      'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)',
      [email.value],
    );
    return result.rows[0].exists;
  }

  // Query methods
  async getUserCredits(id: UserId): Promise<number> {
    const result = await this.pool.query(
      'SELECT credits FROM users WHERE id = $1',
      [id.value],
    );
    return result.rows[0]?.credits ?? 0;
  }

  async getUserMembership(id: UserId): Promise<{
    tier: string | null;
    expiryDate: Date | null;
  }> {
    const result = await this.pool.query(
      'SELECT membership_tier, membership_expiry FROM users WHERE id = $1',
      [id.value],
    );

    return {
      tier: result.rows[0]?.membership_tier ?? null,
      expiryDate: result.rows[0]?.membership_expiry
        ? new Date(result.rows[0].membership_expiry)
        : null,
    };
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const result = await this.pool.query(
      'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)',
      [email],
    );
    return result.rows[0].exists;
  }

  async getTotalUsers(): Promise<number> {
    const result = await this.pool.query('SELECT COUNT(*) FROM users');
    return parseInt(result.rows[0].count);
  }

  async getUsersCreatedBetween(
    startDate: Date,
    endDate: Date,
  ): Promise<Array<{ id: string; email: string; createdAt: Date }>> {
    const result = await this.pool.query(
      'SELECT id, email, created_at FROM users WHERE created_at BETWEEN $1 AND $2',
      [startDate, endDate],
    );

    return result.rows.map(row => ({
      id: row.id,
      email: row.email,
      createdAt: new Date(row.created_at),
    }));
  }

  // Initialize database schema
  async initializeSchema(): Promise<void> {
    await this.pool.query(`
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
    `);
  }
}
