$(async function () {
    $(".favorites").append(`
        <div class="loader"></div>
        `);
    let response = await fetch(ADD_GET_FAV, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.token}`
        }
    });
    if (response.ok) {
        let data = await response.json();
        console.log(data);
        $(".favorites").empty();
        if (data.message != 'No Favorites') {
            data.forEach(function (stop) {
                console.log(stop);
                $(".favorites").append(`
                    <a href="/stop_info.html?BusCode=${stop.BusStopCode}">
                    <article>
                        <h2>${stop.Description}</h2>
                        Code: ${stop.BusStopCode}<br>
                        Road: ${stop.RoadName}
                    </article>
                    </a>
                    <button id="deleteFavBtn" data-id="${stop.BusStopCode}">Delete</button>
                    `);
            })
        } else {
            $(".favorites").append(`
                No Favorites Found.
                `);
        }

    } else {
        let err = await response.json();
        $("#statusMessage").text(err.message);
    }


    $(document).on("click", "#deleteFavBtn", function () {
        let stopCode = $(this).data("id");
        deleteFav(stopCode);
    });
    $("#searchStop").on("submit", searchStop);
})

async function deleteFav(e) {
    console.log("sdfsfs" + e);
    let response = await fetch(DELETE_FAV + e, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${sessionStorage.token}`
        }
    });
    if (response.ok) {
        alert("Favorite deleted.");
        location.reload();
    } else {
        let err = await response.json();
        $("#statusMessage").text(err.message);
    }
}

async function searchStop(e) {
    e.preventDefault();
    let stopEntries = document.getElementById("stopInput").value;
    console.log(stopEntries);
    let response = await fetch(`${ADD_GET_FAV}?search=${stopEntries}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.token}`
        }
    });
    if (response.ok) {
        $(".favorites").empty();
        let data = await response.json();
        console.log(data.length);
        if (data.length > 0) {
            data.forEach(function (stop) {
                $(".favorites").append(`
                    <a href="/stop_info.html?BusCode=${stop.BusStopCode}">
                        <article>
                            <h2>${stop.Description}</h2>
                            Code: ${stop.BusStopCode}<br>
                            Road: ${stop.RoadName}
                        </article>
                        </a>
                        <button id="deleteFavBtn" data-id="${stop.BusStopCode}">Delete</button>
                    `)
            })
        }
    } else {
        let err = await response.json();
        console.log(err.message);
    }
}