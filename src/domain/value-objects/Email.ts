import { ValueObject } from './base/ValueObject';

export class Email extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
    this.validate(value);
  }

  private validate(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    
    if (email.length > 255) {
      throw new Error('Email is too long');
    }
  }

  public static create(email: string): Email {
    return new Email(email.toLowerCase());
  }

  public get value(): string {
    return this.props;
  }

  public get domain(): string {
    return this.props.split('@')[1];
  }

  public get localPart(): string {
    return this.props.split('@')[0];
  }
}
