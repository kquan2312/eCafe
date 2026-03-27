const logger = (req, res, next) => {
  const start = new Date();

  // Khi response finish, log status code
  res.on("finish", () => {
    const time = new Date().toISOString();
    console.log(`\n[${time}] ${req.method} ${req.originalUrl} -> ${res.statusCode}`);

    if (Object.keys(req.params).length) {
      console.log("  Params:", req.params);
    }
    if (Object.keys(req.query).length) {
      console.log("  Query:", req.query);
    }
    if (req.body && Object.keys(req.body).length) {
      console.log("  Body:", req.body);
    }
  });

  next();
};

module.exports = logger;