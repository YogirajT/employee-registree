import { Server } from "http";

export interface IRestServer {
  start(): Promise<void>;
  getServer(): Server;
}

export type RestMethods = "get" | "post" | "put" | "delete";