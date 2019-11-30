const warningBell = document.getElementById("warning-bell")
const watchBell = document.getElementById("watch-bell")
const advisoryBell = document.getElementById("advisory-bell")
const warningModal = document.getElementById("warning-modal")
const watchModal = document.getElementById("watch-modal")
const advisoryModal = document.getElementById("advisory-modal")

const noForecastHdr = document.getElementById("no-forecast-header")
const forecastCarousel = document.getElementById("forecast-carousel")

fetch('testData/testdata.json', {        // Use for testing
//fetch('weather', {            // Use for production
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
        alerts.forEach(alert => {
            // Set alert modal content
            const alertModalContent = document.createElement('div')
            alertModalContent.className = "modal-content"
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

            // Set alert modal and alert-header based on severity
            if (alert.severity == "advisory"){
                alertModalContent.style.borderColor = "yellow"
                advisoryBell.style.display = 'block'
                advisoryModal.appendChild(alertModalContent)
                advisoryModal.style.display = 'block'
            } 
            else if (alert.severity == "watch"){
                alertModalContent.style.borderColor = "darkorange"
                watchBell.style.display = 'block'
                watchModal.appendChild(alertModalContent)
                watchModal.style.display = 'block'
            }
            else if (alert.severity == "warning"){
                alertModalContent.style.borderColor = "red"
                warningBell.style.display = 'block'
                warningModal.appendChild(alertModalContent)
                warningModal.style.display = 'block'
            }

        })
    }
    else {
        while(advisoryModal.lastChild) advisoryModal.removeChild(advisoryModal.lastChild)
        while(watchModal.lastChild) watchModal.removeChild(watchModal.lastChild)
        while(warningModal.lastChild) warningModal.removeChild(warningModal.lastChild)

        advisoryModal.style.display = 'none'
        watchModal.style.display = 'none'
        warningModal.style.display = 'none'
        advisoryBell.style.display = 'none'
        watchBell.style.display = 'none'
        warningBell.style.display = 'none'
    }
}

function showAlertBell(alertBell){
    if (alertBell == advisoryBell) advisoryModal.style.display = 'block'
    else if(alertBell == watchBell) watchModal.style.display = 'block'
    else if (alertBell == warningBell) watchModal.style.display = 'block'
}

function setForecast(data){
    if (data != null){
        forecastCarousel.style.display = "block"
        noForecastHdr.style.display = "none"
        const skycon = new Skycons({color: 'white'})
        data.forEach(dataPt => {
            // Create card
            const card = document.createElement('div')
            card.className = "card"

            const dateTxt = document.createElement('h1')
            dateTxt.className = "card-day"
            dateTxt.textContent = convertDay(dataPt.time)

            const icon = document.createElement('canvas')
            icon.height = 200   // have to set before canvas is used
            skycon.set(icon, dataPt.icon)
            skycon.play()

            const tempBlock = document.createElement('div')
            tempBlock.className = "temp-block"

            const highTempTxt = document.createElement('p')
            highTempTxt.className = "card-data temp-block-item"
            highTempTxt.textContent = "High " + Math.round(dataPt.temperatureHigh) + "\u00B0F"

            const lowTempTxt = document.createElement('p')
            lowTempTxt.className = "card-data temp-block-item"
            lowTempTxt.textContent = "Low " + Math.round(dataPt.temperatureLow) + "\u00B0F"

            const moreInfoBtn = document.createElement('button')
            moreInfoBtn.className = "more-info-btn"
            moreInfoBtn.textContent = "More Info..."

            card.appendChild(dateTxt)
            card.appendChild(icon)
            tempBlock.appendChild(highTempTxt)
            tempBlock.appendChild(lowTempTxt)
            card.appendChild(tempBlock)
            card.append(moreInfoBtn)
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
                adaptiveHeight: true,
                variableWidth: true
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
    if (event.target.className == "modal") {
        event.target.style.display = "none"
    }
}

// Converts and returns UNIX time (sec) into a Date string
function convertDate(unixDate){
    var dateObj = new Date(unixDate * 1000)
    return dateObj.toLocaleString()
}

// Converts and returns UNIX time (sec) as a Day string (e.g. Monday)
function convertDay(unixDate){
    var dateObj = new Date(unixDate * 1000)
    var today = new Date()
    if (dateObj.getDate() == today.getDate()) return "Today"
    switch (dateObj.getDay()){
        case 0:
            return "Sunday"
        case 1:
            return "Monday"
        case 2:
            return "Tuesday"
        case 3:
            return "Wednesday"
        case 4:
            return "Thursday"
        case 5:
            return "Friday"
        case 6:
            return "Saturday"
    }
}