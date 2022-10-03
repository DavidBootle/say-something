// Base backend code for Say Something

const fb = require('firebase/app')
const fbDatabase = require('firebase/database')
const firebaseConfig = {
    apiKey: "AIzaSyBntLjEyh3NtzhdtoYs_wxxlYWEAkG5q9Y",
    authDomain: "say-something-90ba7.firebaseapp.com",
    databaseURL: "https://say-something-90ba7-default-rtdb.firebaseio.com",
    projectId: "say-something-90ba7",
    storageBucket: "say-something-90ba7.appspot.com",
    messagingSenderId: "349334457928",
    appId: "1:349334457928:web:8bff72e977d1f0d466127d",
    measurementId: "G-P4H0RNN28W"
};
const firebaseApp = fb.initializeApp(firebaseConfig)
const db = fbDatabase.getDatabase(firebaseApp)

const express = require('express')
const cors = require('cors')
const http = require('http')

const app = express()
const server = http.createServer(app)
app.use(express.json());
app.use(cors());

const socket = require('socket.io')
const io = new socket.Server(server)

const port = 5200
const fs = require('fs/promises')
const randomstring = require('randomstring')

async function pollIdIsTaken(pollId) {
    const ref = fbDatabase.ref(db, `polls/${pollId}`) // get database reference to poll
    const snapshot = await fbDatabase.get(ref) // get the snapshot
    if (snapshot.exists()) { // determine if the data exists
        return true
    } else {
        return false
    }
}

app.get('/', (req, res) => {
    res.send('API ONLINE')
})

app.post('/new-poll', async (req, res) => {
    let { adjective, topic } = req.body;

    let pollId = randomstring.generate(4)
    pollId = pollId.toLowerCase();
    while (await pollIdIsTaken(pollId)) {
        let pollId = randomstring.generate(4)
        pollId = pollId.toLowerCase();
    }

    try {
        await fbDatabase.set(fbDatabase.ref(db, 'polls/' + pollId), {
            adjective,
            topic,
            created: Date.now()
        })

        res.json({
            "success": true,
            "pollId": pollId
        })
    }
    catch {
        res.status(500).json({
            "success": false
        })
    }
})

app.post('/fetch-poll', async (req, res) => {
    let { pollId } = req.body;

    try {
        let snapshot = await fbDatabase.get(fbDatabase.child(fbDatabase.ref(db), `polls/${pollId}`))
        if (snapshot.exists()) {
            let data = snapshot.val()
            res.json({
                "success": true,
                "poll": {
                    "adjective": data.adjective,
                    "topic": data.topic,
                }
            })
        } else {
            res.json({
                "success": false,
                "exists": false
            })
        }
    } catch {
        res.status(500).json({
            "success": false
        })
    }
})

app.post('/new-opinion', async (req, res) => {
    let { text, pollId } = req.body;

    let opinion = {
        text,
        created: Date.now()
    }

    try {
        let opinionList = fbDatabase.ref(db, 'opinions/' + pollId)
        let newOpinion = fbDatabase.push(opinionList)
        await fbDatabase.set(newOpinion, opinion)

        res.json({
            "success": true
        })
    }
    catch {
        res.status(500).json({
            "success": false
        })
    }

    // attempt to send socket update to connected clients
    io.to(pollId).emit('new-opinion', opinion)
})

app.post('/fetch-opinions', async (req, res) => {
    let { pollId } = req.body;
    
    try {
        let snapshot = await fbDatabase.get(fbDatabase.child(fbDatabase.ref(db), `opinions/${pollId}`))
        if (snapshot.exists()) {
            let data = snapshot.val()
            res.json({
                "success": true,
                "opinions": data
            })
        } else {
            res.json({
                "success": true,
                "exists": false
            })
        }
    } catch {
        res.status(500).json({
            "success": false
        })
    }
})

io.on('connection', (socket) => {
    socket.on('poll-connection', (pollId) => {
        socket.join(pollId);
    })
})

server.listen(port, () => {
    console.log(`App listening on ${port}`)
})