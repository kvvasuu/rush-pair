import { createServer } from "http";
import app from "./app.js";
import ActiveUser from "./models/ActiveUser.js";
import { initSocketIO } from "./sockets/socketManager.js";

export const CLIENT_URL = process.env.CLIENT_URL;

const server = createServer(app);

initSocketIO(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  try {
    await ActiveUser.deleteMany({});
  } catch (error) {
    console.log(error);
  }
  console.log(`Server running on port ${PORT}`);
});
