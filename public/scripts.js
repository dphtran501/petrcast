const app = document.getElementById('root')

const appLogo = document.createElement('h1')
appLogo.setAttribute('class', 'app-logo')
appLogo.textContent = "PetrCast"

const alertDialog = document.createElement('div')
alertDialog.setAttribute('class', 'alert-dialog')
alertDialog.style.display = 'none'

const container = document.createElement('div')
container.setAttribute('class', 'container')

const darkskyAttribution = document.createElement('a')
darkskyAttribution.setAttribute('class', 'darksky-logo')
darkskyAttribution.href = "https://darksky.net/poweredby/"
darkskyAttribution.text = "Powered by Dark Sky"

const alertModal = document.createElement('div')
alertModal.setAttribute('class', 'modal')
alertModal.style.display = 'none'

app.appendChild(appLogo)
app.appendChild(alertDialog)
app.appendChild(container)
app.appendChild(darkskyAttribution)

app.appendChild(alertModal)

//fetch('testdata.json', {        // Use for testing
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
    var dailyBlock = data.daily

    dailyBlock.data.forEach(dataPt => {
        // Create card
        const card = document.createElement('div')
        card.setAttribute('class', 'card')

        const dateTxt = document.createElement('h1')
        dateTxt.textContent = convertDate(dataPt.time)

        const icon = document.createElement('canvas')
        icon.width = 100
        icon.height = 100
        const skycon = new Skycons({color: 'black'})
        skycon.set(icon, dataPt.icon)
        skycon.play()

        /*const iconTxt = document.createElement('p')
        iconTxt.textContent = dataPt.icon*/

        const highTempTxt = document.createElement('p')
        highTempTxt.textContent = "High Temp.: " + dataPt.temperatureHigh

        const lowTempTxt = document.createElement('p')
        lowTempTxt.textContent = "Low Temp.: " + dataPt.temperatureLow

        container.appendChild(card)
        card.appendChild(dateTxt)
        card.appendChild(icon)
        //card.appendChild(iconTxt)
        card.appendChild(highTempTxt)
        card.appendChild(lowTempTxt)
        
    })

    // Init slick carousel
    $(document).ready(function(){
        $('.container').slick({
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