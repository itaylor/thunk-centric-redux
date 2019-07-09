export interface IoPromiseAction {
  type: string;
}

export interface IoPromiseSocket {
  emit(event: string, ...args: any[]): any;
}

export interface RequestResponseRecord {
  request: IoPromiseAction;
  response: IoPromiseAction;
}

export type RequestResponsePair = [IoPromiseAction, IoPromiseAction];

export type GetResponseRecord<RequestResponse extends RequestResponseRecord, Request extends RequestResponse['request']> =
  Extract<RequestResponse, { request: Request, response: any }>['response'];
export type GetResponsePair<RequestResponse extends RequestResponsePair, Request extends RequestResponse[0]> =
  Extract<RequestResponse, [Request, any]>[1];

export type IoPromiseRecord<RequestResponse extends RequestResponseRecord> = <Request extends RequestResponse['request']>(request: Request) => Promise<GetResponseRecord<RequestResponse, Request>>;
export type IoPromisePair<RequestResponse extends RequestResponsePair> = <Request extends RequestResponse[0]>(request: Request) => Promise<GetResponsePair<RequestResponse, Request>>; 

declare function createIoPromise<
  RequestResponse extends RequestResponseRecord,
>(socket: IoPromiseSocket, opts?: { eventName: string }): IoPromiseRecord<RequestResponse>;
declare function createIoPromise<
  RequestResponse extends RequestResponsePair,
>(socket: IoPromiseSocket, opts?: { eventName: string }): IoPromisePair<RequestResponse>;
declare function createIoPromise(socket: IoPromiseSocket, opts?: { eventName: string }): (request: IoPromiseAction) => Promise<IoPromiseAction>;

export default createIoPromise;
