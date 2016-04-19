
if (location.hostname == "localhost") {
    host = "http://localhost:1234/";
} else {
    host = "";
}

user = {
    name: localStorage.getItem("username"),
    password: localStorage.getItem("password"), // HASHED

    save: function () {
        localStorage.setItem("username", this.username);
        localStorage.setItem("password", this.password);
    }
}

function sendRequest(action, callback, sign) { // implement send data.
    if (!user.name || !user.password || user.password.length < 4) {
        swal("Error", "Bad username or password", "error");
        return;
    }

    var req = new XMLHttpRequest();
    req.open('GET', host + action, true);

    if (sign)
        req.setRequestHeader("Authorization", "Basic " + btoa(user.name + ":" + user.password)); // Hashed password!
    else
        req.setRequestHeader("Authorization", "Basic " + btoa(user.name + ":" + superhash(user.password + action)));

    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                if (callback) callback(req.responseText);
            } else {
                if (callback && !callback(req.responseText, req.response)) swal("Error", req.response, "error");
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

window.addEventListener("load", () => {
    screens.login.elm.dispatchEvent(new Event('toggled'));
});