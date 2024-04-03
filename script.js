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


// previous Data

let previousRank = -1;
let previousWins = -1;
let previousTies = -1;
let previousLosses = -1;
let previousEpa = -1;
let previousAutoPoints = -1;
let previoustelePoints = -1;
let previousEndgamePoints = -1;

// Icons

let sameRankIcon = document.getElementById('sameRank');
let higherRankIcon = document.getElementById('higherRank');
let lowerRankIcon = document.getElementById('lowerRank');

// Images

let robotImage = document.getElementById('robotImage');

document.addEventListener("DOMContentLoaded", function () {
    resizestatsInfo();
    window.addEventListener("resize", resizestatsInfo);

    function resizestatsInfo() {
        var generalInfoHeight = document.querySelector(".generalInfo").offsetHeight;
        document.querySelector(".statsInfo").style.height = generalInfoHeight + "px";
        document.querySelector(".robotImageContainer").style.height = generalInfoHeight + "px";
    }
});

document.getElementById('reloadApp').addEventListener('click', function () {
    getTeamData(teamNumber.value, yearOfComp.value, eventName.value)

});

document.getElementById('refreshApp').addEventListener('click', function () {
    getTeamData(teamNumber.value, yearOfComp.value, eventName.value)

});





setInterval(() => {
    getTeamData(teamNumber.value, yearOfComp.value, eventName.value);
}, 600000);

function getTeamData(teamNumber, yearNumber, eventName) {
    const apiKey = 'ZYBxNxrdFx8PfRxwTj5awXIFyWCsR9Rz1xkunI9KiPq7GDn4g5bU25KKGKyeqQTO';

    const requestOptions = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'X-TBA-Auth-Key': `${apiKey}`,
        },
    };

    fetch('https://www.thebluealliance.com/api/v3/team/frc' + teamNumber + '/event/' + yearNumber + eventName + '/status', requestOptions)
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

    fetch("https://www.thebluealliance.com/api/v3/team/frc" + teamNumber + "/media/" + yearNumber, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response reported as not ok!!!');
            }
            return response.json();
        })
        .then(data => {
            setImage(data);
        })
        .catch(error => {
            console.error('Fetching Error:', error);
        });



}


function setBlueAlliance(data) {
    console.log(data);
    teamNum.innerHTML = teamNumber.value;

    checkRank(data);

    wins.innerHTML = data.qual.ranking.record.wins;
    ties.innerHTML = data.qual.ranking.record.ties;
    losses.innerHTML = data.qual.ranking.record.losses;
    fadeAnimation(teamNum);
    fadeAnimation(currentRank);
    fadeAnimation(wins);
    fadeAnimation(ties);
    fadeAnimation(losses);
}

function setStatbotics(data) {
    checkEPA(data);
    checkAutoPoints(data);
    checkTeleopPoints(data);
    checkEndgamePoints(data);
    epa.value = data.epa.breakdown.total_points.mean;
    autoPoints.value = data.epa.breakdown.auto_points.mean;
    telePoints.value = data.epa.breakdown.teleop_points.mean;
    endgamePoints.value = data.epa.breakdown.endgame_points.mean;
    fadeAnimation(epa);
    fadeAnimation(autoPoints);
    fadeAnimation(telePoints);
    fadeAnimation(endgamePoints);
}

document.getElementById('modeSwitcher').addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'light')
    }
    else {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
    }
})


function fadeAnimation(element) {
    var op = 0.1;  // initial opacity
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.2;
    }, 10);
}


function checkRank(data) {
    if (previousRank != -1) {
        if (previousRank > data.qual.ranking.rank) {
            currentRank.innerHTML = data.qual.ranking.rank;
            previousRank = data.qual.ranking.rank;
            sameRankIcon.style.display = "none";
            higherRankIcon.style.display = "none";
            lowerRankIcon.style.display = "inline-block";
        } else if (previousRank < data.qual.ranking.rank) {
            currentRank.innerHTML = data.qual.ranking.rank;
            previousRank = data.qual.ranking.rank;
            sameRankIcon.style.display = "none";
            higherRankIcon.style.display = "inline-block";
            lowerRankIcon.style.display = "none";
        } else {
            currentRank.innerHTML = data.qual.ranking.rank;
            sameRankIcon.style.display = "inline-block";
            higherRankIcon.style.display = "none";
            lowerRankIcon.style.display = "none";
        }
    } else {
        currentRank.innerHTML = data.qual.ranking.rank;
        sameRankIcon.style.display = "inline-block";
        higherRankIcon.style.display = "none";
        lowerRankIcon.style.display = "none";
    }
}


