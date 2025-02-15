import { ValueObject } from './base/ValueObject';

export class Credits extends ValueObject<number> {
  private static readonly MIN_CREDITS = 0;
  private static readonly MAX_CREDITS = 1000000; // 1 million credit limit

  private constructor(value: number) {
    super(value);
    this.validate(value);
  }

  private validate(credits: number): void {
    if (!Number.isInteger(credits)) {
      throw new Error('Credits must be a whole number');
    }

    if (credits < Credits.MIN_CREDITS) {
      throw new Error('Credits cannot be negative');
    }

    if (credits > Credits.MAX_CREDITS) {
      throw new Error(`Credits cannot exceed ${Credits.MAX_CREDITS}`);
    }
  }

  public static fromNumber(value: number): Credits {
    return new Credits(Math.floor(value));
  }

  public add(credits: number): Credits {
    return Credits.fromNumber(this.value + credits);
  }

  public subtract(credits: number): Credits {
    return Credits.fromNumber(this.value - credits);
  }

  public hasEnough(required: number): boolean {
    return this.value >= required;
  }

  public get value(): number {
    return this.props;
  }

  public toString(): string {
    return this.value.toString();
  }
}
