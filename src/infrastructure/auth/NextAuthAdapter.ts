import { container } from '../di/container';
import { Email } from '../../domain/value-objects/Email';
import { UserId } from '../../domain/value-objects/UserId';
import type { User } from 'next-auth';

export class NextAuthAdapter {
  public static async verifyCredentials(
    email: string,
    password: string
  ): Promise<User | null> {
    try {
      const authQuery = container.authenticateUserQueryHandler();
      const result = await authQuery.execute({ email, password });

      if (!result) {
        return null;
      }

      return {
        id: result.id,
        email: result.email,
        name: result.name,
        credits: result.credits,
        membershipTier: result.membershipTier,
        membershipExpiry: result.membershipExpiry,
      };
    } catch (error) {
      console.error('Error verifying credentials:', error);
      return null;
    }
  }

  public static async getUserById(id: string): Promise<User | null> {
    try {
      const userRepo = container.getUserRepository();
      const user = await userRepo.findById(UserId.create(id));

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
        membershipTier: user.membershipTier,
        membershipExpiry: user.membershipExpiry,
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  public static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const userRepo = container.getUserRepository();
      const user = await userRepo.findByEmail(Email.create(email));

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
        membershipTier: user.membershipTier,
        membershipExpiry: user.membershipExpiry,
      };
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  public static async createUser(params: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    const createCommand = container.createUserCommandHandler();
    const userId = await createCommand.execute(params);

    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('Failed to retrieve created user');
    }

    return user;
  }
}
