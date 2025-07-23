import { Credits } from '../value-objects/Credits';
import { Password } from '../value-objects/Password';
import { Email } from '../value-objects/Email';
import { UserId } from '../value-objects/UserId';
import { DomainEntity } from './base/DomainEntity';
import { UserCreatedEvent } from '../events/UserEvents';

interface UserProps {
  id: UserId;
  email: Email;
  password: Password;
  name: string;
  credits: Credits;
  membershipTier?: string;
  membershipExpiry?: Date;
}

export class User extends DomainEntity {
  private readonly _email: Email;

  private readonly _password: Password;

  private readonly _name: string;

  private _credits: Credits;

  private _membershipTier?: string;

  private _membershipExpiry?: Date;

  private constructor(props: UserProps) {
    super(props.id);
    this._email = props.email;
    this._password = props.password;
    this._name = props.name;
    this._credits = props.credits;
    this._membershipTier = props.membershipTier;
    this._membershipExpiry = props.membershipExpiry;
  }

  // Factory method for creating a new user
  public static create(
    email: Email,
    password: Password,
    name: string,
    initialCredits = 10,
  ): User {
    const id = UserId.generate();
    const credits = Credits.fromNumber(initialCredits);

    const user = new User({
      id,
      email,
      password,
      name,
      credits,
    });

    user.addDomainEvent(new UserCreatedEvent(id, email));
    return user;
  }

  // Reconstitute method for creating a user from storage
  public static reconstitute(props: UserProps): User {
    return new User(props);
  }

  // Getters
  public get email(): string {
    return this._email.value;
  }

  public get hashedPassword(): string {
    return this._password.value;
  }

  public get name(): string {
    return this._name;
  }

  public get credits(): number {
    return this._credits.value;
  }

  public get membershipTier(): string | undefined {
    return this._membershipTier;
  }

  public get membershipExpiry(): Date | undefined {
    return this._membershipExpiry;
  }

  // Business logic methods
  public async verifyPassword(plainPassword: string): Promise<boolean> {
    return this._password.verify(plainPassword);
  }

  public deductCredits(amount: number): void {
    if (amount <= 0) {
      throw new Error('Credit deduction amount must be positive');
    }

    const newCredits = Credits.fromNumber(this._credits.value - amount);
    if (newCredits.value < 0) {
      throw new Error('Insufficient credits');
    }

    this._credits = newCredits;
  }

  public addCredits(amount: number): void {
    if (amount <= 0) {
      throw new Error('Credit addition amount must be positive');
    }

    this._credits = Credits.fromNumber(this._credits.value + amount);
  }

  public updateMembership(tier: string, expiryDate: Date): void {
    if (expiryDate < new Date()) {
      throw new Error('Membership expiry date cannot be in the past');
    }

    this._membershipTier = tier;
    this._membershipExpiry = expiryDate;
  }

  public isValidMembership(): boolean {
    if (!this._membershipTier || !this._membershipExpiry) {
      return false;
    }

    return this._membershipExpiry > new Date();
  }
}
