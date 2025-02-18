$(async function (){
    $("#addCardForm").on("submit", addCard);
})

async function addCard(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let cardEntries = Object.fromEntries(data.entries());
    let response = await fetch(ADD_CARD, {
        method: "POST",
        body: JSON.stringify(cardEntries),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.token}`
        }
    });
    if(response.ok){
        let data = await response.json();
        $("#successMessage").html(data.message);
        location.href="cards.html";
    } else{
        let err = await response.json();
        $("statusMessage").text(err.message);
    }
}