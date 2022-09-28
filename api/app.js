// Base backend code for Say Something

const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json());
app.use(cors());

const port = 5200
const fs = require('fs/promises')

app.get('/', (req, res) => {
    res.send('API ONLINE')
})

app.post('/new-poll', async (req, res) => {
    let { adjective, topic } = req.body;
    console.log(`Received request to create a new post: Say Something ${adjective} About ${topic}`);
    res.json({
        "success": true
    })
})

app.listen(port, () => {
    console.log(`App listening on ${port}`)
})