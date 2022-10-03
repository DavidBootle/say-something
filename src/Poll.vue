<script>

import SaySomethingBox from './components/SaySomethingBox.vue'

export default {
    components: {
        'say-something-box': SaySomethingBox
    },
    data() {
        return {
            backendURL: import.meta.env.VITE_BACKEND_URL,
            pollId: this.$route.params.id,
            poll: null,
            loaded: false,
            error: false,
            opinions: []
        }
    },
    methods: {
        async fetchPollData() {
            // fetch poll info
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

        }
    },
    mounted() {
        this.fetchPollData()
    }
}

</script>

<template>

<section id="page-container">
    <div v-if="loaded">
        <say-something-box :adjective="poll.adjective" :topic="poll.topic" :pollId="pollId" @submit="fetchPollData"/>
        <div v-if="opinions">
            <div v-for="opinion in opinions">
                <p v-html="opinion"></p>
            </div>
        </div>
    </div>
</section>

</template>

<style scoped>

#page-container {
    box-sizing: border-box;
    padding: 2rem;
    display: flex;
    justify-content: center;
    
}

@media screen and (max-width: 1050px) {
    #page-container {
        padding: 0.5rem;
    }
}

</style>