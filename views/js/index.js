$(async function () {
    $(".bus-stops").append(`
        <div class="loader"></div>
        `);
    let response = await fetch(BUS_STOP, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.token}`
        }
    });
    if (response.ok) {
        let data = await response.json();
        console.log(data);
        $(".bus-stops").empty();
        data.forEach(function (stop) {
            $(".bus-stops").append(`
                <a href="/stop_info.html?BusCode=${stop.BusStopCode}">
                <article>
                    <h2>${stop.Description}</h2>
                    Code: ${stop.BusStopCode}<br>
                    Road: ${stop.RoadName}
                </article>
                </a>
                `)
        })
    }

    $("#searchStop").on("submit", searchStop);
})

async function searchStop(e) {
    e.preventDefault();
    let stopEntries = document.getElementById("stopInput").value;
    console.log(stopEntries);
    let response = await fetch(`${BUS_STOP}?search=${stopEntries}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.token}`
        }
    });
    if (response.ok) {
        $(".bus-stops").empty();
        $(".bus-stops").append(`
            <div class="loader"></div>
            `);
        let data = await response.json();
        console.log(data.length);
        $(".bus-stops").empty();
        if (data.length > 0) {
            data.forEach(function (stop) {
                $(".bus-stops").append(`
                    <a href="/stop_info.html?BusCode=${stop.BusStopCode}">
                    <article>
                        <h2>${stop.Description}</h2>
                        Code: ${stop.BusStopCode}<br>
                        Road: ${stop.RoadName}
                    </article>
                    </a>
                    `)
            })
        }
        console.log(response);
    } else {
        let err = await response.json();
        console.log(err.message);
    }
}