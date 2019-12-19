/**
 * http headers, customer headers used in project should be declared here.
 */
export enum HTTP_HEADERS {
  NO_LOADING = 'NO_LOADING',
}

/**
 * response from server
 */
export interface IResponse<T = any> {
  code?: number;
  message?: string;
  result?: T;
}
