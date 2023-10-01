var seacrhBtn = document.querySelector('#search-btn');
var searchBar = document.querySelector('#search-bar');
var team;
var gameArea = document.querySelector('#game-area');
var americanFootballTeamName;
var oddsTeam;
var teamOne = document.querySelector('#team-1');
var teamTwo = document.querySelector('#team-2');
var teamOneOddsEl = document.querySelector('#odds-for-team-1');
var teamTwoOddsEl = document.querySelector('#odds-for-team-2');
var gameId;
var teamOneScoreEl = document.querySelector('#team-1-score')
var teamTwoScoreEl = document.querySelector('#team-2-score')

function oddsGetter(teamName) {
  // First API for odds
  var options = { method: "GET", headers: { "User-Agent": "insomnia/8.1.0" } };

  fetch(
    "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=2e7e1a581a683ba3a7d10cb86a9f4105&regions=us&markets=spreads",
    options
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      for (let i = 0; i < data.length; i++) {
        if (teamName === data[i].home_team || teamName === data[i].away_team) {
          teamOne.textContent = data[i].bookmakers[1].markets[0].outcomes[0].name;
          teamTwo.textContent = data[i].bookmakers[1].markets[0].outcomes[1].name;
          teamOneOddsEl.textContent = data[i].bookmakers[1].markets[0].outcomes[0].point;
          teamTwoOddsEl.textContent = data[i].bookmakers[1].markets[0].outcomes[1].point;
          gameId = data[i].id
          scoreGetter(gameId)
        }

      }


    })
    .catch(function (error) {
      console.log(error);
    })
}


//   Second API for Team Names that takes that and applies it to the odds api to get the spread
function teamchooser() {
  var americanFootballURL =
    "https://americanfootballapi.p.rapidapi.com/api/american-football/search/" + team;
  var americanFootballKey = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": 'a0dde1fd88msh2d8fc60c3306a98p1b89c0jsnbcdd1afa2b5e',
      "X-RapidAPI-Host": "americanfootballapi.p.rapidapi.com",
    },
  };

  fetch(americanFootballURL, americanFootballKey)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      americanFootballTeamName = data.results[0].entity.name
      oddsGetter(americanFootballTeamName);

    })
    .catch(function (error) {
      console.log(error);
    });
}






// this should get live games scores using the game id given from the odds api call at the top
function scoreGetter(gameId) {
  var options = { method: "GET", headers: { "User-Agent": "insomnia/8.1.0" } };

  fetch(
    "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/scores/?daysFrom=1&apiKey=2e7e1a581a683ba3a7d10cb86a9f4105",
    options
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      for (i = 0; i < data.length; i++) {

        if (gameId === data[i].id) {
          if (data[i].completed) {
            return
          }
          displayLiveScores(data[i].scores[0].score, data[i].scores[1].score)
          console.log(data[i].scores[0].score)
          console.log(data[i].scores[1].score)
        }
      }

    })
    .catch(function (error) {
      console.log(error);
    })
}

// this will print the live scores on the page
function displayLiveScores(teamOneScore, teamTwoScore) {
teamOneScoreEl.textContent = teamOneScore;
teamTwoScoreEl.textContent = teamTwoScore;
}

seacrhBtn.addEventListener('click', function (event) {
  event.preventDefault();
  team = searchBar.value;
  teamchooser();

})

