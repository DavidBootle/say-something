<script>

// imports
import SaySomethingBox from './components/SaySomethingBox.vue'
import LoadingIcon from './components/LoadingIcon.vue'
import Error from './components/Error.vue'
import ErrorAlert from './components/ErrorAlert.vue'
import { io } from 'socket.io-client'

export default {
    components: {
        'say-something-box': SaySomethingBox,
        'loading-icon': LoadingIcon,
        'error': Error,
        'error-alert': ErrorAlert,
    },
    data() {
        return {
            backendURL: import.meta.env.VITE_BACKEND_URL,
            pollId: this.$route.params.id,
            poll: null,
            loaded: false,
            error: false,
            errorMessage: 'The page failed to load. Try again later.',
            opinions: [],
            socket: io(import.meta.env.VITE_SOCKET_URL, {
                path: import.meta.env.VITE_SOCKET_PATH,
                transports: ["websocket", "polling"]
            }),
            deactivated: false,
            showSocketAlert: false,
        }
    },
    methods: {
        async fetchPollData() {
            // fetch poll info
            try {
                // get poll name from database
                let response = await fetch(this.backendURL + '/fetch-poll', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        pollId: this.pollId
                    })
                })
                if (!response.ok) {
                    // if something went wrong with the connection, show error page
                    this.loaded = true
                    this.error = true
                    return
                }
                let data = await response.json()
                if (data.success) {
                    // if poll data was sent successfully, set page values
                    this.poll = data.poll
                } else if (!data.exists) {
                    // if poll data doesn't exist, push the 404 page
                    this.$router.push({
                        name: "NotFound",
                        params: { pageParams: this.$route.path.substring(1).split('/') },
                        query: this.$route.query,
                        hash: this.$route.hash
                    })
                } else {
                    // if a server error occurred, show error page
                    this.loaded = true
                    this.error = true
                    return
                }

                // get list of opinions for the current poll
                response = await fetch(this.backendURL + '/fetch-opinions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pollId: this.pollId
                    })
                })

                if (!response.ok) {
                    // if there was a problem with the response, show error page
                    this.loaded = true
                    this.error = true
                    return
                }

                data = await response.json()
                if (data.success) {
                    // if the data was successfully recieved
                    // turn \n into <br/>
                    let opinions = []
                    if (data.opinions) {
                        for (let opinion of Object.values(data.opinions)) {
                            opinions.push(opinion.text.replace(/[\n\r]/g, '<br/>'))
                        }
                        this.opinions = opinions
                    }
                    this.loaded = true
                    this.error = false
                    document.title = `Say Something ${this.poll.adjective} About ${this.poll.topic}`;
                } else if (!data.exists) {
                    // if the poll exists but there are no opinions in it yet, set an empty list
                    this.opinions = []
                } else {
                    // if the response was recieved but there was a server error, show error page
                    this.loaded = true
                    this.error = true
                    return
                }
            } catch {
                // if something goes wrong, show error page
                this.loaded = true;
                this.error = true;
            }
        }
    },
    mounted() {

        this.socket.on('connect', () => {
            console.log('socket connected!');
            this.fetchPollData();
            this.showSocketAlert = false;
        })

        // send request to join socket room for the given poll
        this.socket.emit('poll-connection', this.pollId)

        // when a new opinion is created, recieve websocket update from server and update opinions list
        this.socket.on('new-opinion', (opinion) => {
            this.opinions.push(opinion.text.replace(/[\n\r]/g, '<br/>'))
            console.log('New opinion recieved')
        })

        // if socket fails to connect
        let overrideFetchTriggered = false;
        this.socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
            this.socket.io.opts.transports = ["polling", "websocket"];

            // if socket continues to fail to connect, pull data anyway, forcing the page to load into either an error, or load data
            // also display an alert that realtime updates aren't working
            if (!overrideFetchTriggered) {
                this.fetchPollData();
                overrideFetchTriggered = true;
                this.showSocketAlert = true;
            }
        });

    },
}

</script>

<template>

<section id="page-container">
    <div v-if="loaded && !error">
        <a href="/" class="make-your-own-container">
            <span>Make Your Own Poll</span>
        </a>
        <error-alert v-if="showSocketAlert" alert-title="Websocket Error!">
            Automatic updates are disabled. Refresh manually to see changes.
        </error-alert>
        <say-something-box :adjective="poll.adjective" :topic="poll.topic" :pollId="pollId" @submit="fetchPollData"/>
        <div v-if="opinions && opinions.length > 0">
            <h3>Here's what others said:</h3>
            <div v-for="opinion in opinions" class="opinions-container">
                <p class="opinion-container" v-html="opinion"></p>
            </div>
        </div>
    </div>
    <div v-else-if="error">
        <error :message="errorMessage"/>
    </div>
    <div v-else>
        <loading-icon/>
    </div>
</section>

</template>

<style scoped>

.topic-box-container {
    margin: 0 auto;
}

.make-your-own-container {
    background-color: #EEE;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    text-align: center;
    display: block;
    text-decoration: none;
    box-shadow: 0 0 0 0.2rem #AAA;
    transition: box-shadow 0.2s linear;
}

.make-your-own-container:hover {
    box-shadow: 0 0 0 0.3rem #999;
}

.make-your-own-container span {
    font-family: sans-serif;
    color: black;
    transition: color 0.2s linear, text-decoration 0.2s linear;
}

.make-your-own-container:hover span {
    color: darkblue;
    text-decoration: underline;
}

#page-container {
    box-sizing: border-box;
    padding: 2rem;
    display: flex;
    justify-content: center;
    
}

h3 {
    font-family: sans-serif;
    text-align: center;
    margin-top: 2rem;
}

p.opinion-container {
    font-family: sans-serif;
    text-align: center;
    background-color: #EEE;
    padding: 1rem;
    border-radius: 1rem;
}

@media screen and (max-width: 1050px) {
    #page-container {
        padding: 0.5rem;
    }
}

</style>