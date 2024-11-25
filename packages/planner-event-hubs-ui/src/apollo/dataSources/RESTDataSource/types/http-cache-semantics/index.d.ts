// RED
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'http-cache-semantics' {
  interface Request {
    url: string;
    method: string;
    headers: Headers;
  }

  interface Response {
    status: number;
    headers: Headers;
  }

  type Headers = { [name: string]: string };

  class CachePolicy {
    constructor(request: Request, response: Response);

    public storable(): boolean;

    public satisfiesWithoutRevalidation(request: Request): boolean;

    public responseHeaders(): Headers;

    public age(): number;

    public timeToLive(): number;

    public revalidationHeaders(request: Request): Headers;

    public revalidatedPolicy(request: Request, response: Response): { policy: CachePolicy; modified: boolean };

    public static fromObject(object: object): CachePolicy;

    public toObject(): object;

    _url: string | undefined;

    _status: number;

    _rescc: { [key: string]: any };
  }

  export = CachePolicy;
}
