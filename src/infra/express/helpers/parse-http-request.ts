import { HttpRequest } from '@interface-adapters/shared/http-request';
import {
  HeaderCollection,
  ParamCollection,
} from '@interface-adapters/shared/types';
import { Request } from 'express';

export const parseToHttpRequest = (expressRequest: Request): HttpRequest => {
  const headers: HeaderCollection = Object.entries(expressRequest.headers).map(
    ([prop, value]) => ({ name: prop, value: value ?? '' }),
  );

  const params: ParamCollection = Object.entries(expressRequest.params).map(
    ([prop, value = '']) => ({ name: prop, value }),
  );

  const query: ParamCollection = Object.entries(expressRequest.query).map(
    ([prop, value]) => ({
      name: prop,
      value: typeof value === 'string' ? value : '',
    }),
  );

  return new HttpRequest({
    body: expressRequest.body,
    headers,
    params,
    query,
  });
};
