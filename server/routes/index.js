const path = require("path");

module.exports = function (app) {
  const API_ENDPOINT = "/api";
  const API_VERSION = "v1";
  app.use(
    `${API_ENDPOINT}/${API_VERSION}/bookings`,
    require("./bookings.routes"),
  );

  app.get("*", (req, res) => {
    if (req.xhr) {
      return res.sendStatus(404);
    }
    if (process.env.NODE_ENV === "production") {
      res.sendFile(path.join(__dirname, "../../client/", "build/index.html"));
      console.log("production");
    }
  });
  app.get("", (req, res) => {
    res.redirect();
  });
  app.all("*", (req, res) => {
    res.sendStatus(404);
  });
};
