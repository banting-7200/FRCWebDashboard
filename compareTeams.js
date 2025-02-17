// Notification Services

let toasts = document.getElementById('toast-container');

// Time and Date variables

let today = new Date();
let todayDate = today.toString();
let timeHours = parseInt(today.getHours());
let timeMinutes = today.getMinutes();
let timeSeconds = today.getSeconds();

// Team Form objects

let teamAFormObjects = [document.getElementById('teamANumber'), document.getElementById('teamAYear'), document.getElementById('teamAEventName'), document.getElementById('reloadTeamA')];
let teamBFormObjects = [document.getElementById('teamBNumber'), document.getElementById('teamBYear'), document.getElementById('teamBEventName'), document.getElementById('reloadTeamB')];


// Team Placeholders
let teamAPlaceholderObjects = [document.getElementById('teamAImage'), document.getElementById('teamANum'), document.getElementById('teamARank'), document.getElementById('teamAWins'), document.getElementById('teamATies'), document.getElementById('teamALosses'), document.getElementById('teamAEPA')];
let teamBPlaceholderObjects = [document.getElementById('teamBImage'), document.getElementById('teamBNum'), document.getElementById('teamBRank'), document.getElementById('teamBWins'), document.getElementById('teamBTies'), document.getElementById('teamBLosses'), document.getElementById('teamBEPA')];

// Functions to be initialized
initIcons();

// Event Listeners

teamAFormObjects[3].addEventListener('click', function () {
    getTeamData(teamAFormObjects[0].value, teamAFormObjects[1].value, teamAFormObjects[2].value.split(" ")[0], teamAPlaceholderObjects)

});

teamBFormObjects[3].addEventListener('click', function () {
    getTeamData(teamBFormObjects[0].value, teamBFormObjects[1].value, teamBFormObjects[2].value.split(" ")[0], teamBPlaceholderObjects)
});

teamAFormObjects[2].addEventListener('focus', function () {
    getTeamEvents(teamAFormObjects[0].value, teamAFormObjects[1].value, "teamA");
});

teamBFormObjects[2].addEventListener('focus', function () {
    getTeamEvents(teamBFormObjects[0].value, teamBFormObjects[1].value, "teamB");
});


// Essential Functions
function getTeamData(teamNumber, yearNumber, eventName, team) {
    const apiKey = 'ZYBxNxrdFx8PfRxwTj5awXIFyWCsR9Rz1xkunI9KiPq7GDn4g5bU25KKGKyeqQTO';

    const requestOptions = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'X-TBA-Auth-Key': `${apiKey}`,
        },
    };

    team[1].innerHTML = teamNumber;

    fetch('https://www.thebluealliance.com/api/v3/team/frc' + teamNumber + '/event/' + yearNumber + eventName + '/status', requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response reported as not ok!!!');
            }
            return response.json();
        })
        .then(data => {
            setBlueAlliance(data, team);
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
            setStatbotics(data, team);
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
            setImage(data, team);
        })
        .catch(error => {
            errorToast("[Error getting RobotIMG data] " + error, 3000)
        });
}


function setBlueAlliance(data, team) {
    console.log(data);
    if (data != null) {
        successToast("Success getting TBA data", 3000)
    }
    team[2].innerHTML = data.qual.ranking.rank;
    team[3].innerHTML = data.qual.ranking.record.wins;
    team[4].innerHTML = data.qual.ranking.record.ties;
    team[5].innerHTML = data.qual.ranking.record.losses;
    fadeAnimation(team[1]);
    fadeAnimation(team[2]);
    fadeAnimation(team[3]);
    fadeAnimation(team[4]);
    fadeAnimation(team[5]);
}


function setStatbotics(data, team) {
    if (data != null) {
        successToast("Success getting Statbotics data", 3000)
    }
    console.log(data);
    team[6].innerHTML = data.epa.breakdown.total_points;

    fadeAnimation(team[6]);
}

function setImage(data, team) {
    if (data != null) {
        successToast("Success getting robotImage data", 3000)
    }
    // robotImage.src = data[1].direct_url;
    console.log(data[1].direct_url);
    team[0].src = data[1].direct_url;
}

function getTeamEvents(teamNumber, yearNumber, team) {
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
            createDatalinks(data, team);
        })
        .catch(error => {
            errorToast("[Error getting TBA Events data] " + error, 3000)
        });

}


let optionList = ["data", "pooper scooper"];

function createDatalinks(data, team) {
    console.log(data);
    for (let i = 0; i < data.length; i++) { // Change condition to i < data.length
        optionList[i] = data[i].event_code + " (" + data[i].city + ")";
    }

    if (team == "teamA") {
        autocomplete(teamAFormObjects[2], optionList);
    } else {
        autocomplete(teamBFormObjects[2], optionList);
    }
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

// Misc Functions

function initIcons() {
    document.getElementById('qrCodeExport').style.color = "white";
    document.getElementById('dashContainer').style.color = "white";
    document.getElementById('matchContainer').style.color = "white";
}


document.getElementById('themeSwitcher').addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        notifiationToast("Switching to light mode", 3000);
        document.documentElement.setAttribute('data-bs-theme', 'light')
        document.getElementById('qrCodeExport').style.color = "black";
        document.getElementById('dashContainer').style.color = "black";
        document.getElementById('matchContainer').style.color = "black";
        document.getElementById('themeSwitcherIcon').innerHTML = "dark_mode";
    }
    else {
        notifiationToast("Switching to dark mode", 3000);
        document.documentElement.setAttribute('data-bs-theme', 'dark')
        document.getElementById('qrCodeExport').style.color = "white";
        document.getElementById('dashContainer').style.color = "white";
        document.getElementById('matchContainer').style.color = "white";
        document.getElementById('themeSwitcherIcon').innerHTML = "light_mode";
    }
});

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

// Toast functions


function errorToast(message, delay) {
    let minutes = 0;
    if (today.getMinutes() < 10) {
        minutes = "0" + today.getMinutes().toString(2);
    }else{
        minutes = today.getMinutes().toString();
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
        minutes = "0" + today.getMinutes().toString(2);
    }else{
        minutes = today.getMinutes().toString();
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
        minutes = "0" + today.getMinutes().toString(2);
    }else{
        minutes = today.getMinutes().toString();
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
