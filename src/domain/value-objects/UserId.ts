import { ValueObject } from './base/ValueObject';
import { v4 as uuidv4 } from 'uuid';

export class UserId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
    this.validate(value);
  }

  private validate(id: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Invalid user ID format');
    }
  }

  public static create(value: string): UserId {
    return new UserId(value);
  }

  public static generate(): UserId {
    return new UserId(uuidv4());
  }

  public get value(): string {
    return this.props;
  }
}
