// all variables used in the global scope 
var loader = document.getElementById('preloader')
var searchBtn = document.querySelector('#search-btn');
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
var gameContainer = document.querySelector('#game-area');
var allButton = document.querySelector('#all-button');
var liveButton = document.querySelector('#live-button');
var schBtn = document.querySelector('#scheduled-button')


// below is used to get the local storage of the team colors last search
var teamColors = JSON.parse(localStorage.getItem('teamColors')) || null;
if (teamColors) {
  updateStyles(teamColors);
}

// this below is the preloader gif screen
window.onload = function () {
  const gifdiv = document.querySelector('.preloader')
  gifdiv.style.display = 'flex'
  setTimeout(() => {
    gifdiv.style.display = 'none'
    const content = document.getElementById('main-content')
    content.classList.remove('hidden')
  }, 1500)
}

// odds getter function takes the team name from the team chooser function and inputs the users search to return the next game be it live or upcoming and returns the odds for each team involved
function oddsGetter(teamName) {
  // First API for odds
  var options = { method: "GET" };

  fetch(
    "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=3de6282cf12b721ef0d7d365dc63f4b2&regions=us&markets=spreads",
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
          console.log(teamOne)
          teamTwo.textContent = data[i].bookmakers[1].markets[0].outcomes[1].name;
          teamOneOddsEl.textContent = data[i].bookmakers[1].markets[0].outcomes[0].point;
          teamTwoOddsEl.textContent = data[i].bookmakers[1].markets[0].outcomes[1].point;
          gameId = data[i].id;
          scoreGetter(gameId);
          break;
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    })
}

//   Second API for Team Names that takes that and applies it to the odds api to get the spread
// teamchooser function takes the user search and runs it thru the american football api which is then outputed into the odds getter function to return a game and its odds
function teamchooser() {
  var americanFootballURL =
    "https://americanfootballapi.p.rapidapi.com/api/american-football/search/" + team;
  var americanFootballKey = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": '7aec5f8208msh3d0deca9d956c92p1b7cd4jsn11d0eeb56735',
      "X-RapidAPI-Host": "americanfootballapi.p.rapidapi.com",
    },
  };

  fetch(americanFootballURL, americanFootballKey)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var teamColors = data.results[0].entity.teamColors;

      localStorage.setItem('teamColors', JSON.stringify(teamColors))



      updateStyles(teamColors);


      americanFootballTeamName = data.results[0].entity.name;


      oddsGetter(americanFootballTeamName);
    })
    .catch(function (error) {
      console.log(error);
    });
}

// update styles uses the team colors from the american football api and uses local storage to save those so next time the user opens the page the colors are the same as the the team they searched last
// uses style in javascript to read the team colors and change the colors on the website to match the team that was searched by the user
function updateStyles(teamColors) {
  document.querySelector('html').style = `background-color: ${teamColors.primary}; color: ${teamColors.text}`
  document.querySelector('nav').style = `background-color: ${teamColors.secondary}`
  document.querySelector('.navbar-item').style = `color: ${teamColors.text}`
  document.querySelector('#side-bar').style = `border: ${teamColors.secondary} 2px solid`

  document.querySelector('.top-btns').style = `color: ${teamColors.text}; background-color: ${teamColors.secondary}`
  document.querySelector('#game-area').style = `border: ${teamColors.secondary} 2px solid`
}

// this function is used to retreive the team logos of each team
function logoGetter() {
  var americanFootballLogoURL = 'https://americanfootballapi.p.rapidapi.com/api/american-football/team/4388/image';
  var americanFootballLogoKey = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '7aec5f8208msh3d0deca9d956c92p1b7cd4jsn11d0eeb56735',
      'X-RapidAPI-Host': 'americanfootballapi.p.rapidapi.com'
    }
  };

  fetch(americanFootballLogoURL, americanFootballLogoKey)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)

    })
    .catch(function (error) {
      console.log(error);
    });
}

// this function score getter return the score odds and current game if and only if it a live game otherwise this function returns
function scoreGetter(gameId) {
  var options = { method: "GET", headers: { "User-Agent": "insomnia/8.1.0" } };

  fetch(
    "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/scores/?daysFrom=1&apiKey=3de6282cf12b721ef0d7d365dc63f4b2",
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
          displayLiveScores(data[i].scores[0].score, data[i].scores[1].score);
          console.log(data[i].scores[0].score);
          console.log(data[i].scores[1].score);
        }
      }

    })
    .catch(function (error) {
      console.log(error);
    })
}

