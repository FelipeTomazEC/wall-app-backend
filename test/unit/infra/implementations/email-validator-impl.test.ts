import { EmailValidatorImpl } from "@infra/implementations/email-validator-impl";
import { getNullAsType, getUndefinedAsType } from "@test/test-utils/get-nullable-as-type";

describe('Email validator implementation tests', () => {
  const sut = new EmailValidatorImpl();

  it('should not be null/undefined.', () => {
    const nullEmail = getNullAsType<string>();
    const undefinedEmail = getUndefinedAsType<string>();
    expect(sut.isValid(nullEmail)).toBeFalsy();
    expect(sut.isValid(undefinedEmail)).toBeFalsy();
  });

  it('should validate the occurrence of @ character.', () => {
    const email = 'example.email.com';
    expect(sut.isValid(email)).toBeFalsy();
  });

  it('should validate if the email has only one @ character.', () => {
    const email = 'ex@mple@email.com';
    expect(sut.isValid(email)).toBeFalsy();
  });

  it('should validate if the special characters in the local-part are outside quotation marks', () => {
    const email = 'a"b(c)d,e:f;g<h>i[j\\k]l@example.com';
    expect(sut.isValid(email)).toBeFalsy();
  });

  it('should validate if the quoted strings are dot separated or the only element making up the local-part', () => {
    const email = 'just"not"right@example.com';
    expect(sut.isValid(email)).toBeFalsy();
  });

  it('should validate the Local part length', () => {
    const email =
      '1234567890123456789012345678901234567890123456789012345678901234+x@example.com';
      expect(sut.isValid(email)).toBeFalsy();
  });

  it('should validate if the email does not have unquoted double dot', () => {
    const email = 'john..dot@example.com';
    expect(sut.isValid(email)).toBeFalsy();
  });

  it('should return true for valid email.', () => {
    const email = 'user@email.com';
    expect(sut.isValid(email)).toBeTruthy();
  });
})