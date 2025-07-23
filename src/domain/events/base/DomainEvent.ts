export abstract class DomainEvent {
  public readonly dateTimeOccurred: Date;

  protected readonly eventName: string;

  protected constructor(eventName: string) {
    this.dateTimeOccurred = new Date();
    this.eventName = eventName;
  }

  public abstract toPrimitive(): Record<string, unknown>;

  public getEventName(): string {
    return this.eventName;
  }
}
