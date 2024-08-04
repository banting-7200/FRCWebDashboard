// Initializing functions
initIcons();


function initIcons() {
    document.getElementById('qrCodeExport').style.color = "white";
    document.getElementById('dashContainer').style.color = "white";
    document.getElementById('matchContainer').style.color = "white";
}


document.getElementById('themeSwitcher').addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'light')
        document.getElementById('qrCodeExport').style.color = "black";
        document.getElementById('dashContainer').style.color = "black";
        document.getElementById('matchContainer').style.color = "black";
        document.getElementById('themeSwitcherIcon').innerHTML = "dark_mode";
    }
    else {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
        document.getElementById('qrCodeExport').style.color = "white";
        document.getElementById('dashContainer').style.color = "white";
        document.getElementById('matchContainer').style.color = "white";
        document.getElementById('themeSwitcherIcon').innerHTML = "light_mode";
    }
});