const express = require("express");
const routes = require("./routes");
const { makeConnectionToMongo } = require("./database");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const { errorConverter, errorHandler } = require("./middleware/error");
const MongoDBStore = require("connect-mongodb-session")(expressSession);
const helmet = require("helmet");

require("dotenv").config();

const config = {
  MONGO_URL: process.env.MONGO_URL,
};

const app = express();

app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const sessionStore = new MongoDBStore({
  uri: config.MONGO_URL,
  collection: "sessions",
});

app.use(
  expressSession({
    secret: "secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
  })
);

app.use("/api", routes);
app.use("/uploaded", express.static("uploaded"));

app.use(errorConverter);
app.use(errorHandler);

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({ error: err.message });
// });

app.listen(3400, async () => {
  console.log("server on!");
  await makeConnectionToMongo({ url: config.MONGO_URL });
});

module.exports = app;
