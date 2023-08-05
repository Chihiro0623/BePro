const isAuthenticated = (req, res, next) => {
  if (req.session.userid) next();
  else res.status(403).json({ message: "Not Logged In" });
}

module.exports = isAuthenticated;
