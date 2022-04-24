import { parseToHttpRequest } from '@infra/express/helpers/parse-http-request';
import {
  getNullAsType,
  getUndefinedAsType,
} from '@test/test-utils/get-nullable-as-type';
import { Request } from 'express';

describe('Express http request parser tests', () => {
  it('should transform null/undefined headers into empty strings.', () => {
    const expressRequest: Partial<Request> = {
      headers: {
        header1: 'header-1-value',
        header2: getNullAsType<string>(),
        header3: getUndefinedAsType<string>(),
      },
      params: {},
      query: {},
    };

    const parsedRequest = parseToHttpRequest(expressRequest as Request);
    expect(parsedRequest.getHeader('header2')).toBe('');
    expect(parsedRequest.getHeader('header3')).toBe('');
    expect(parsedRequest.getHeader('header1')).toBe('header-1-value');
  });

  it('should transform null/undefined query params into empty strings.', () => {
    const expressRequest: Partial<Request> = {
      query: {
        param1: 'param-1-value',
        param2: getNullAsType<string>(),
        param3: getUndefinedAsType<string>(),
      },
      headers: {},
      params: {},
    };

    const parsedRequest = parseToHttpRequest(expressRequest as Request);
    expect(parsedRequest.getQueryParam('param2')).toBe('');
    expect(parsedRequest.getQueryParam('param3')).toBe('');
    expect(parsedRequest.getQueryParam('param1')).toBe('param-1-value');
  });

  it('should put the path params values into the http request.', () => {
    const expressRequest: Partial<Request> = {
      params: {
        param1: 'param-1-value',
      },
      headers: {},
      query: {},
    };

    const parsedRequest = parseToHttpRequest(expressRequest as Request);
    expect(parsedRequest.getParam('param1')).toBe('param-1-value');
  });

  it('should keep the body as it is.', () => {
    const expressRequest: Partial<Request> = {
      query: {},
      headers: {},
      params: {},
      body: {
        field1: 'field1',
        field2: 'field2',
      },
    };

    const parsedRequest = parseToHttpRequest(expressRequest as Request);
    expect(parsedRequest.body).toBe(expressRequest.body);
  });
});
