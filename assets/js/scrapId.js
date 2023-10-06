const urls = [];
const teams = [
    "Arizona Cardinals",
    "Atlanta Falcons",
    "Baltimore Ravens",
    "Buffalo Bills",
    "Carolina Panthers",
    "Chicago Bears",
    "Cincinnati Bengals",
    "Cleveland Browns",
    "Dallas Cowboys",
    "Denver Broncos",
    "Detroit Lions",
    "Green Bay Packers",
    "Houston Texans",
    "Indianapolis Colts",
    "Jacksonville Jaguars",
    "Kansas City Chiefs",
    "Las Vegas Raiders",
    "Los Angeles Chargers",
    "Los Angeles Rams",
    "Miami Dolphins",
    "Minnesota Vikings",
    "New England Patriots",
    "New Orleans Saints",
    "New York Giants",
    "New York Jets",
    "Philadelphia Eagles",
    "Pittsburgh Steelers",
    "San Francisco 49ers",
    "Seattle Seahawks",
    "Tampa Bay Buccaneers",
    "Tennessee Titans",
    "Washington Commanders",
]

var teamIdObject = {
    "Arizona Cardinals": 4412,
    "Atlanta Falcons": 4393,
    "Baltimore Ravens": 4413,
    "Buffalo Bills": 4414,
    "Carolina Panthers": 4415,
    "Chicago Bears": 4391,
    "Cincinnati Bengals": 4416,
    "Cleveland Browns": 4417,
    "Dallas Cowboys": 4392,
    "Denver Broncos": 4418,
    "Detroit Lions": 4419,
    "Green Bay Packers": 4420,
    "Houston Texans": 4324,
    "Indianapolis Colts": 4421,
    "Jacksonville Jaguars": 4386,
    "Kansas City Chiefs": 4422,
    "Las Vegas Raiders": 4390,
    "Los Angeles Chargers": 4429,
    "Los Angeles Rams": 4387,
    "Miami Dolphins": 4287,
    "Minnesota Vikings": 4423,
    "New England Patriots": 4424,
    "New Orleans Saints": 4425,
    "New York Giants": 4426,
    "New York Jets": 4427,
    "Philadelphia Eagles": 4428,
    "Pittsburgh Steelers": 4345,
    "San Francisco 49ers": 4389,
    "Seattle Seahawks": 4430,
    "Tampa Bay Buccaneers": 4388,
    "Tennessee Titans": 4431,
    "Washington Commanders": 4432
  }

var americanFootballKey = {
    method: "GET",
    headers: {
        "X-RapidAPI-Key": 'a0dde1fd88msh2d8fc60c3306a98p1b89c0jsnbcdd1afa2b5e',
        "X-RapidAPI-Host": "americanfootballapi.p.rapidapi.com",
    },
};


for (var team in teamIdObject) {
    urls.push((`https://americanfootballapi.p.rapidapi.com/api/american-football/team/${teamIdObject[team]}/image`))
}


// An array to store the Promises for each fetch request
const fetchPromises = [];

// Function to perform a fetch request and return a Promise
function fetchData(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok for ${url}`);
            }
            return response.json();
        });
}

// Create a Promise for each fetch request and store them in the fetchPromises array
for (const url of urls) {
    const promise = fetchData(url);
    fetchPromises.push(promise);
}

// Use Promise.all to wait for all fetch requests to complete
Promise.all(fetchPromises)
    .then(dataArray => {
        // dataArray contains the resolved data from all fetch requests
        console.log('Data from all requests:', dataArray);
    })
    .catch(error => {
        console.error('Error:', error);
    });