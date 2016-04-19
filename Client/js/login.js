
window.addEventListener("load", () => {
    document.getElementById("reg").onclick = () =>
        toggleScreen(screens.register.elm);

    document.getElementById("log").onclick = () =>
        toggleScreen(screens.login.elm);

    document.getElementById("login_btn").onclick = () => {
        user.name = document.getElementById("login_name");
        user.password = superhash(document.getElementById("login_password"));

        //SendRequest();
    }
    document.getElementById("register_btn").onclick = () => {
        user.name = document.getElementById("login_name");
        user.password = superhash(document.getElementById("login_password"));

        //SendRequest( sign = true);
    }
});

screens.login.elm.addEventListener("toggled", () => {
    if (!user.name || !user.password)
        toggleScreen(screens.login.elm, true);
    else
        toggleScreen(screens.overview.elm);
});