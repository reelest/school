import { EventEmitter } from "events";
interface ITransport extends EventTarget<{ message: Event & { data: any } }> {
  send(data: string): void;
}

/**
 * Represents both a server socket and a client socket from socket.io
 */
class Socket extends EventEmitter {
  ws: ITransport;
  cbs = new Map();
  _cb = 0;
  room: string | undefined;
  inRooms: string[] = [];
  id = Math.random() * Number.MAX_SAFE_INTEGER;
  constructor(ws: ITransport, room: string) {
    super();
    this.ws = ws;
    if (room) this.room = room;
    else
      this.ws.addEventListener("message", (e) => {
        this.onMessage(e.data);
      });
  }
  start() {
    this.emit("connection", this.id);
  }
  createCb(cb: Function) {
    this.cbs.set(this._cb, () => {
      this.cbs.delete(this._cb);
      cb();
    });
    return this._cb++;
  }
  on(eventName: string, handler: (args: any[]) => void) {
    super.on(eventName, handler);
    return this;
  }
  onMessage(message: any) {
    const data = JSON.parse(message) as JSONRPCMessage;
    if ("r" in data) {
      const cb = this.cbs.get(data.r);
      cb(...data.args, (...args: any[]) => {
        this._emit(data.c, args);
      });
    } else {
      if (data.e === "connection") {
        this.id = data.args[0];
        data.args[0] = this;
      }
      this.emit(data.e, ...data.args, (...args: any[]) => {
        this._emit(data.c, args);
      });
    }
  }
  _emit(eventName: string | number, args: any[]) {
    let cb: Function;
    if (typeof args[args.length - 1] === "function") {
      cb = args.pop();
    } else {
      cb = () => {};
    }
    if (!this.inRooms.includes(this.room as string)) return;
    this.ws.send(
      JSON.stringify({
        [typeof eventName === "number" ? "r" : "e"]: eventName,
        args,
        c: this.createCb(cb),
        rm: typeof eventName === "number" ? undefined : this.room,
      })
    );
    return true;
  }
  join(room: string) {
    this.inRooms.push(room);
  }
  emit(eventName: string, ...args: any[]) {
    this._emit(eventName, args);
    return true;
  }
  to(room: string) {
    return new Socket(this.ws, room);
  }
}

interface JSONRPCEvent {
  e: string;
  args: any[];
  c: number;
  rm: string | undefined;
}
interface JSONRPCReply {
  r: number;
  args: any[];
  c: number;
}

type JSONRPCMessage = JSONRPCReply | JSONRPCEvent;
