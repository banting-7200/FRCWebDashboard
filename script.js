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

let robotImage = document.getElementById('robotImageID');

// URL based Search

const searchParams = new URLSearchParams(window.location.search);

// qr code shenanigans

let qrButton = document.getElementById('qrCodeExport');
qrButton.style.color = "white";

// Notification Services

let toasts = document.getElementById('toast-container');

// Time and Date variables

let today = new Date();
let todayDate = today.toString();
let timeHours = parseInt(today.getHours());
let timeMinutes = today.getMinutes();
let timeSeconds = today.getSeconds();


// Initialize functions

checkURLParams();
checkWindowWidth();
setIcons();

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
    getTeamData(teamNumber.value, yearOfComp.value, eventName.value.split(" ")[0])

});

document.getElementById('refreshApp').addEventListener('click', function () {
    getTeamData(teamNumber.value, yearOfComp.value, eventName.value.split(" ")[0])

});

eventName.addEventListener('focus', function () {
    getTeamEvents(teamNumber.value, yearOfComp.value);
});




setInterval(() => {
    getTeamData(teamNumber.value, yearOfComp.value, eventName.value);
}, 300000);

function getTeamData(teamNumber, yearNumber, eventName) {
    qrButton.href = "https://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=" + encodeURIComponent("https://banting-7200.github.io/FRCWebDashboard?team=" + teamNumber + "&year=" + yearNumber + "&event=" + eventName) + "%0A&qzone=1&margin=0&size=400x400&ecc=L";
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
            errorToast("[Error getting TBA data] " + error, 3000)
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
            errorToast("[Error getting Statbotics data] " + error, 3000)
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
            errorToast("[Error getting RobotIMG data] " + error, 3000)
        });
}

function getTeamEvents(teamNumber, yearNumber) {
    const apiKey = 'ZYBxNxrdFx8PfRxwTj5awXIFyWCsR9Rz1xkunI9KiPq7GDn4g5bU25KKGKyeqQTO';
    const requestOptions = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'X-TBA-Auth-Key': `${apiKey}`,
        },
    };

    fetch('https://www.thebluealliance.com/api/v3/team/frc' + teamNumber + '/events/' + yearNumber, requestOptions)
        .then(async response => {
            if (!response.ok) {
                throw new Error('Network response reported as not ok!!!');
            }
            return await response.json();
        })
        .then(data => {
            createDatalinks(data);
        })
        .catch(error => {
            errorToast("[Error getting TBA Events data] " + error, 3000)
        });


}



function setBlueAlliance(data) {
    console.log(data);
    if (data != null) {
        successToast("Success getting TBA data", 3000)
    }
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
    if (data != null) {
        successToast("Success getting Statbotics data", 3000)
    }
    teamNum.innerHTML = data.team;
    checkEPA(data);
    checkAutoPoints(data);
    checkTeleopPoints(data);
    checkEndgamePoints(data);
    epa.value = data.epa.breakdown.total_points;
    autoPoints.value = data.epa.breakdown.auto_points;
    telePoints.value = data.epa.breakdown.teleop_points;
    endgamePoints.value = data.epa.breakdown.endgame_points;
    fadeAnimation(epa);
    fadeAnimation(autoPoints);
    fadeAnimation(telePoints);
    fadeAnimation(endgamePoints);
}

function setIcons() {
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
        document.getElementById('qrCodeExport').style.color = "white";
        document.getElementById('compareContainer').style.color = "white";
        document.getElementById('teamContainer').style.color = "white";
        document.getElementById('teamImage').src = 'assets/bantingLogo/ICONMARK - WHITE.png';
    }

}

document.getElementById('modeSwitcher').addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'light')
        document.getElementById('qrCodeExport').style.color = "black";
        document.getElementById('compareContainer').style.color = "black";
        document.getElementById('teamContainer').style.color = "black";
        document.getElementById('teamImage').src = 'assets/bantingLogo/ICONMARK - REVERSED.png';
    }
    else {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
        document.getElementById('qrCodeExport').style.color = "white";
        document.getElementById('compareContainer').style.color = "white";
        document.getElementById('teamContainer').style.color = "white";
        document.getElementById('teamImage').src = 'assets/bantingLogo/ICONMARK - WHITE.png';


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
    if (previousRank < data.qual.ranking.rank) {
        currentRank.innerHTML = data.qual.ranking.rank;
        previousRank = data.qual.ranking.rank;
        sameRankIcon.style.display = "none";
        higherRankIcon.style.display = "none";
        lowerRankIcon.style.display = "inline-block";
    } else if (previousRank > data.qual.ranking.rank) {
        currentRank.innerHTML = data.qual.ranking.rank;
        previousRank = data.qual.ranking.rank;
        sameRankIcon.style.display = "none";
        higherRankIcon.style.display = "inline-block";
        lowezrRankIcon.style.display = "none";
    } else {
        currentRank.innerHTML = data.qual.ranking.rank;
        sameRankIcon.style.display = "inline-block";
        higherRankIcon.style.display = "none";
        lowerRankIcon.style.display = "none";
    }

}


