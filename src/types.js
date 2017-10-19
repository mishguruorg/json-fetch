// @flow
// type BaseOptions extends RequestOptions ... :(
// TODO: https://github.com/facebook/flow/issues/396
// https://github.com/facebook/flow/blob/6845995f50fe524e8a66119955662c61e8fe8f35/lib/bom.js#L854
export type JsonFetchOptions = {
  body?: any,
  cache?: CacheType,
  credentials?: CredentialsType,
  headers?: HeadersInit,
  integrity?: string,
  method?: string,
  mode?: ModeType,
  redirect?: RedirectType,
  referrer?: string,
  referrerPolicy?: ReferrerPolicyType,
  shouldRetry?: (responseOrError: Response | Error) => boolean,
  retry?: Object,
  expectedStatuses?: Array<number>,
  keepalive?: boolean,
  window?: any
}

export type JsonFetchResponse = {
  status: number,
  statusText: string,
  headers: Headers,
  text: string,
  body: any,
}
