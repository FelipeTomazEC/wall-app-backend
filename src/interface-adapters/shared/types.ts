export type HeaderValue = string | string[] | number;
export type ParamValue = string | number;
export type HeaderCollection = Header[];
export type ParamCollection = Param[];

type Header = {
  name: string;
  value: HeaderValue;
}

type Param = {
  name: string;
  value: ParamValue;
}

export type RequestBody = {
  readonly [index: string]: any;
}

export type SuccessResponseBody<T> = {
  readonly [K in keyof T]: T[K]; 
}

export type ErrorResponseBody = {
  error: {
    message: string;
  };
}

export type ResponseBody<T> = SuccessResponseBody<T> | ErrorResponseBody;