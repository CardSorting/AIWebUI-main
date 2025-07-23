import bcrypt from 'bcryptjs';
import { ValueObject } from './base/ValueObject';

export class Password extends ValueObject<string> {
  private static readonly SALT_ROUNDS = 10;

  private static readonly MIN_LENGTH = 8;

  private static readonly MAX_LENGTH = 100;

  private constructor(hashedPassword: string) {
    super(hashedPassword);
  }

  public static async createFromPlaintext(password: string): Promise<Password> {
    Password.validatePlaintext(password);
    const hashedPassword = await bcrypt.hash(password, Password.SALT_ROUNDS);
    return new Password(hashedPassword);
  }

  public static createFromHash(hashedPassword: string): Password {
    if (!hashedPassword.startsWith('$2')) {
      throw new Error('Invalid hashed password format');
    }
    return new Password(hashedPassword);
  }

  private static validatePlaintext(password: string): void {
    if (password.length < Password.MIN_LENGTH) {
      throw new Error(
        `Password must be at least ${Password.MIN_LENGTH} characters long`,
      );
    }

    if (password.length > Password.MAX_LENGTH) {
      throw new Error(
        `Password must not exceed ${Password.MAX_LENGTH} characters`,
      );
    }

    // Require at least one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      );
    }
  }

  public get value(): string {
    return this.props;
  }

  public async verify(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.props);
  }
}
