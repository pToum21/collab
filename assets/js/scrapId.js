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

var americanFootballKey = {
    method: "GET",
    headers: {
        "X-RapidAPI-Key": 'a0dde1fd88msh2d8fc60c3306a98p1b89c0jsnbcdd1afa2b5e',
        "X-RapidAPI-Host": "americanfootballapi.p.rapidapi.com",
    },
};


for (let i = 0; i < teams.length; i++) {
    urls.push((`https://americanfootballapi.p.rapidapi.com/api/american-football/search/${teams[i]}`))
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