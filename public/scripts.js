const app = document.getElementById('root')
const container = document.createElement('div')
container.setAttribute('class', 'container')
app.appendChild(container)

fetch('weather', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}).then(res => res.json()).then(data => {
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
            highTempTxt.textContent = dataPt.temperatureHigh

            const lowTempTxt = document.createElement('p')
            lowTempTxt.textContent = dataPt.temperatureLow

            container.appendChild(card)
            card.appendChild(dateTxt)
            card.appendChild(iconTxt)
            card.appendChild(highTempTxt)
            card.appendChild(lowTempTxt)
        })
    })