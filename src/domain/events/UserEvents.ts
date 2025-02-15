import { DomainEvent } from './base/DomainEvent';
import { Email } from '../value-objects/Email';
import { UserId } from '../value-objects/UserId';

export class UserCreatedEvent extends DomainEvent {
  constructor(
    private readonly userId: UserId,
    private readonly email: Email
  ) {
    super('UserCreated');
  }

  public toPrimitive(): Record<string, unknown> {
    return {
      eventName: this.eventName,
      dateTimeOccurred: this.dateTimeOccurred,
      userId: this.userId.value,
      email: this.email.value,
    };
  }
}

export class UserCreditsUpdatedEvent extends DomainEvent {
  constructor(
    private readonly userId: UserId,
    private readonly previousCredits: number,
    private readonly newCredits: number
  ) {
    super('UserCreditsUpdated');
  }

  public toPrimitive(): Record<string, unknown> {
    return {
      eventName: this.eventName,
      dateTimeOccurred: this.dateTimeOccurred,
      userId: this.userId.value,
      previousCredits: this.previousCredits,
      newCredits: this.newCredits,
      difference: this.newCredits - this.previousCredits,
    };
  }
}

export class UserMembershipUpdatedEvent extends DomainEvent {
  constructor(
    private readonly userId: UserId,
    private readonly membershipTier: string,
    private readonly expiryDate: Date
  ) {
    super('UserMembershipUpdated');
  }

  public toPrimitive(): Record<string, unknown> {
    return {
      eventName: this.eventName,
      dateTimeOccurred: this.dateTimeOccurred,
      userId: this.userId.value,
      membershipTier: this.membershipTier,
      expiryDate: this.expiryDate,
    };
  }
}
