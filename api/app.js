// Base backend code for Say Something

// initialize firebase
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

// initialize app
const express = require('express')
const cors = require('cors')
const http = require('http')

const app = express()
const server = http.createServer(app)
app.use(express.json());
app.use(cors());

const port = 5200
const randomstring = require('randomstring')

// initialize socket io
const socket = require('socket.io')
const io = new socket.Server(server, {
    transports: ["websocket", "polling"],
    cors: {
        origin: "https://say.bootletools.com"
    }
})

// print information about connection errors
io.engine.on("connection_error", (err) => {
    console.log(err);
});

// utility functions
async function pollIdIsTaken(pollId) {
    // returns true if the poll id already exists, false if not
    const ref = fbDatabase.ref(db, `polls/${pollId}`) // get database reference to poll
    const snapshot = await fbDatabase.get(ref) // get the snapshot
    if (snapshot.exists()) { // determine if the data exists
        return true
    } else {
        return false
    }
}

// a test path for the api
app.get('/', (req, res) => {
    res.send('API ONLINE')
})

// the path to generate a new poll
app.post('/new-poll', async (req, res) => {
    let { adjective, topic } = req.body;

    // generate new poll id and verify that it is unique
    let pollId = randomstring.generate(4)
    pollId = pollId.toLowerCase();
    while (await pollIdIsTaken(pollId)) {
        let pollId = randomstring.generate(4)
        pollId = pollId.toLowerCase();
    }

    try {
        // add the new poll to the database
        await fbDatabase.set(fbDatabase.ref(db, 'polls/' + pollId), {
            adjective,
            topic,
            created: Date.now()
        })

        // send response
        res.json({
            "success": true,
            "pollId": pollId
        })
    }
    catch {
        // if something went wrong, send response
        res.status(500).json({
            "success": false
        })
    }
})

// fetch a poll given a poll id
app.post('/fetch-poll', async (req, res) => {
    let { pollId } = req.body;

    try {
        // get poll data from the database
        let snapshot = await fbDatabase.get(fbDatabase.child(fbDatabase.ref(db), `polls/${pollId}`))
        if (snapshot.exists()) {
            // if the poll exists, send the data back in the response
            let data = snapshot.val()
            res.json({
                "success": true,
                "poll": {
                    "adjective": data.adjective,
                    "topic": data.topic,
                }
            })
        } else {
            // if the data doesn't exist, send that back in the response
            res.json({
                "success": false,
                "exists": false
            })
        }
    } catch {
        // if something went wrong, send response
        res.status(500).json({
            "success": false
        })
    }
})

// generates a new opinion
app.post('/new-opinion', async (req, res) => {
    let { text, pollId } = req.body;

    // create opinion object
    let opinion = {
        text,
        created: Date.now()
    }

    try {
        // access list of opinions in the database
        let opinionList = fbDatabase.ref(db, 'opinions/' + pollId)

        // create the new opinion
        let newOpinion = fbDatabase.push(opinionList)
        await fbDatabase.set(newOpinion, opinion)

        // send response
        res.json({
            "success": true
        })
    }
    catch {
        // if something went wrong, send response
        res.status(500).json({
            "success": false
        })
    }

    // update connected clients for realtime updates
    io.to(pollId).emit('new-opinion', opinion)
})

// get a list of opinions belonging to a specific poll from the database
app.post('/fetch-opinions', async (req, res) => {
    let { pollId } = req.body;
    
    try {
        // access the list of opinions belonging to the given poll in the database
        let snapshot = await fbDatabase.get(fbDatabase.child(fbDatabase.ref(db), `opinions/${pollId}`))
        if (snapshot.exists()) {
            // if the data exists, send response with the response body containing the opinion data
            let data = snapshot.val()
            res.json({
                "success": true,
                "opinions": data
            })
        } else {
            // if the data doesn't exist, send response
            res.json({
                "success": true,
                "exists": false
            })
        }
    } catch {
        // if something went wrong, send response
        res.status(500).json({
            "success": false
        })
    }
})

// socket.io code
io.on('connection', (socket) => {
    // when new poll pages are loaded, they will emit 'poll-connection' and their poll id
    // add them to a room that is the poll id, so that opinion updates can be sent to specific poll ids
    socket.on('poll-connection', (pollId) => {
        socket.join(pollId);
    })
})

// start server
server.listen(port, () => {
    console.log(`App listening on ${port}`)
})