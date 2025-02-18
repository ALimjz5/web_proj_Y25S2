 $(async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const dataVal = urlParams.get("BusCode");
    let response = await fetch(`/api/bus-arrival?busStopCode=${dataVal}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.token}`
        }
    });
    if(response.ok) {
        let data = await response.json();
        data.Services.forEach(function (service){
            var currentTime = new Date();
            var arrTime1 = new Date(service.NextBus.EstimatedArrival);
            var arrTime2 = new Date(service.NextBus2.EstimatedArrival);
            var arrTime3 = new Date(service.NextBus3.EstimatedArrival);

            var timeFromNow1 = Math.floor(((arrTime1 - currentTime) / 1000) / 60);
            var timeFromNow2 = Math.floor(((arrTime2 - currentTime) / 1000) / 60);
            var timeFromNow3 = Math.floor(((arrTime3 - currentTime) / 1000) / 60);

            console.log(timeFromNow2);

            $(".stop-info").append(`
                <article>
                    <h2>Bus ${service.ServiceNo}</h2><br>
                    <div>
                        <h2>Next Buses(Minutes)</h2> <br> 
                        ${timeFromNow1 > 0 ? timeFromNow1 : timeFromNow1 < -1 ? 'Left' : 'Arriving'}
                        ${timeFromNow2 > 0 ? timeFromNow2 : timeFromNow2 < -1 ? 'Left' : Number.isNaN(timeFromNow2) ? 'Unavailable' : 'Arriving'}
                        ${timeFromNow3 > 0 ? timeFromNow3 : 'Unavailable'}
                    </div>
                </article>
                `)
        })
    }

 })