function checkEPA(data) {
    if (previousEpa > data.epa.breakdown.total_points) {
        epa.innerHTML = data.epa.breakdown.total_points;
        previousEpa = data.epa.breakdown.total_points;
        setBackgrounds('identifierEPA', 'epa', 'down');
    } else if (previousEpa < data.epa.breakdown.total_points) {
        epa.innerHTML = data.epa.breakdown.total_points;
        previousEpa = data.epa.breakdown.total_points;
        setBackgrounds('identifierEPA', 'epa', 'up');
    } else {
        epa.innerHTML = data.epa.breakdown.total_points;
    }
}

function checkAutoPoints(data) {
    if (previousAutoPoints > data.epa.breakdown.auto_points) {
        autoPoints.innerHTML = data.epa.breakdown.auto_points;
        previousAutoPoints = data.epa.breakdown.auto_points;
        setBackgrounds('identifierAuto', 'autoPoints', 'down');
    } else if (previousAutoPoints < data.epa.breakdown.auto_points) {
        autoPoints.innerHTML = data.epa.breakdown.auto_points;
        previousAutoPoints = data.epa.breakdown.auto_points;
        setBackgrounds('identifierAuto', 'autoPoints', 'up');
    } else {
        autoPoints.innerHTML = data.epa.breakdown.auto_points;
    }

}

function checkTeleopPoints(data) {
    if (previoustelePoints > data.epa.breakdown.teleop_points) {
        telePoints.innerHTML = data.epa.breakdown.teleop_points;
        previoustelePoints = data.epa.breakdown.teleop_points;
        setBackgrounds('identifierTeleop', 'telePoints', 'down');
    } else if (previoustelePoints < data.epa.breakdown.teleop_points) {
        telePoints.innerHTML = data.epa.breakdown.teleop_points;
        previoustelePoints = data.epa.breakdown.teleop_points;
        setBackgrounds('identifierTeleop', 'telePoints', 'up');
    } else {
        telePoints.innerHTML = data.epa.breakdown.teleop_points;
    }
}

