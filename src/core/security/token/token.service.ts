import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';

@Injectable()
export class TokenService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private static padNumber(
    numberToInsert: number,
    sizeOfTheNumber: number,
  ): string {
    const sizeOfTheNumberAsString = sizeOfTheNumber.toString();
    const numberToInsertAsString = numberToInsert.toString();
    return (sizeOfTheNumberAsString + numberToInsertAsString).slice(
      -sizeOfTheNumberAsString.length,
    );
  }

  /**
   * Generate token based on parameter given
   * @param max Maximum value of the token
   * @param numberWanted Number wanted in the token like if its 4 => 5 will be filled with "0" like 0005
   * @returns The generated token
   */
  public tokenGenerator(max = 9999, numberWanted = 4): string {
    const tokenAsNumber = crypto.randomInt(max);
    return TokenService.padNumber(numberWanted, tokenAsNumber);
  }

  /**
   * Generate and store in cache manager the user token
   * @param userId ID of the user who want a token
   */
  async generateNewPasswordVerificationToken(userId: string): Promise<string> {
    const token = this.tokenGenerator();
    await this.cacheManager.set(userId, token);
    return token;
  }

  /**
   * Verify that the token stored and the token received by the user is the same
   * @param userId ID of the user
   * @param token Token provided by the user
   * @returns true if token is the one stored false otherwise
   */
  async verifyPasswordTokenIsValid(
    userId: string,
    token: string,
  ): Promise<boolean> {
    return (await this.cacheManager.get(userId)) === token;
  }
}
