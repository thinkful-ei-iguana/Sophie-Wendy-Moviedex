/* eslint-disable quotes */
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const MOVIEDEX = require("./movies.js");
const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_BEARER_TOKEN;
  const authToken = req.get("Authorization");

  if (!authToken || authToken !== apiToken) {
    return res.status(401).json({ error: "DENIED!" });
  }
  next();
});

app.get("/movie", (req, res) => {
  const { genre, country, avg_vote } = req.query;
  let results = MOVIEDEX;
  //validation
  if (genre) {
    let arryGenres = MOVIEDEX.filter(movie => {
      return movie.genre
    })
    
    if(!arryGenres.includes(genre)){
        return res.status(400).send('Genre is not listed');
    }
  }

  if (country) {
    let arryCountry = MOVIEDEX.filter(movie => {
      movie.country === country
    })
    
    if(arryCountry === []){
        return res.status(400).send('Country is not listed');
    }
  }

if (avg_vote) { 
    if (!Number(avg_vote) > 0 ) {
      return res.status(400).send('Need a number higher than 0');
    }
  }


//sorting logic
if (genre) {
  results = MOVIEDEX.filter(movie => { return movie.genre.toLowerCase().includes(genre) });
}

if (country) {
  results = MOVIEDEX.filter(movie => { return movie.country.toLowerCase().includes(country) });
}

if (avg_vote) {
  results = MOVIEDEX.filter(movie => {
    return Number(movie.avg_vote) >= Number(avg_vote);
  });
}

res.json(results);
});

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000

app.listen(PORT);
