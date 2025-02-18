let id;
$(async function (){
    const urlParams = new URLSearchParams(window.location.search);
    id = urlParams.get('id');

    let response = await fetch(GET_DEL_EDIT_CARD + id, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.token}`
        }
    });
    if (response.ok) {
        let data = await response.json();
        $("#name").val(data.name);
        $("#code").val(data.code);
        $("#type").val(data.type);
    } else {
        let err = await response.json();
        alert(err.message);
        history.back();
    }

    $("#editCardForm").on("submit", editCard);
    $("#deleteCardBtn").on("click", deleteCard);
})

async function editCard(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let cardEntries = Object.fromEntries(data.entries());
    let response = await fetch(GET_DEL_EDIT_CARD+id, {
        method: "PUT",
        body: JSON.stringify(cardEntries),
        headers: {
            "Authorization": `Bearer ${sessionStorage.token}`,
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        let data = await response.json();
        $("#successMessage").html(data.message);
        location.href="cards.html";
    } else {
        let err = await response.json();
        $("#statusMessage").text(err.message);
    }
}

async function deleteCard(e) {
    let response = await fetch(GET_DEL_EDIT_CARD+id, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${sessionStorage.token}`,
            'Content-Type': 'application/json'
        }
    });
    if(response.ok) {
        let data = await response.json();
        $("#successMessage").html(data.message);
        location.href="cards.html";
    } else {
        let err = await response.json();
        $("#statusMessage").text(err.message);
    }
}