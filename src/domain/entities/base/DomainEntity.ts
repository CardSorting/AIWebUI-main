import { DomainEvent } from '../../events/base/DomainEvent';
import { UserId } from '../../value-objects/UserId';

export abstract class DomainEntity {
  private _id: UserId;

  private _domainEvents: DomainEvent[] = [];

  protected constructor(id: UserId) {
    this._id = id;
  }

  public get id(): string {
    return this._id.value;
  }

  public get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  public clearDomainEvents(): void {
    this._domainEvents = [];
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }
}
