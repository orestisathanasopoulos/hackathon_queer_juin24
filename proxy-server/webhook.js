const axios = require("axios");

const discordWebhookConfig = {
  candidate: () => process.env.WEBHOOK_CANDIDATE,
  journalist: () => process.env.WEBHOOK_JOURNALIST,
  researcher: () => process.env.WEBHOOK_RESEARCHER,
};

function sendToDiscord(req, res) {
  const userType = req.body.userType;
  console.log({ userType });
  if (!Object.keys(discordWebhookConfig).includes(userType)) {
    res
      .status(400)
      .send(
        !!userType ? `Unexpected userType "${userType}"` : "Missing userType"
      );
    return;
  }
  const message = req.body.message;
  console.log({ message });
  if (!message) {
    res.status(400).send("Missing message");
    return;
  }

  const url = discordWebhookConfig[userType]();
  axios
    .post(url, message)
    .then((axiosRes) => {
      console.log({ axiosRes });
      res.send(axiosRes);
    })
    .catch((err) => {
      console.log({ err });
      res.send({ err });
    });
}

module.exports = {
  sendToDiscord,
};
