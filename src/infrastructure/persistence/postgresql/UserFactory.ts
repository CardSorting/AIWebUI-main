import { User } from '../../../domain/entities/User';
import { Email } from '../../../domain/value-objects/Email';
import { Password } from '../../../domain/value-objects/Password';
import { UserId } from '../../../domain/value-objects/UserId';
import { Credits } from '../../../domain/value-objects/Credits';
import { IUserFactory } from '../../../domain/repositories/IUserRepository';

export class UserFactory implements IUserFactory {
  public async createUser(params: {
    email: string;
    password: string;
    name: string;
    initialCredits?: number;
  }): Promise<User> {
    const email = Email.create(params.email);
    const password = await Password.createFromPlaintext(params.password);

    return User.create(email, password, params.name, params.initialCredits);
  }

  public reconstitute(params: {
    id: string;
    email: string;
    hashedPassword: string;
    name: string;
    credits: number;
    membershipTier?: string;
    membershipExpiry?: Date;
  }): User {
    // Use private constructor through static method to reconstitute the user
    return User.reconstitute({
      id: UserId.create(params.id),
      email: Email.create(params.email),
      password: Password.createFromHash(params.hashedPassword),
      name: params.name,
      credits: Credits.fromNumber(params.credits),
      membershipTier: params.membershipTier,
      membershipExpiry: params.membershipExpiry,
    });
  }
}

// Factory singleton instance
export const userFactory = new UserFactory();
