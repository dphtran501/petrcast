const alertDialog = document.getElementById("alert-dialog")
const alertModal = document.getElementById("alert-modal")
const noForecastHdr = document.getElementById("no-forecast-header")
const forecastCarousel = document.getElementById("forecast-carousel")

//fetch('testData/testdata.json', {        // Use for testing
fetch('weather', {            // Use for production
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}).then(res => res.json()).then(data => {
       setWeatherData(data)
})

function setWeatherData(data){
    setAlerts(data.alerts)
    setForecast(data.daily.data)
}

function setAlerts(alerts) {
    if(alerts != null) {
        const alertModalContent = document.createElement('div')
        alertModalContent.setAttribute('class', 'modal-content')
        alerts.forEach(alert => {
            // Add alert to alert dialog
            const alertText = document.createElement('p')
            alertText.textContent = alert.severity + ": " + alert.title
            alertDialog.appendChild(alertText)

            // Add alert to modal
            const alertTitle = document.createElement('h1')
            alertTitle.textContent = alert.title
            const alertIssued = document.createElement('h2')
            alertIssued.textContent = "Issued: " + convertDate(alert.time)
            const alertExpires = document.createElement('h2')
            alertExpires.textContent = "Expires: " + convertDate(alert.expires)
            const alertDescription = document.createElement('p')
            alertDescription.textContent = alert.description
            const alertLink = document.createElement('a')
            alertLink.href = alert.uri
            alertLink.text = "See more details..."
            
            alertModalContent.appendChild(alertTitle)
            alertModalContent.appendChild(alertIssued)
            alertModalContent.appendChild(alertExpires)
            alertModalContent.appendChild(alertDescription)
            alertModalContent.appendChild(alertLink)
        })
        
        alertModal.appendChild(alertModalContent)
        alertModal.style.display = 'block'
        alertDialog.style.display = "block"
    }
    else {
        while(alertDialog.lastChild){
            alertDialog.removeChild(alertDialog.lastChild)
        }
        while(alertModal.lastChild){
            alertModal.removeChild(alertModal.lastChild)
        }

        alertModal.style.display = 'none'
        alertDialog.style.display = "none"
    }
}

function setForecast(data){
    if (data != null){
        forecastCarousel.style.display = "block"
        noForecastHdr.style.display = "none"
        const skycon = new Skycons({color: 'black'})
        data.forEach(dataPt => {
            // Create card
            const card = document.createElement('div')
            card.setAttribute('class', 'card')

            const dateTxt = document.createElement('h1')
            dateTxt.textContent = convertDate(dataPt.time)

            const icon = document.createElement('canvas')
            icon.setAttribute("class", "weather-icon")
            skycon.set(icon, dataPt.icon)
            skycon.play()

            const highTempTxt = document.createElement('p')
            highTempTxt.textContent = "High Temp.: " + dataPt.temperatureHigh

            const lowTempTxt = document.createElement('p')
            lowTempTxt.textContent = "Low Temp.: " + dataPt.temperatureLow

            card.appendChild(dateTxt)
            card.appendChild(icon)
            card.appendChild(highTempTxt)
            card.appendChild(lowTempTxt)
            forecastCarousel.appendChild(card)
            
        })

        // Init slick carousel
        $(document).ready(function(){
            $('.forecast-carousel').slick({
                centerMode: true,
                centerPadding: '60px',
                slidesToShow: 3,
                dots: true,
                infinite: false,
                initialSlide: 0,
                adaptiveHeight: true
            });
        });
    }
    else {
        forecastCarousel.style.display = "none"
        noForecastHdr.style.display = "block"
    }
    
}

// Close alert modal by clicking outside box
window.onclick = function(event){
    if (event.target == alertModal) {
        alertModal.style.display = "none"
    }
}

// Converts and returns UNIX time (sec) into a Date string
function convertDate(unixDate){
    var dateObj = new Date(unixDate * 1000)
    return dateObj.toLocaleString()
}