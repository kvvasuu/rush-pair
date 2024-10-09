import session from "express-session";

const sessionMiddleware = session({
  secret: "super-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
});

export default sessionMiddleware;
