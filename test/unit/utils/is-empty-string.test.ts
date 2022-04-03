import { getNullAsType, getUndefinedAsType } from "@test/test-utils/get-nullable-as-type";
import { isEmptyString } from "@utils/is-empty-string";

describe('Is Empty String util function tests', () => {
  it('should return true for null', () => {
    expect(isEmptyString(getNullAsType<string>())).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isEmptyString(getUndefinedAsType<string>())).toBe(true);
  });

  it('should return true for only spaces string', () => {
    expect(isEmptyString('       ')).toBe(true);
  });

  it('should consider a string without characters an empty string.', () => {
    expect(isEmptyString("")).toBe(true);
  });

  it('should consider a string without characters an empty string.', () => {
    expect(isEmptyString('non-empty-string')).toBe(false);
  });
})