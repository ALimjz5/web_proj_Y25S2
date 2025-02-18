let code;
$(async function () {
    const urlParams = new URLSearchParams(window.location.search);
    code = urlParams.get("BusCode");
    $("#addFavBtn").on("click", addFav);
})

async function addFav(e) {
    e.preventDefault();
    let response = await fetch(ADD_GET_FAV, {
        method: "POST",
        body: JSON.stringify({ code: code}),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.token}`
        }
    });
    if (response.ok) {
        let data = await response.json();
        alert(data.message);
    } else {
        alert("Stop has already been added.");
    }
}