import { isStrongPassword } from './password-validator';

describe('Password validator tests', () => {
  it('should refuse password shorter than 8 character', () => {
    expect(isStrongPassword('1234567')).toBeFalsy();
  });

  it('should refuse password without upper case letter', () => {
    expect(isStrongPassword('aaaaaaaa')).toBeFalsy();
  });

  it('should refuse password without digits', () => {
    expect(isStrongPassword('AAAAAAaa')).toBeFalsy();
  });

  it('should refuse password without special character', () => {
    expect(isStrongPassword('A123456a')).toBeFalsy();
  });

  it('should be a good password', () => {
    expect(isStrongPassword('OuiJeva!?4')).toBeTruthy();
  });
});
