const express = require("express");
const dotenv = require("dotenv");
const { sendToDiscord } = require("./webhook.js");
const { acceptHost } = require("./utils.js");
const cors = require("cors");

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(acceptHost);

app.post("/discord-proxy", sendToDiscord);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
