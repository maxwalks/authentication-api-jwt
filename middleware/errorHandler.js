const User = require('../server/models/user')

async function errorHandler(error, req, res, next) {
  const user = User.find();
  if (error.code === 11000) {
    res.status(400).json({ error: "Username already exists" })
  } else if (error.name === "ValidationError") {
    res.status(400).json({ error: "Minimum password length is 4 characters" })
  } else if (error.message === "Incorrect password.") {
    res.status(400).json({ error: error.message })
  } else if (error.message === "User not found.") {
    res.status(400).json({ error: error.message })
  } else if (
    error.message == "Cannot read properties of null (reading 'username')"
  ) {
    res.redirect("/login");
  } else {
    console.error(error.stack);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

module.exports = errorHandler;