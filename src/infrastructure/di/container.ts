import { Pool } from 'pg';
import { UserFactory } from '../persistence/postgresql/UserFactory';
import { PostgresUserRepository } from '../persistence/postgresql/repositories/UserRepository';
import {
  CreateUserCommand,
  createCreateUserCommandHandler,
} from '../../application/commands/user/CreateUserCommand';
import {
  AuthenticateUserQuery,
  createAuthenticateUserQueryHandler,
} from '../../application/queries/user/AuthenticateUserQuery';

export class Container {
  private static instance: Container;

  private pool: Pool;

  private userRepository: PostgresUserRepository;

  private userFactory: UserFactory;

  private constructor() {
    // Initialize PostgreSQL pool
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Initialize factories
    this.userFactory = new UserFactory();

    // Initialize repositories
    this.userRepository = new PostgresUserRepository(
      this.pool,
      this.userFactory,
    );
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  // Command handlers
  public createUserCommandHandler(): CreateUserCommand {
    return createCreateUserCommandHandler(
      this.userRepository,
      this.userFactory,
    );
  }

  // Query handlers
  public authenticateUserQueryHandler(): AuthenticateUserQuery {
    return createAuthenticateUserQueryHandler(this.userRepository);
  }

  // Repository access
  public getUserRepository(): PostgresUserRepository {
    return this.userRepository;
  }

  // Initialize database schema
  public async initializeDatabase(): Promise<void> {
    await this.userRepository.initializeSchema();
  }

  // Cleanup
  public async dispose(): Promise<void> {
    await this.pool.end();
  }
}

// Export singleton instance
export const container = Container.getInstance();
