// Input forms 

let teamNumber = document.getElementById('teamNumber');
let yearOfComp = document.getElementById('year');
let eventName = document.getElementById('eventName');

// Placeholders

let teamNum = document.getElementById('teamNum');
let currentRank = document.getElementById('rank');
let wins = document.getElementById('wins');
let ties = document.getElementById('ties');
let losses = document.getElementById('losses');
let epa = document.getElementById('epa');
let autoPoints = document.getElementById('autoPoints');
let telePoints = document.getElementById('telePoints');
let endgamePoints = document.getElementById('endgamePoints');






document.addEventListener("DOMContentLoaded", function () {
    resizeRightHand();
    window.addEventListener("resize", resizeRightHand);

    function resizeRightHand() {
        var leftHandHeight = document.querySelector(".leftHand").offsetHeight;
        document.querySelector(".rightHand").style.height = leftHandHeight + "px";
    }
});

document.getElementById('reloadApp').addEventListener('click', function () {
    getTeamData(teamNumber.value, yearOfComp.value, eventName.value);

})

function getTeamData(teamNumber, yearNumber, eventName) {
    const apiKey = ' ZYBxNxrdFx8PfRxwTj5awXIFyWCsR9Rz1xkunI9KiPq7GDn4g5bU25KKGKyeqQTO ';
    const apiUrl = 'https://www.thebluealliance.com/api/v3/team/frc' + teamNumber + '/event/' + yearNumber + eventName + '/status';

    const requestOptions = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'X-TBA-Auth-Key': `${apiKey}`,
        },
    };

    fetch(apiUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response reported as not ok!!!');
            }
            return response.json();
        })
        .then(data => {
            setBlueAlliance(data);
        })
        .catch(error => {
            console.error('Fetching Error:', error);
        });

    fetch("https://api.statbotics.io/v3/team_event/" + teamNumber + "/" + yearNumber + eventName + "")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response reported as not ok!!!');
            }
            return response.json();
        })
        .then(data => {
            setStatbotics(data);
        })
        .catch(error => {
            console.error('Fetching Error:', error);
        });


}


function setBlueAlliance(data) {
    teamNum.innerHTML = teamNumber.value;
    currentRank.innerHTML = data.qual.ranking.rank;
    wins.innerHTML = data.qual.ranking.record.wins;
    ties.innerHTML = data.qual.ranking.record.ties;
    losses.innerHTML = data.qual.ranking.record.losses;
}

function setStatbotics(data) {
    epa.value = data.epa.breakdown.total_points.mean;
    autoPoints.value = data.epa.breakdown.auto_points.mean;
    telePoints.value = data.epa.breakdown.teleop_points.mean;
    endgamePoints.value = data.epa.breakdown.endgame_points.mean;
}

document.getElementById('modeSwitcher').addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'light')
    }
    else {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
    }
})
