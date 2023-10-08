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


allButton.addEventListener('click', function (event) {
  event.preventDefault();

  // clear the game container
  gameContainer.innerHTML = '';

  fetch(
    "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=3615c03dc742b30f42c220931bb82a63&regions=us&markets=spreads"
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

var teamColors = JSON.parse(localStorage.getItem('teamColors')) || null;

if (teamColors) {
  updateStyles(teamColors);
}

window.onload = function () {
  const gifdiv = document.querySelector('.preloader')
  gifdiv.style.display = 'flex'
  setTimeout(() => {
    gifdiv.style.display = 'none'
    const content = document.getElementById('main-content')
    content.classList.remove('hidden')
  }, 4000)
}

function oddsGetter(teamName) {
  // First API for odds
  var options = { method: "GET" };

  fetch(
    "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=3615c03dc742b30f42c220931bb82a63&regions=us&markets=spreads",
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
function teamchooser() {
  var americanFootballURL =
    "https://americanfootballapi.p.rapidapi.com/api/american-football/search/" + team;
  var americanFootballKey = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": '746925a469msh98c5942603eb21ap1763ecjsn8eaf237b1f64',
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
function updateStyles(teamColors) {
  document.querySelector('body').style = `background-color: ${teamColors.primary}; color: ${teamColors.text}`
  document.querySelector('nav').style = `background-color: ${teamColors.secondary}`
  document.querySelector('.navbar-item').style = `color: ${teamColors.text}`
  document.querySelector('#side-bar').style = `border: ${teamColors.secondary} 2px solid`

  document.querySelector('.top-btns').style = `color: ${teamColors.text}; background-color: ${teamColors.secondary}`
  document.querySelector('#game-area').style = `border: ${teamColors.secondary} 2px solid`
}
function logoGetter() {
  var americanFootballLogoURL = 'https://americanfootballapi.p.rapidapi.com/api/american-football/team/4388/image';
  var americanFootballLogoKey = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '746925a469msh98c5942603eb21ap1763ecjsn8eaf237b1f64',
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

// this should get live games scores using the game id given from the odds api call at the top
// this function is causing the wrong games to return 
function scoreGetter(gameId) {
  var options = { method: "GET", headers: { "User-Agent": "insomnia/8.1.0" } };

  fetch(
    "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/scores/?daysFrom=1&apiKey=3615c03dc742b30f42c220931bb82a63",
    options
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

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

// this will print the live scores on the page
function displayLiveScores(teamOneScore, teamTwoScore) {
  teamOneScoreEl.setAttribute('class', 'score-line');
  teamOneScoreEl.textContent = teamOneScore;
  teamTwoScoreEl.setAttribute('class', 'score-line');
  teamTwoScoreEl.textContent = teamTwoScore;


}

// function to update the content of the Glide Slider
function updateGameInSlider(gameDataArray) {
  var glideTrack = document.querySelector(".glide__track");
  var glideSlides = document.querySelector('.glide__slides');

  // clear existing slides
  glideSlides.innerHTML = '';

  // loop through the game data and create a
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
    // update the the Glide.js slider after adding new slides
    var glide = new Glide('.glide').mount();
  });
}
// calling the function with the game data to update the slider
new Glide('.glide', {
  perView: 3,
  autoplay: true,
  animationDuration: 9000
}).mount();




searchBtn.addEventListener('click', function (event) {
  event.preventDefault();
  team = searchBar.value;
  teamchooser();

})
