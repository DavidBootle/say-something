// Base backend code for Say Something

const express = require('express')
const { popScopeId } = require('vue')
const app = express()
const port = 5200

app.get('/', (req, res) => {
    res.send('API ONLINE')
})

app.listen(port, () => {
    console.log(`App listening on ${port}`)
})