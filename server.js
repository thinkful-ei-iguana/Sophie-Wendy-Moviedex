/* eslint-disable quotes */
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const MOVIEDEX = require("./movies.js");
const app = express();

app.use(morgan("dev"));

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_BEARER_TOKEN;
  const authToken = req.get("Authorization");

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "DENIED!" });
  }
  next();
});

const validTypes = ["Animation", "Drama"];

app.get("/movie", function handleGenreTypes(req, res) {
  let response = MOVIEDEX[0].genre;
  res.json(response);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
