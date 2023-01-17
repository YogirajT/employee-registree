import { IRestServer } from "../types/common";
import app from "./bootstrap";
import { Server } from "http";

export default class RestServer implements IRestServer {
  private _restServer!: Server;

  constructor(private readonly _port: number) {}

  async start() {
    this._restServer = app.listen(this._port);
  }

  getServer(): Server {
    return this._restServer;
  }
}
