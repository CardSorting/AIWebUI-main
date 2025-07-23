import { User } from '../entities/User';
import { Email } from '../value-objects/Email';
import { UserId } from '../value-objects/UserId';

export interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
  exists(email: Email): Promise<boolean>;
}

export interface IUserQueries {
  getUserCredits(id: UserId): Promise<number>;
  getUserMembership(id: UserId): Promise<{
    tier: string | null;
    expiryDate: Date | null;
  }>;
  isEmailTaken(email: string): Promise<boolean>;
  getTotalUsers(): Promise<number>;
  getUsersCreatedBetween(
    startDate: Date,
    endDate: Date,
  ): Promise<
    Array<{
      id: string;
      email: string;
      createdAt: Date;
    }>
  >;
}

// Factory interface for creating User entities
export interface IUserFactory {
  createUser(params: {
    email: string;
    password: string;
    name: string;
    initialCredits?: number;
  }): Promise<User>;

  reconstitute(params: {
    id: string;
    email: string;
    hashedPassword: string;
    name: string;
    credits: number;
    membershipTier?: string;
    membershipExpiry?: Date;
  }): User;
}
