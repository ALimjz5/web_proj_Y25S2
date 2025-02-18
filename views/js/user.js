$(async function () {
    let response = await fetch(GET_USER_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.token}`
        }
    });
    if (response.ok) {
        let data = await response.json();
        $("#name").val(data.name);
        $("#username").val(data.username);
        $("#email").val(data.email);
    } else {
        let err = await response.json();
        alert(err.message);
        history.back();
    }

    $("#editUserForm").on("submit", editUser);
    $("#deleteUserBtn").on("click", deleteUser);
})

async function editUser(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let userEntries = Object.fromEntries(data.entries());
    let response = await fetch(EDIT_USER_URL, {
        method: "PUT",
        body: JSON.stringify(userEntries),
        headers: {
            "Authorization": `Bearer ${sessionStorage.token}`,
            "Content-Type": 'application/json'
        }
    });
    if (response.ok) {
        let data = await response.json();
        $("#successMessage").html(data.message);
    } else {
        let err = await response.json();
        $("#statusMessage").text(err.message);
    }
}

async function deleteUser(e) {
  
    let response = await fetch(DELETE_USER_URL, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${sessionStorage.token}`
        }
    });
    if (response.ok) {
        alert("User deleted.");
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        location.href = "index.html";
    }
}