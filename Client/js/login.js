
window.addEventListener("load", () => {
    document.getElementById("reg").onclick = () =>
        toggleScreen(screens.register.elm);

    document.getElementById("log").onclick = () =>
        toggleScreen(screens.login.elm);

    document.getElementById("login_btn").onclick = () => {
        sendLogin();
    }

    document.getElementById("login_password").onkeypress = (e) => { //login from enter
        if (e.keyCode == 13) sendLogin();
    }

    function sendLogin() {
        user.name = document.getElementById("login_name").value;
        user.password = superhash(document.getElementById("login_password").value);

        sendRequest("/login", (text, error) => {
            if (!error) {
                toggleScreen(screens.overview.elm);
                user.save();
            }
            else {
                toggleScreen(screens.login.elm);
                swal({
                    title: "Fel!",
                    text: "Ogiltigt användarnamn eller lösenord!",
                    type: "error",
                });
                return true;
            }
        });
    }

    document.getElementById("register_btn").onclick = () => {
        sendRegister();
    }

    document.getElementById("register_email").onkeypress = (e) => { // resgister from enter
        if (e.keyCode == 13) sendRegister();
    }

    function sendRegister() {
        user.name = document.getElementById("register_name").value;
        user.password = superhash(document.getElementById("register_password").value);
        user.email = document.getElementById("register_email").value;

        if (document.getElementById("register_password_repeat").classList.contains("wrong")) {
            swal({
                title: "Fel!",
                text: "Lösenorden stämmer inte överens!",
                type: "error",
            });
            return;
        }

        console.log(user.name, user.password);
        sendRequest("/register/" + (user.email ? btoa(user.email) : ""), (text, error) => {
            if (!error) {
                toggleScreen(screens.overview.elm);
                user.save();
            }
        });
    }

    document.getElementById("register_password_repeat").onkeyup = () => {
        var reg_pw = document.getElementById("register_password");
        var reg_rep_pw = document.getElementById("register_password_repeat");

        if (reg_pw.value != reg_rep_pw.value) {
            reg_rep_pw.classList.add("wrong");
            reg_pw.classList.add("wrong");
        }
        else {
            reg_rep_pw.classList.remove("wrong");
            reg_pw.classList.remove("wrong");
        }
    }

    document.getElementById("logout_btn").onclick = () => {
        user.remove();
        console.log(user);
        toggleScreen(screens.login.elm);
    }
});

screens.login.elm.addEventListener("toggled", () => { //detoggled
    document.getElementById("logout_btn").classList.add("hidden");
});

screens.login.elm.addEventListener("detoggled", () => { //detoggled
    document.getElementById("logout_btn").classList.remove("hidden");
    console.log("visible");
});
