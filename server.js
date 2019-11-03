// load in environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const API_KEY = process.env.API_KEY
const axios = require('axios')
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('public'))

app.get('/weather', (req, res) => {
    const latitude = 33.6405            // TODO: see if there's a better place to put lat/lon
    const longitude = -117.8443
    const url = `https://api.darksky.net/forecast/${API_KEY}/${latitude},${longitude}`
    axios({
        url: url,
        responseType: 'json'
    }).then(data => res.json(data.data))
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started')
})