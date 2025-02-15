import { IUserRepository, IUserFactory } from '../../../domain/repositories/IUserRepository';
import { Email } from '../../../domain/value-objects/Email';

export interface CreateUserCommandParams {
  email: string;
  password: string;
  name: string;
  initialCredits?: number;
}

export class CreateUserCommand {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: IUserFactory
  ) {}

  public async execute(params: CreateUserCommandParams): Promise<string> {
    // Check if email is already taken
    const emailExists = await this.userRepository.exists(
      Email.create(params.email)
    );
    
    if (emailExists) {
      throw new Error('Email is already taken');
    }

    // Create new user through factory
    const user = await this.userFactory.createUser({
      email: params.email,
      password: params.password,
      name: params.name,
      initialCredits: params.initialCredits
    });

    // Save user
    await this.userRepository.save(user);

    // Return the ID of the created user
    return user.id;
  }
}

// Command Handler factory
export const createCreateUserCommandHandler = (
  userRepository: IUserRepository,
  userFactory: IUserFactory
) => {
  return new CreateUserCommand(userRepository, userFactory);
};
