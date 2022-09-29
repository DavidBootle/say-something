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

const app = express()
app.use(express.json());
app.use(cors());

const port = 5200
const fs = require('fs/promises')
const randomstring = require('randomstring')

app.get('/', (req, res) => {
    res.send('API ONLINE')
})

app.post('/new-poll', async (req, res) => {
    let { adjective, topic } = req.body;

    let pollId = randomstring.generate(8)
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

    try {
        let opinionList = fbDatabase.ref(db, 'opinions/' + pollId)
        let newOpinion = fbDatabase.push(opinionList)
        await fbDatabase.set(newOpinion, {
            text,
            created: Date.now()
        })

        res.json({
            "success": true
        })
    }
    catch {
        res.status(500).json({
            "success": false
        })
    }
})

app.listen(port, () => {
    console.log(`App listening on ${port}`)
})