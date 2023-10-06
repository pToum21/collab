var loader = document.getElementById('preloader')
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
    "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=5441ebc85af9ff350c2a234d7759e4ab&regions=us&markets=spreads",
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
      "X-RapidAPI-Key": '7aec5f8208msh3d0deca9d956c92p1b7cd4jsn11d0eeb56735',
      "X-RapidAPI-Host": "americanfootballapi.p.rapidapi.com",
    },
  };

  fetch(americanFootballURL, americanFootballKey)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);


      // console.log(data.results[0].entity.teamColors)

      var teamColors = data.results[0].entity.teamColors;
      console.log(teamColors)
      localStorage.setItem('teamColors', JSON.stringify(teamColors))



      updateStyles(teamColors);


      americanFootballTeamName = data.results[0].entity.name;
      console.log(americanFootballTeamName);

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
      'X-RapidAPI-Key': '7aec5f8208msh3d0deca9d956c92p1b7cd4jsn11d0eeb56735',
      'X-RapidAPI-Host': 'americanfootballapi.p.rapidapi.com'
    }
  };

  fetch(americanFootballLogoURL, americanFootballLogoKey)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

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
    "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/scores/?daysFrom=1&apiKey=5441ebc85af9ff350c2a234d7759e4ab",
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

// this will print the live scores on the page
function displayLiveScores(teamOneScore, teamTwoScore) {
  teamOneScoreEl.setAttribute('class', 'score-line');
  teamOneScoreEl.textContent = teamOneScore;
  teamTwoScoreEl.setAttribute('class', 'score-line');
  teamTwoScoreEl.textContent = teamTwoScore;

  console.log(teamOneScore);
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




seacrhBtn.addEventListener('click', function (event) {
  event.preventDefault();
  team = searchBar.value;
  teamchooser();

})

/* 
// Save teamIdObject in localStorage
  localStorage.setItem('teamIdObject', JSON.stringify(teamIdObject));
*/
