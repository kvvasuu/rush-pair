import { createServer } from "http";
import app from "./app.js";
import { initSocketIO } from "./sockets/socketManager.js";

export const CLIENT_URL = process.env.CLIENT_URL;

const server = createServer(app);

initSocketIO(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
