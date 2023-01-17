import mongoose, { Connection } from "mongoose";
import { Logger } from "../common/logging";

export interface ConnectionOptions {
  url: string;
}

export default class MongoDB {
  private _dbConnection!: Connection;

  constructor(
    private readonly _mongoOptions: ConnectionOptions,
    private readonly _logging: Logger
  ) {}

  connect(): void {
    const connection = mongoose.createConnection(
      this._mongoOptions.url
    );

    this._dbConnection = connection;

    connection.on("connected", () => {
      
      this._logging.info("Connected to mongodb");
    });

    connection.on("disconnected", () => {
      this._logging.info("Connection to database droppped");
    });

    connection.on("error", (error) => {
      this._logging.error("Error connecting to database");
    });
  }

  get connection(): Connection {
    return this._dbConnection;
  }

  close(): void {
    this._dbConnection.close();
  }
}
