$(async function() {
    let response = await fetch(GET_MY_CARDS,{
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.token}`
        }
    });
    if(response.ok) {
        let data = await response.json();
        console.log(data);
        data.forEach(function(card){
            $(".cards").append(`
                <article>
                    <h2>${card.name}</h2>
                    <div>
                        CID: ${card.code}<br>
                        Concession: ${card.type}<br>
                        Balance: \$${card.balance}<br>
                    </div>
                    <a href="/edit_card.html?id=${card._id}">Edit</a>
                </article>
                `);
        })
    } else {
        let err = await response.json();
        console.log(err.message);
    }
})