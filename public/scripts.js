const app = document.getElementById('root')

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

app.appendChild(alertDialog)
app.appendChild(container)
app.appendChild(darkskyAttribution)

app.appendChild(alertModal)

//fetch('testData.json', {        // Use for testing
fetch('weather', {            // Use for production
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}).then(res => res.json()).then(data => {
        setAlerts(data.alerts)
        var dailyBlock = data.daily

        dailyBlock.data.forEach(dataPt => {
            // Create card
            const card = document.createElement('div')
            card.setAttribute('class', 'card')

            const dateTxt = document.createElement('h1')
            var dateObj = new Date(dataPt.time * 1000)
            dateTxt.textContent = dateObj.toUTCString()

            const iconTxt = document.createElement('p')
            iconTxt.textContent = dataPt.icon

            const highTempTxt = document.createElement('p')
            highTempTxt.textContent = "High Temp.: " + dataPt.temperatureHigh

            const lowTempTxt = document.createElement('p')
            lowTempTxt.textContent = "Low Temp.: " + dataPt.temperatureLow

            container.appendChild(card)
            card.appendChild(dateTxt)
            card.appendChild(iconTxt)
            card.appendChild(highTempTxt)
            card.appendChild(lowTempTxt)
        })
    })

    function setAlerts(alerts){
        if(alerts != null){

            const alertModalContent = document.createElement('div')
            alertModalContent.setAttribute('class', 'modal-content')
            const alertTitle = document.createElement('h1')
            alertTitle.textContent = alerts[0].title
            const alertDescription = document.createElement('p')
            alertDescription.textContent = alerts[0].description
            const alertLink = document.createElement('a')
            alertLink.href = alerts[0].uri
            alertLink.text = "See more details..."
            
            alertModalContent.appendChild(alertTitle)
            alertModalContent.appendChild(alertDescription)
            alertModalContent.appendChild(alertLink)

            alertModal.appendChild(alertModalContent)
            alertModal.style.display = 'block'

            alerts.forEach(alert => {
                const alertText = document.createElement('p')
                alertText.textContent = alert.severity + ": " + alert.title
                alertDialog.appendChild(alertText)
            })
            
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