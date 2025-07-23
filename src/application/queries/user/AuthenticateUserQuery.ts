import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { Email } from '../../../domain/value-objects/Email';
import { User } from '../../../domain/entities/User';

export interface AuthenticateUserQueryParams {
  email: string;
  password: string;
}

export interface AuthenticatedUserDTO {
  id: string;
  email: string;
  name: string;
  credits: number;
  membershipTier?: string;
  membershipExpiry?: Date;
}

export class AuthenticateUserQuery {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(
    params: AuthenticateUserQueryParams,
  ): Promise<AuthenticatedUserDTO | null> {
    // Find user by email
    const user = await this.userRepository.findByEmail(
      Email.create(params.email),
    );

    if (!user) {
      return null;
    }

    // Verify password
    const isValid = await user.verifyPassword(params.password);
    if (!isValid) {
      return null;
    }

    // Return DTO with user information
    return this.toDTO(user);
  }

  private toDTO(user: User): AuthenticatedUserDTO {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      credits: user.credits,
      membershipTier: user.membershipTier,
      membershipExpiry: user.membershipExpiry,
    };
  }
}

// Query Handler factory
export const createAuthenticateUserQueryHandler = (
  userRepository: IUserRepository,
) => {
  return new AuthenticateUserQuery(userRepository);
};
