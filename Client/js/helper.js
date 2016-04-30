
if (location.hostname == "localhost") {
    host = "http://localhost:1234";
} else if (location.hostname.startsWith("192.168", 0)) {
    host = "http://192.168.1.150:1336";
    // iisexpress-proxy 1234 to 1336
    // iisexpress-proxy 55081 to 13337 ::55081 == port in browser on project pc
} else {
    host = "";
}

user = {
    name: localStorage.getItem("name"),
    password: localStorage.getItem("password"), // HASHED
    email: localStorage.getItem("email"), // HASHED

    save: function () {
        if (this.name) localStorage.setItem("name", this.name);
        if (this.password) localStorage.setItem("password", this.password);
        if (this.email) localStorage.setItem("email", this.email);
    },
    remove: function () {
        this.name = this.password = this.email = null;   // subject to change

        localStorage.removeItem("name");
        localStorage.removeItem("password");
        localStorage.removeItem("email");
    }
}

window.addEventListener("load", () => {
    if (!user.name || !user.password) toggleScreen(screens.login.elm);
    else sendRequest("/login/", (text, error) => {
        if (!error) {
            toggleScreen(screens.overview.elm);
        }
        else {
            toggleScreen(screens.login.elm);
            return true;
        }
    });

    var backbtns = document.getElementsByClassName("back_btn")
    for (var i = 0; i < backbtns.length; i++) {
        backbtns[i].onclick = () => {
            toggleScreen(screens.overview.elm);
        }
    }
});

function sendRequest(action, callback) { // implement send data.
    if (!user.name || !user.password || user.password.length < 4) {
        swal("Error", "Bad username or password", "error");
        return;
    }

    action = "/api" + action;

    var req = new XMLHttpRequest();
    req.open('GET', host + action, true);
    req.setRequestHeader("Authorization", "Basic " + btoa(user.name + ":" + user.password));

    req.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                if (callback) callback(this.responseText);
            } else {
                console.log(this);
                if (callback && !callback(this.responseText, this.response || true)) swal("Error", this.response, "error");
            }
        }
    };
    req.send();
}

function toggleScreen(elm, noevent) {
    var divs = [].slice.call(document.getElementsByClassName('active')); // HTMLCollection is dynamic and will in some browser change if the elements no longer reach the requirements. 

    for (var div in divs) {
        if (divs[div].classList.contains('content')) {
            if (!noevent) divs[div].dispatchEvent(new Event('detoggled'));
            divs[div].classList.remove('active');
        }
    }

    if (!noevent) elm.dispatchEvent(new Event('toggled'));
    elm.classList.add('active');
}

function superhash(s) { // hash --> reserved by browser funktionen finns kanske redan = error
    var hash = 0, i, chr, len;
    if (s.length == 0) return hash;
    for (i = 0, len = s.length; i < len; i++) {
        chr = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getNiceTime(Time) { // argument namn ska aldrig ha stora bokstäver
    var endTime = "Slutad";
    if (Math.floor(Time / 1000) > 0) {
        endTime = Math.floor(Time / 1000) + " sekunder";
        if (Math.floor(Time / (1000 * 60)) > 0) {
            endTime = Math.floor(Time / (1000 * 60)) + " minuter";
            if (Math.floor(Time / (1000 * 60 * 60)) > 0) {
                endTime = Math.floor(Time / (1000 * 60 * 60)) + " timmar";
                if (Math.floor(Time / (1000 * 60 * 60 * 24)) > 0) {
                    endTime = Math.floor(Time / (1000 * 60 * 60 * 24)) + " dagar";
                }
            }
        }
    }

    return endTime;
}

function getDaysHoursMins(time) {

    var days = Math.floor(time / (1000 * 60 * 60 * 24));
    time -= days * (1000 * 60 * 60 * 24);
    var hours = Math.floor(time / (1000 * 60 * 60));
    time -= hours * (1000 * 60 * 60);
    var mins = Math.floor(time / (1000 * 60));
    time -= mins * (1000 * 60);
    var secs = Math.floor(time / (1000));

    return { days: days, hours: hours, mins: mins, secs: secs };
}