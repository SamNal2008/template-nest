import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import {
  UserTheme,
} from '../../../api/users/utils/enums/user.enum';
import { MimeTypeEnum } from '../../file/utils/enums/mime-types.enum';

export class RandomGeneratorFactory {
  private static enumMap = {
    mimeType: MimeTypeEnum,
    theme: UserTheme,
  };

  public static generate(type: string, name: string): unknown {
    type = type.toLowerCase();
    if (type.includes('number')) return RandomGeneratorFactory.number();
    if (type.includes('uuid')) return RandomGeneratorFactory.UUID();
    if (type.includes('enum')) return RandomGeneratorFactory.getEnum(name);
    if (type.includes('bool')) return RandomGeneratorFactory.boolean();
    if (type.includes('timestamp')) return RandomGeneratorFactory.date();

    if (name.includes('phone')) return RandomGeneratorFactory.phoneNumber();
    if (name.includes('mail')) return RandomGeneratorFactory.email();
    if (name.includes('url')) return RandomGeneratorFactory.url();

    return RandomGeneratorFactory.string();
  }

  /**
   * Generate a new UUID
   * @returns {string}
   * @constructor
   */
  public static UUID(): string {
    return uuidv4();
  }

  public static phoneNumber(): string {
    return '0666013269';
  }

  /**
   * Generate new math random with secured generation
   * @returns {number}
   */
  public static securedMathRandom(): number {
    return crypto.randomInt(100) / 100;
  }

  /**
   * Generate new random number secured way
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  public static number(min = 0, max = 1000): number {
    return crypto.randomInt(min, max);
  }

  /**
   * Generate new random string
   */
  public static string(length = 20): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Without specified date it will return a random date
   * between now and ten years later
   * @param {Date} after
   * @param {Date} before
   * @returns {Date}
   */
  public static date(
    after: Date = new Date(),
    before: Date = new Date(
      new Date().getFullYear() + 10,
      new Date().getMonth(),
    ),
  ): Date {
    return new Date(
      after.getTime() +
        RandomGeneratorFactory.securedMathRandom() *
          (before.getTime() - after.getTime()),
    );
  }

  public static url(domain = 'aws-s3', isSecured = true): string {
    return (
      (isSecured ? 'https://' : 'http://') +
      `${domain}.${RandomGeneratorFactory.string()}.${domain}.website`
    );
  }

  public static email(domain = 'mail', nation = 'fr'): string {
    return `${RandomGeneratorFactory.string()}@${domain}.${nation}`;
  }

  /**
   * Generate random boolean
   * @returns {boolean}
   */
  public static boolean(): boolean {
    return RandomGeneratorFactory.number() % 2 === 0;
  }

  public static randomEnum<T>(anEnum: T): unknown {
    const enumValues = Object.keys(anEnum);
    return enumValues[RandomGeneratorFactory.number(0, enumValues.length - 1)];
  }

  private static getEnum(enumName: string): unknown {
    console.log('Getting enum for ' + enumName);
    if (Object.keys(RandomGeneratorFactory.enumMap).includes(enumName))
      return this.randomEnum(this.enumMap[enumName]);
    console.error('no enum found');
    return RandomGeneratorFactory.string();
  }
}
