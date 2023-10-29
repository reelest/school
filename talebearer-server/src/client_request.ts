import { EventEmitter } from "events";
import {
  type IncomingMessage as IIncomingMessage,
  type IncomingHttpHeaders,
  type IncomingMessage,
  type OutgoingHttpHeaders,
} from "http";
import { Socket } from "net";
import { Readable } from "stream";
class ClientRequest extends EventEmitter implements IIncomingMessage {
  private _req: Request;
  constructor(req: Request) {
    super();
    const url = new URL(req.url);
    this._req = req;
    this.method = req.method;
    this.socket = null as any;
    this.connection = null as any;
    this.destroyed = false;
    this.closed = false;
    this.errored = null;
  }
  get aborted() {
    return this._req.signal.aborted;
  }
  httpVersion = "HTTP/2";
  httpVersionMajor = 2;
  httpVersionMinor: 0;
  complete: boolean;
  connection: Socket;
  socket: Socket;
  headers: IncomingHttpHeaders;
  headersDistinct: NodeJS.Dict<string[]>;
  rawHeaders: string[];
  trailers: NodeJS.Dict<string>;
  trailersDistinct: NodeJS.Dict<string[]>;
  rawTrailers: string[];
  setTimeout(msecs: number, callback?: (() => void) | undefined): this {
    throw new Error("Method not implemented.");
  }
  method?: string | undefined;
  url?: string | undefined;
  statusCode?: number | undefined;
  statusMessage?: string | undefined;
  destroy(error?: Error | undefined): this {
    throw new Error("Method not implemented.");
  }
  readableAborted: boolean;
  readable: boolean;
  readableDidRead: boolean;
  readableEncoding: BufferEncoding | null;
  readableEnded: boolean;
  readableFlowing: boolean | null;
  readableHighWaterMark: number;
  readableLength: number;
  readableObjectMode: boolean;
  destroyed: boolean;
  closed: boolean;
  errored: Error | null;
  _construct?(callback: (error?: Error | null | undefined) => void): void {
    throw new Error("Method not implemented.");
  }
  _read(size: number): void {
    throw new Error("Method not implemented.");
  }
  read(size?: number | undefined) {
    throw new Error("Method not implemented.");
  }
  setEncoding(encoding: BufferEncoding): this {
    throw new Error("Method not implemented.");
  }
  pause(): this {
    throw new Error("Method not implemented.");
  }
  resume(): this {
    throw new Error("Method not implemented.");
  }
  isPaused(): boolean {
    throw new Error("Method not implemented.");
  }
  unpipe(destination?: NodeJS.WritableStream | undefined): this {
    throw new Error("Method not implemented.");
  }
  unshift(chunk: any, encoding?: BufferEncoding | undefined): void {
    throw new Error("Method not implemented.");
  }
  wrap(stream: NodeJS.ReadableStream): this {
    throw new Error("Method not implemented.");
  }
  push(chunk: any, encoding?: BufferEncoding | undefined): boolean {
    throw new Error("Method not implemented.");
  }
  iterator(
    options?: { destroyOnReturn?: boolean | undefined } | undefined
  ): AsyncIterableIterator<any> {
    throw new Error("Method not implemented.");
  }
  map(
    fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => any,
    options?: ArrayOptions | undefined
  ): Readable {
    throw new Error("Method not implemented.");
  }
  filter(
    fn: (
      data: any,
      options?: Pick<ArrayOptions, "signal"> | undefined
    ) => boolean | Promise<boolean>,
    options?: ArrayOptions | undefined
  ): Readable {
    throw new Error("Method not implemented.");
  }
  forEach(
    fn: (
      data: any,
      options?: Pick<ArrayOptions, "signal"> | undefined
    ) => void | Promise<void>,
    options?: ArrayOptions | undefined
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  toArray(options?: Pick<ArrayOptions, "signal"> | undefined): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  some(
    fn: (
      data: any,
      options?: Pick<ArrayOptions, "signal"> | undefined
    ) => boolean | Promise<boolean>,
    options?: ArrayOptions | undefined
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  find<T>(
    fn: (
      data: any,
      options?: Pick<ArrayOptions, "signal"> | undefined
    ) => data is T,
    options?: ArrayOptions | undefined
  ): Promise<T | undefined>;
  find(
    fn: (
      data: any,
      options?: Pick<ArrayOptions, "signal"> | undefined
    ) => boolean | Promise<boolean>,
    options?: ArrayOptions | undefined
  ): Promise<any>;
  find(fn: unknown, options?: unknown): Promise<T | undefined> | Promise<any> {
    throw new Error("Method not implemented.");
  }
  every(
    fn: (
      data: any,
      options?: Pick<ArrayOptions, "signal"> | undefined
    ) => boolean | Promise<boolean>,
    options?: ArrayOptions | undefined
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  flatMap(
    fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => any,
    options?: ArrayOptions | undefined
  ): Readable {
    throw new Error("Method not implemented.");
  }
  drop(
    limit: number,
    options?: Pick<ArrayOptions, "signal"> | undefined
  ): Readable {
    throw new Error("Method not implemented.");
  }
  take(
    limit: number,
    options?: Pick<ArrayOptions, "signal"> | undefined
  ): Readable {
    throw new Error("Method not implemented.");
  }
  asIndexedPairs(options?: Pick<ArrayOptions, "signal"> | undefined): Readable {
    throw new Error("Method not implemented.");
  }
  reduce<T = any>(
    fn: (
      previous: any,
      data: any,
      options?: Pick<ArrayOptions, "signal"> | undefined
    ) => T,
    initial?: undefined,
    options?: Pick<ArrayOptions, "signal"> | undefined
  ): Promise<T>;
  reduce<T = any>(
    fn: (
      previous: T,
      data: any,
      options?: Pick<ArrayOptions, "signal"> | undefined
    ) => T,
    initial: T,
    options?: Pick<ArrayOptions, "signal"> | undefined
  ): Promise<T>;
  reduce(
    fn: unknown,
    initial?: unknown,
    options?: unknown
  ): Promise<T> | Promise<T> {
    throw new Error("Method not implemented.");
  }
  _destroy(
    error: Error | null,
    callback: (error?: Error | null | undefined) => void
  ): void {
    throw new Error("Method not implemented.");
  }
  [Symbol.asyncIterator](): AsyncIterableIterator<any> {
    throw new Error("Method not implemented.");
  }
  [Symbol.asyncDispose](): Promise<void> {
    throw new Error("Method not implemented.");
  }
  pipe<T extends NodeJS.WritableStream>(
    destination: T,
    options?: { end?: boolean | undefined } | undefined
  ): T {
    throw new Error("Method not implemented.");
  }
  compose<T extends NodeJS.ReadableStream>(
    stream: T | ((source: any) => void) | Iterable<T> | AsyncIterable<T>,
    options?: { signal: AbortSignal } | undefined
  ): T {
    throw new Error("Method not implemented.");
  }
}

class P {
  [x: string]: any;
  private _req: Request;
  constructor(req: Request) {
    super();
    this.host = req.headers.get("Host") as string;
    const url = new URL(req.url);
    this._req = req;
    this.protocol = url.protocol;
    this.method = req.method;
    this.path = url.pathname;
    this.req = null as any;
    this.socket = null as any;
    this.chunkedEncoding = false;
    this.useChunkedEncodingByDefault = false;
    this.sendDate = false;
    this.finished = true;
    this.headersSent = true;
    this.connection = null as any;
    this.writable = false;

    this.writableEnded = false;
    this.writableFinished = false;
    this.writableHighWaterMark = 1000000;
    this.writableLength = 1000000;
    this.writableObjectMode = false;
    this.writableCorked = 1000000;
    this.destroyed = false;
    this.closed = false;
    this.errored = null;
    this.writableNeedDrain = false;
  }
  aborted = false;
  host: string;
  protocol: string;
  reusedSocket = false;
  maxHeadersCount = 10000;
  method: string;
  path: string;

  get shouldKeepAlive() {
    return this._req.keepalive;
  }
  set shouldKeepAlive(val: boolean) {
    // this._req.keepalive = val;
  }
  abort(): void {
    this._req.signal?.dispatchEvent(new Event("abort"));
  }
  onSocket(socket: Socket): void {
    throw new Error("Method not implemented.");
  }
  setTimeout(timeout: number, callback?: (() => void) | undefined): this {
    throw new Error("Method not implemented.");
  }
  setNoDelay(noDelay?: boolean | undefined): void {
    throw new Error("Method not implemented.");
  }
  setSocketKeepAlive(
    enable?: boolean | undefined,
    initialDelay?: number | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  getRawHeaderNames(): string[] {
    throw new Error("Method not implemented.");
  }
  req: IncomingMessage;
  chunkedEncoding: boolean;
  useChunkedEncodingByDefault: boolean;
  sendDate: boolean;
  finished: boolean;
  headersSent: boolean;
  setHeader(name: string, value: string | number | readonly string[]): this {
    if (Array.isArray(value)) {
      this._req.headers.set(name, value[0] ?? "");
      for (let k of value.slice(1)) {
        this._req.headers.append(name, k);
      }
    } else this._req.headers.set(name, String(value));
    return this;
  }
  appendHeader(name: string, value: string | readonly string[]): this {
    if (Array.isArray(value)) {
      for (let k of value) {
        this._req.headers.append(name, k);
      }
    } else this._req.headers.set(name, String(value));
    return this;
  }
  getHeader(name: string): string | number | string[] | undefined {
    return this._req.headers.get(name) ?? undefined;
  }
  getHeaders(): OutgoingHttpHeaders {
    let m = {} as OutgoingHttpHeaders;
    for (let k of this._req.headers.entries()) {
      m[k[0]] = m[k[1]];
    }
    return m;
  }
  getHeaderNames(): string[] {
    return Array.of(...this._req.headers.keys());
  }
  hasHeader(name: string): boolean {
    return this._req.headers.has(name);
  }
  removeHeader(name: string): void {
    this._req.headers.delete(name);
  }
  addTrailers(
    headers: OutgoingHttpHeaders | readonly [string, string][]
  ): void {
    throw new Error("Method not implemented.");
  }
  flushHeaders(): void {
    // throw new Error("Method not implemented.");
  }
  writable: boolean;
  writableEnded: boolean;
  writableFinished: boolean;
  writableHighWaterMark: number;
  writableLength: number;
  writableObjectMode: boolean;
  writableCorked: number;
  destroyed: boolean;
  closed: boolean;
  errored: Error | null;
  writableNeedDrain: boolean;
  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null | undefined) => void
  ): void {
    throw new Error("Method not implemented.");
  }
  _writev?(
    chunks: { chunk: any; encoding: BufferEncoding }[],
    callback: (error?: Error | null | undefined) => void
  ): void {
    throw new Error("Method not implemented.");
  }
  _construct?(callback: (error?: Error | null | undefined) => void): void {
    throw new Error("Method not implemented.");
  }
  _destroy(
    error: Error | null,
    callback: (error?: Error | null | undefined) => void
  ): void {
    throw new Error("Method not implemented.");
  }
  _final(callback: (error?: Error | null | undefined) => void): void {
    throw new Error("Method not implemented.");
  }
  write(
    chunk: any,
    callback?: ((error: Error | null | undefined) => void) | undefined
  ): boolean;
  write(
    chunk: any,
    encoding: BufferEncoding,
    callback?: ((error: Error | null | undefined) => void) | undefined
  ): boolean;
  write(chunk: unknown, encoding?: unknown, callback?: unknown): boolean {
    throw new Error("Method not implemented.");
  }
  setDefaultEncoding(encoding: BufferEncoding): this {
    throw new Error("Method not implemented.");
  }
  end(cb?: (() => void) | undefined): this;
  end(chunk: any, cb?: (() => void) | undefined): this;
  end(
    chunk: any,
    encoding: BufferEncoding,
    cb?: (() => void) | undefined
  ): this;
  end(chunk?: unknown, encoding?: unknown, cb?: unknown): this {
    throw new Error("Method not implemented.");
  }
  cork(): void {
    throw new Error("Method not implemented.");
  }
  uncork(): void {
    throw new Error("Method not implemented.");
  }
  destroy(error?: Error | undefined): this {
    return this;
  }
  pipe<T extends NodeJS.WritableStream>(
    destination: T,
    options?: { end?: boolean | undefined } | undefined
  ): T {
    throw new Error("Method not implemented.");
  }
  compose<T extends NodeJS.ReadableStream>(
    stream: T | ((source: any) => void) | Iterable<T> | AsyncIterable<T>,
    options?: { signal: AbortSignal } | undefined
  ): T {
    throw new Error("Method not implemented.");
  }
}