function checkEndgamePoints(data) {
    if (previousEndgamePoints > data.epa.breakdown.endgame_points) {
        endgamePoints.innerHTML = data.epa.breakdown.endgame_points;
        previousEndgamePoints = data.epa.breakdown.endgame_points;
        setBackgrounds('identifierEndgame', 'endgamePoints', 'down');
    } else if (previousEndgamePoints < data.epa.breakdown.endgame_points) {
        endgamePoints.innerHTML = data.epa.breakdown.endgame_points;
        previousEndgamePoints = data.epa.breakdown.endgame_points;
        setBackgrounds('identifierEndgame', 'endgamePoints', 'up');
    } else {
        endgamePoints.innerHTML = data.epa.breakdown.endgame_points;
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
    if (data != null) {
        successToast("Success getting robotImage data", 3000)
    }
    // robotImage.src = data[1].direct_url;
    console.log(data[1].direct_url);
    robotImage.src = data[1].direct_url;
}
function checkURLParams() {
    if (searchParams.has('event') && searchParams.has('team') && searchParams.has('year')) {
        // teamNum.innerHTML = searchParams.get('team');
        getTeamData(searchParams.get('team'), searchParams.get('year'), searchParams.get('event'));
        qrButton.href = "https://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=" + encodeURIComponent("https://banting-7200.github.io/FRCWebDashboard?team=" + searchParams.get('team') + "&year=" + searchParams.get('year') + "&event=" + searchParams.get('event')) + "%0A&qzone=1&margin=0&size=400x400&ecc=L";
    }
}

function errorToast(message, delay) {
    let minutes = 0;
    if (today.getMinutes() < 10) {
        minutes = "0" + today.getMinutes();
    }
    var toast = document.createElement('div');
    toast.classList.add('toast');
    toast.classList.add('fade');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.style.marginBottom = "1rem";

    var toastDelay = delay || 3000;

    var toastHeader = document.createElement('div');
    toastHeader.classList.add('toast-header');
    toastHeader.classList.add('bg-danger-subtle');


    var toastHeaderStrong = document.createElement('strong');
    toastHeaderStrong.classList.add('me-auto');
    toastHeaderStrong.innerText = "Error";


    var toastHeaderSmall = document.createElement('small');
    toastHeaderSmall.innerText = today.getHours() + ":" + minutes + ":" + today.getSeconds();

    var toastHeaderCloseButton = document.createElement('button');
    toastHeaderCloseButton.type = "button";
    toastHeaderCloseButton.classList.add('btn-close');
    toastHeaderCloseButton.setAttribute('data-bs-dismiss', 'toast');
    toastHeaderCloseButton.setAttribute('aria-label', 'Close');


    toastHeader.appendChild(toastHeaderStrong);
    toastHeader.appendChild(toastHeaderSmall);
    toastHeader.appendChild(toastHeaderCloseButton);

    var toastBody = document.createElement('div');
    toastBody.classList.add('toast-body');
    toastBody.innerText = message;

    toast.appendChild(toastHeader);
    toast.appendChild(toastBody);

    toasts.appendChild(toast);

    var toast = new bootstrap.Toast(toast);

    toast.show();

    setTimeout(function () {
        $(toast).remove();
    }, toastDelay);
}

function successToast(message, delay) {
    let minutes = 0;
    if (today.getMinutes() < 10) {
        minutes = "0" + today.getMinutes();
    }
    var toast = document.createElement('div');
    toast.classList.add('toast');
    toast.classList.add('fade');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.style.marginBottom = "1rem";


    var toastDelay = delay || 3000;

    var toastHeader = document.createElement('div');
    toastHeader.classList.add('toast-header');
    toastHeader.classList.add('bg-success-subtle');


    var toastHeaderStrong = document.createElement('strong');
    toastHeaderStrong.classList.add('me-auto');
    toastHeaderStrong.innerText = "Success!";


    var toastHeaderSmall = document.createElement('small');
    toastHeaderSmall.innerText = today.getHours() + ":" + minutes + ":" + today.getSeconds();

    var toastHeaderCloseButton = document.createElement('button');
    toastHeaderCloseButton.type = "button";
    toastHeaderCloseButton.classList.add('btn-close');
    toastHeaderCloseButton.setAttribute('data-bs-dismiss', 'toast');
    toastHeaderCloseButton.setAttribute('aria-label', 'Close');


    toastHeader.appendChild(toastHeaderStrong);
    toastHeader.appendChild(toastHeaderSmall);
    toastHeader.appendChild(toastHeaderCloseButton);

    var toastBody = document.createElement('div');
    toastBody.classList.add('toast-body');
    toastBody.innerText = message;

    toast.appendChild(toastHeader);
    toast.appendChild(toastBody);

    toasts.appendChild(toast);

    var toast = new bootstrap.Toast(toast);

    toast.show();

    setTimeout(function () {
        $(toast).remove();
    }, toastDelay);
}

function notifiationToast(message, delay) {
    let minutes = 0;
    if (today.getMinutes() < 10) {
        minutes = "0" + today.getMinutes();
    }
    var toast = document.createElement('div');
    toast.classList.add('toast');
    toast.classList.add('fade');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.style.marginBottom = "1rem";


    var toastDelay = delay || 3000;

    var toastHeader = document.createElement('div');
    toastHeader.classList.add('toast-header');


    var toastHeaderStrong = document.createElement('strong');
    toastHeaderStrong.classList.add('me-auto');
    toastHeaderStrong.innerText = "FRC Web Dashboard";


    var toastHeaderSmall = document.createElement('small');
    toastHeaderSmall.innerText = today.getHours() + ":" + minutes + ":" + today.getSeconds();

    var toastHeaderCloseButton = document.createElement('button');
    toastHeaderCloseButton.type = "button";
    toastHeaderCloseButton.classList.add('btn-close');
    toastHeaderCloseButton.setAttribute('data-bs-dismiss', 'toast');
    toastHeaderCloseButton.setAttribute('aria-label', 'Close');


    toastHeader.appendChild(toastHeaderStrong);
    toastHeader.appendChild(toastHeaderSmall);
    toastHeader.appendChild(toastHeaderCloseButton);

    var toastBody = document.createElement('div');
    toastBody.classList.add('toast-body');
    toastBody.innerText = message;

    toast.appendChild(toastHeader);
    toast.appendChild(toastBody);

    toasts.appendChild(toast);

    var toast = new bootstrap.Toast(toast);

    toast.show();
}


function checkWindowWidth() {
    let toRemoveClasses = ['position-fixed', 'bottom-0', 'end-0', 'p-3'];
    let toAddClasses = ['mt-2', 'position-fixed', 'top-0', 'start-50', 'translate-middle-x'];
    if (window.matchMedia("(max-width: 700px)").matches) {
        toRemoveClasses.forEach(removedClass => {
            toasts.classList.remove(removedClass);
        });
        toAddClasses.forEach(addedClass => {
            toasts.classList.add(addedClass);
        });
    }

}

let optionList = ["data", "pooper scooper"];

function createDatalinks(data) {
    for (let i = 0; i < data.length; i++) { // Change condition to i < data.length
        optionList[i] = data[i].event_code + " (" + data[i].city + ")";
    }
    autocomplete(eventName, optionList);
}



function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].toUpperCase().includes(val.toUpperCase())) { // Changed condition here
                b = document.createElement("DIV");
                b.innerHTML = arr[i].replace(new RegExp(val, 'ig'), "<strong>$&</strong>");
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

