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
var teamOneScoreEl = document.querySelector('#team-1-score');
var teamTwoScoreEl = document.querySelector('#team-2-score');

function oddsGetter(teamName) {
  // First API for odds
  var options = { method: "GET", headers: { "User-Agent": "insomnia/8.1.0" } };

  fetch(
    "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=8d36a44d1a3552c2209cde20773d248c&regions=us&markets=spreads",
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
          gameId = data[i].id;
          scoreGetter(gameId);
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
      "X-RapidAPI-Key": '746925a469msh98c5942603eb21ap1763ecjsn8eaf237b1f64', // 'c28b242162msh72fe679ab59a566p12e963jsn2758a52b2a1d'(Adrian's key)
      "X-RapidAPI-Host": "americanfootballapi.p.rapidapi.com",
    },
  };

  fetch(americanFootballURL, americanFootballKey)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      americanFootballTeamName = data.results[0].entity.name;
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
    "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/scores/?daysFrom=1&apiKey=8d36a44d1a3552c2209cde20773d248c",
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
          displayLiveScores(data[i].scores[1].score, data[i].scores[0].score);
          console.log(data[i].scores[0].score);
          console.log(data[i].scores[1].score);
        }
      }

    })
    .catch(function (error) {
      console.log(error);
    })
}

// this will print the live scores on the page
function displayLiveScores(teamOneScore, teamTwoScore) {
  teamOneScoreEl.setAttribute('class', 'score-line');
  teamOneScoreEl.textContent = teamOneScore;
  teamTwoScoreEl.setAttribute('class', 'score-line');
  teamTwoScoreEl.textContent = teamTwoScore;

  console.log(teamOneScore);
}

seacrhBtn.addEventListener('click', function (event) {
  event.preventDefault();
  team = searchBar.value;
  teamchooser();

})

