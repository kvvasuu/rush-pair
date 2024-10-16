import { createServer } from "http";
import app from "./app.js";
import { initSocketIO } from "./sockets/socketManager.js";
import dotenv from "dotenv";

dotenv.config();

export const URL = process.env.CLIENT_URL;

const server = createServer(app);

initSocketIO(server);

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";
server.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
});
