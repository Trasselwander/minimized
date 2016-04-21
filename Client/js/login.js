
window.addEventListener("load", () => {
    document.getElementById("reg").onclick = () =>
        toggleScreen(screens.register.elm);

    document.getElementById("log").onclick = () =>
        toggleScreen(screens.login.elm);

    document.getElementById("login_btn").onclick = () => {
        user.name = document.getElementById("login_name").value;
        user.password = superhash(document.getElementById("login_password").value);

        //function sendRequest(action, callback, sign) { // implement send data.

        console.log(user.name, user.password);
        sendRequest("/login/", (text, error) => {
            if (!error) {
                toggleScreen(screens.overview.elm);
                user.save();
            }
        });

        //SendRequest();
    }
    document.getElementById("register_btn").onclick = () => {
        user.name = document.getElementById("register_name").value;
        user.password = superhash(document.getElementById("register_password").value);
        user.email = document.getElementById("register_email").value;

        console.log(user.name, user.password);
        sendRequest("/register/" + (user.email ? btoa(user.email) : ""), (text, error) => {
            if (!error) {
                toggleScreen(screens.overview.elm);
                user.save();
            }
        });
    }

    document.getElementById("logout_btn").onclick = () => {
        user.name = user.password = user.email = null;   // subject to change
        console.log(user);
        toggleScreen(screens.login.elm);
    }
});

screens.login.elm.addEventListener("toggled", () => { //detoggled
    document.getElementById("logout_btn").classList.add("hidden");
});//hide logout button
screens.login.elm.addEventListener("detoggled", () => { //detoggled
    document.getElementById("logout_btn").classList.remove("hidden");
    console.log("visible");

});
