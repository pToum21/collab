// First API for odds
var options = { method: "GET", headers: { "User-Agent": "insomnia/8.1.0" } };

fetch(
  "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=2e7e1a581a683ba3a7d10cb86a9f4105&regions=us",
  options
)
  .then((response) => response.json())
  .then((response) => console.log(response))
  .catch((err) => console.error(err));
//   Second API for games
var americanFootBallURL =
  "https://americanfootballapi.p.rapidapi.com/api/american-football/search/eagles";
var americanFootBallKey = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "f1a959becamsh9744d6f06f72784p14c8cajsn1767b0e8978d",
    "X-RapidAPI-Host": "americanfootballapi.p.rapidapi.com",
  },
};

fetch(americanFootBallURL, americanFootBallKey)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  });
