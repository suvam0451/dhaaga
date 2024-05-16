export class RestClient {
  /**
   *
   */
  url: string;
  accessToken: string;
  domain: string

  constructor(url: string,
      {
        accessToken,
        domain
      }: {
        domain: string
        accessToken?: string
      }
  ) {
    this.url = url;
    this.accessToken = accessToken;
    this.domain = domain;
  }
}
