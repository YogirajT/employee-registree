import "reflect-metadata"
import dotEnv from "dotenv";
dotEnv.config();
import Config from "@employee-registree/config";
import RestServer from "./presentation";
const server = new RestServer(Config.PORT).start();

export default server;