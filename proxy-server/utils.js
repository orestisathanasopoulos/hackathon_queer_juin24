function acceptHost(req, res, next) {
  console.log({
    "req.hostname": req.hostname,
    "process.env.FORM_URL": process.env.FORM_URL,
  });
  if (req.hostname && req.hostname !== process.env.FORM_URL) {
    res.writeHead(404, {
      "Content-Type": "text/plain",
    });
    res.end("Not found");
  } else {
    next();
  }
}

module.exports = {
  acceptHost,
};