function checkEPA(data) {
    if (previousEpa != -1) {
        if (previousEpa > data.epa.breakdown.total_points.mean) {
            epa.innerHTML = data.epa.breakdown.total_points.mean;
            previousEpa = data.epa.breakdown.total_points.mean;
            setBackgrounds('identifierEPA', 'epa', 'down');
        } else if (previousEpa < data.epa.breakdown.total_points.mean) {
            epa.innerHTML = data.epa.breakdown.total_points.mean;
            previousEpa = data.epa.breakdown.total_points.mean;
            setBackgrounds('identifierEPA', 'epa', 'up');
        } else {
            epa.innerHTML = data.epa.breakdown.total_points.mean;
        }
    } else {
        epa.innerHTML = data.epa.breakdown.total_points.mean;
    }
}

function checkAutoPoints(data) {
    if (previousAutoPoints != -1) {
        if (previousAutoPoints > data.epa.breakdown.auto_points.mean) {
            autoPoints.innerHTML = data.epa.breakdown.auto_points.mean;
            previousAutoPoints = data.epa.breakdown.auto_points.mean;
            setBackgrounds('identifierAuto', 'autoPoints', 'down');
        } else if (previousAutoPoints < data.epa.breakdown.auto_points.mean) {
            autoPoints.innerHTML = data.epa.breakdown.auto_points.mean;
            previousAutoPoints = data.epa.breakdown.auto_points.mean;
            setBackgrounds('identifierAuto', 'autoPoints', 'up');
        } else {
            autoPoints.innerHTML = data.epa.breakdown.auto_points.mean;
        }
    } else {
        autoPoints.innerHTML = data.epa.breakdown.auto_points.mean;
    }
}

function checkTeleopPoints(data) {
    if (previoustelePoints != -1) {
        if (previoustelePoints > data.epa.breakdown.teleop_points.mean) {
            telePoints.innerHTML = data.epa.breakdown.teleop_points.mean;
            previoustelePoints = data.epa.breakdown.teleop_points.mean;
            setBackgrounds('identifierTeleop', 'telePoints', 'down');
        } else if (previoustelePoints < data.epa.breakdown.teleop_points.mean) {
            telePoints.innerHTML = data.epa.breakdown.teleop_points.mean;
            previoustelePoints = data.epa.breakdown.teleop_points.mean;
            setBackgrounds('identifierTeleop', 'telePoints', 'up');
        } else {
            telePoints.innerHTML = data.epa.breakdown.teleop_points.mean;
        }
    } else {
        telePoints.innerHTML = data.epa.breakdown.teleop_points.mean;
    }
}

function checkEndgamePoints(data) {
    if (previousEndgamePoints != -1) {
        if (previousEndgamePoints > data.epa.breakdown.endgame_points.mean) {
            endgamePoints.innerHTML = data.epa.breakdown.endgame_points.mean;
            previousEndgamePoints = data.epa.breakdown.endgame_points.mean;
            setBackgrounds('identifierEndgame', 'endgamePoints', 'down');
        } else if (previousEndgamePoints < data.epa.breakdown.endgame_points.mean) {
            endgamePoints.innerHTML = data.epa.breakdown.endgame_points.mean;
            previousEndgamePoints = data.epa.breakdown.endgame_points.mean;
            setBackgrounds('identifierEndgame', 'endgamePoints', 'up');
        } else {
            endgamePoints.innerHTML = data.epa.breakdown.endgame_points.mean;
        }
    } else {
        endgamePoints.innerHTML = data.epa.breakdown.endgame_points.mean;
    }
}



function setBackgrounds(identifier, value, ranking) {
    var descriptionID = document.getElementById(identifier);
    var valueID = document.getElementById(value);

    let rankingUp = ['bg-success-subtle', 'border-success'];
    let rankingDown = ['bg-danger-subtle', 'border-danger'];

    if (descriptionID && valueID) {
        if (ranking == 'up') {
            rankingDown.forEach(removedClass => {
                descriptionID.classList.remove(removedClass);
            });
            rankingDown.forEach(removedClass => {
                valueID.classList.remove(removedClass);
            });
            rankingUp.forEach(addedClass => {
                descriptionID.classList.add(addedClass);
            });
            rankingUp.forEach(addedClass => {
                valueID.classList.add(addedClass);
            });
        } else if (ranking == 'down') {
            rankingUp.forEach(removedClass => {
                descriptionID.classList.remove(removedClass);
            });
            rankingUp.forEach(removedClass => {
                valueID.classList.remove(removedClass);
            });


            rankingDown.forEach(addedClass => {
                descriptionID.classList.add(addedClass);
            });
            rankingDown.forEach(addedClass => {
                valueID.classList.add(addedClass);
            });
        }
    }
}

function setImage(data) {
    robotImage.src = data[1].direct_url;
}


