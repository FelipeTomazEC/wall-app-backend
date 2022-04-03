import { HttpStatusCode } from './http-status-code';
import { ResponseBody, HeaderCollection, HeaderValue } from './types';

interface Props<T> {
  body: ResponseBody<T>;
  statusCode: HttpStatusCode;
  headers?: HeaderCollection;
}

export class HttpResponse<T> {

  readonly headers: HeaderCollection;

  constructor(readonly props: Props<T>) {
    this.headers = props.headers ?? [];
  }

  get body(): ResponseBody<T> {
    return this.props.body;
  }

  get statusCode(): HttpStatusCode {
    return this.props.statusCode;
  }

  public getHeader(name: string): HeaderValue | undefined {
    return this.headers.find((h) => h.name === name)?.value;
  }
}