// this will print the live scores on the page from the score getter function if the game is live
function displayLiveScores(teamOneScore, teamTwoScore) {
  teamOneScoreEl.setAttribute('class', 'score-line');
  teamOneScoreEl.textContent = teamOneScore;
  teamTwoScoreEl.setAttribute('class', 'score-line');
  teamTwoScoreEl.textContent = teamTwoScore;


}

// function to update the content of the Glide Slider
// this function is used to make glide.js work it is shown in the nav bar at the top the website creating a carousel
function updateGameInSlider(gameDataArray) {
  var glideTrack = document.querySelector(".glide__track");
  var glideSlides = document.querySelector('.glide__slides');


  glideSlides.innerHTML = '';

  gameDataArray.forEach((gameData) => {
    var gameSlide = document.createElement('li');
    gameSlide.classList.add('glide__slide');
    gameSlide.innerHTML = `
    <div class="game">
      <h3>${gameData.title}</h3>
      <p>${gameData.teams}</p>
      <p>Score: ${gameData.score}</p>
      </div>
    `;
    glideSlides.appendChild(gameSlide);

    var glide = new Glide('.glide').mount();
  });
}
new Glide('.glide', {
  perView: 5,
  autoplay: true,
  animationDuration: 9000
}).mount();


// this event listener is for the all button and shows all games with odds weather it is live or upcoming
allButton.addEventListener('click', function (event) {
  event.preventDefault();

  gameContainer.innerHTML = '';

  fetch(
    "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=3de6282cf12b721ef0d7d365dc63f4b2&regions=us&markets=spreads"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {


      for (let i = 0; i < data.length; i++) {
        var gameDiv = document.createElement('div');
        gameDiv.classList.add('game');
        gameDiv.textContent = `${data[i].bookmakers[1].markets[0].outcomes[0].name} vs ${data[i].bookmakers[1].markets[0].outcomes[1].name}, Odds: ${data[i].bookmakers[1].markets[0].outcomes[0].point} - ${data[i].bookmakers[1].markets[0].outcomes[1].point}`;
        gameContainer.appendChild(gameDiv);
        scoreGetter(gameId);

      }
    })
    .catch(function (error) {
      console.log(error);
    })
})


// this event listener is for the live button and shows all games with score if it is live
liveButton.addEventListener('click', function (event) {
  event.preventDefault();

  gameContainer.innerHTML = '';

  var options = { method: "GET", headers: { "User-Agent": "insomnia/8.1.0" } };
  fetch(
    "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/scores/?daysFrom=1&apiKey=3de6282cf12b721ef0d7d365dc63f4b2",
    options
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].completed) {
          return;

        } else {
          var gameDiv = document.createElement('div');
          gameDiv.classList.add('game');
          gameDiv.textContent = `${data[i].away_team} vs ${data[i].home_team} - Score: ${data[i].away_score} - ${data[i].home_score}`;
          gameContainer.appendChild(gameDiv);
        }

      }

    })
    .catch(function (error) {
      console.log(error);
    })
})

// this event listener is for the scheduled button and shows all games that are upcoming along with the odds for them
schBtn.addEventListener('click', function (event) {
  event.preventDefault();

  gameContainer.innerHTML = '';

  fetch(
    "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=3de6282cf12b721ef0d7d365dc63f4b2&regions=us&markets=spreads"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {


      for (let i = 0; i < data.length; i++) {

        var gameDiv = document.createElement('div');
        gameDiv.classList.add('game');
        gameDiv.textContent = `${data[i].bookmakers[1].markets[0].outcomes[0].name} vs ${data[i].bookmakers[1].markets[0].outcomes[1].name}, Odds: ${data[i].bookmakers[1].markets[0].outcomes[0].point} - ${data[i].bookmakers[1].markets[0].outcomes[1].point}`;
        gameContainer.appendChild(gameDiv);
        scoreGetter(gameId);

      }
    })
    .catch(function (error) {
      console.log(error);
    })

})

// this event is for the search bar when a user searches team chooser is triggered
searchBtn.addEventListener('click', function (event) {
  event.preventDefault();
  team = searchBar.value;
  teamchooser();

})
