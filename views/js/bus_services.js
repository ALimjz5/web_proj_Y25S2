$(async function () {
    let response = await fetch(BUS_SERV, {
        method: "GET",
    });
    let destResponse = await fetch(BUS_STOP, {
        method: "GET",
    });
    if (response.ok && destResponse.ok) {
        let data = await response.json();
        let destData = await destResponse.json();

        let destDescriptions = {};
        destData.forEach(function (stop) {
            destDescriptions[stop.BusStopCode] = stop.Description;
        });

        console.log(data);

        data.forEach(function (service) {
            let finalDescription = destDescriptions[service.DestinationCode];
            if (finalDescription != undefined) {
                $(".bus-services").append(`
                    <article>
                        <h2>${service.ServiceNo}</h2>
                        <div>
                            Towards ${finalDescription}
                        </div>
                    </article>
                    `);
            }

        })
    } else {
        let err = await response.json();
        console.log(err.message);
    }

    $("#searchService").on("submit", searchService);
})

async function searchService(e) {
    e.preventDefault();
    let serviceEntries = document.getElementById("serviceInput").value;
    console.log(serviceEntries);
    let response = await fetch(`${BUS_SERV}?search=${serviceEntries}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.token}`
        }
    });
    let destResponse = await fetch(BUS_STOP, {
        method: "GET",
    });
    if (response.ok && destResponse.ok) {
        let destData = await destResponse.json();
        let data = await response.json();

        let destDescriptions = {};
        destData.forEach(function (stop) {
            destDescriptions[stop.BusStopCode] = stop.Description;
        });

        console.log(data.length);
        console.log(data);
        $(".bus-services").empty();
        if (data.length > 0) {
            data.forEach(function (service) {
                console.log(service);
                    let finalDescription = destDescriptions[service.DestinationCode];
                    if (finalDescription != undefined) {
                        $(".bus-services").append(`
                            <article>
                                <h2>${service.ServiceNo}</h2>
                                <div>
                                    Towards ${finalDescription}
                                </div>
                            </article>
                            `);
                    }
            })
        }
        console.log(response);
    } else {
        let err = await response.json();
        console.log(err.message);
    }
}