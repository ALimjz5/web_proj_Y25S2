$(function () {
    if (sessionStorage.token) {
        $(".unauthenticatedSection").hide();
        $(".authenticatedSection").show();
    } else {
        $(".unauthenticatedSection").show();
        $(".authenticatedSection").hide();
    }

    $("#loginForm").on("submit", login);
    $("#logoutLink").on("click", logout);
    $("#registerForm").on("submit", register);
})

async function login(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let loginEntries = Object.fromEntries(data.entries());
    let response = await fetch(LOGIN_URL, {
        method: "post",
        body: JSON.stringify(loginEntries),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.ok) {
        let data = await response.json();
        sessionStorage.token = data.token;
        location.href = "index.html";
    } else {
        let err = await response.json();
        $("#statusMessage").text(err.message);
    }
}

async function logout() {
    let response = await fetch(LOGOUT_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.token}`
        }
    });
    if (response.ok) {
        sessionStorage.removeItem("token");
        location.href = "login.html";
    } else {
        let err = await response.json();
        console.log(err.message);
        alert("Unable to logout");
    }
}

async function register(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let loginEntries = Object.fromEntries(data.entries());
    let response = await fetch(REGISTER_URL, {
        method: "post",
        body: JSON.stringify(loginEntries),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.ok) {
        let data = await response.json();
        $("#statusMessage").html(data.message);
        await loginAfterRegister(loginEntries);
    } else {
        let err = await response.json();
        $("#statusMessage").text(err.message);
    }
}

async function loginAfterRegister(creds) {
    let response = await fetch(LOGIN_URL, {
        method: "post",
        body: JSON.stringify(creds),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.ok) {
        let data = await response.json();
        sessionStorage.token = data.token;
        location.href = "index.html";
    } else {
        let err = await response.json();
        $("#statusMessage").text(err.message);
    }
}