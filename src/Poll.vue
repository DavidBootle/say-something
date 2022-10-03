<script>

import SaySomethingBox from './components/SaySomethingBox.vue'
import LoadingIcon from './components/LoadingIcon.vue'
import Error from './components/Error.vue'

export default {
    components: {
        'say-something-box': SaySomethingBox,
        'loading-icon': LoadingIcon,
        'error': Error,
    },
    data() {
        return {
            backendURL: import.meta.env.VITE_BACKEND_URL,
            pollId: this.$route.params.id,
            poll: null,
            loaded: false,
            error: false,
            errorMessage: 'The page failed to load.',
            opinions: []
        }
    },
    methods: {
        async fetchPollData() {
            // fetch poll info
            try {
                let response = await fetch(this.backendURL + '/fetch-poll', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        pollId: this.pollId
                    })
                })
                if (!response.ok) {
                    this.loaded = true
                    this.error = true
                    return
                }
                let data = await response.json()
                if (data.success) {
                    this.poll = data.poll
                } else if (!data.exists) {
                    // push error 404 page
                    this.$router.push({
                        name: "NotFound",
                        params: { pageParams: this.$route.path.substring(1).split('/') },
                        query: this.$route.query,
                        hash: this.$route.hash
                    })
                } else {
                    this.loaded = true
                    this.error = true
                    return
                }

                response = await fetch(this.backendURL + '/fetch-opinions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pollId: this.pollId
                    })
                })

                if (!response.ok) {
                    this.loaded = true
                    this.error = true
                    return
                }

                data = await response.json()
                if (data.success) {
                    // turn \n into <br/>
                    let opinions = []
                    if (data.opinions) {
                        for (let opinion of Object.values(data.opinions)) {
                            console.log(opinion)
                            opinions.push(opinion.text.replace(/[\n\r]/g, '<br/>'))
                        }
                        this.opinions = opinions
                    }
                    this.loaded = true
                    this.error = false
                } else if (!data.exists) {
                    this.opinions = []
                } else {
                    this.loaded = true
                    this.error = true
                    return
                }
            } catch {
                this.loaded = true;
                this.error = true;
            }
        }
    },
    mounted() {
        this.fetchPollData()
    }
}

</script>

<template>

<section id="page-container">
    <div v-if="loaded && !error">
        <a href="/" class="make-your-own-container">
            <span>Make Your Own Poll</span>
        </a>
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