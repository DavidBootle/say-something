<script>

export default {
    data() {
        return {
            backendURL: import.meta.env.VITE_BACKEND_URL,
            pollId: this.$route.params.id,
            poll: null,
            loaded: false,
            error: false,
        }
    },
    methods: {
        async fetchPollData() {
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
                this.loaded = true
                this.error = false
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
        <div class="topic-box-container">
            <h1 class="page-title">Say Something <strong>{{ poll.adjective }}</strong> About <strong>{{ poll.topic }}</strong></h1>
            <textarea id="opinion-input"></textarea>
        </div>
    </div>
</section>

</template>

<style scoped>

.page-title {
    text-align: center;
    font-family: sans-serif;
    font-size: 3rem;
    margin: 0;
}

.topic-box-container {
    margin: 2rem auto;
    background-color: #EEE;
    padding: 2rem;
    border-radius: 1rem;
    max-width: 60rem;
}

.topic-box-container textarea {
    margin: 1.5rem 0 0 0;
    border-radius: 0.5rem;
    min-height: 6rem;
    resize: none;
    font-size: 1rem;
    width: 100%;
    font-family: sans-serif;
    padding: 1rem;
    box-sizing: border-box;
    text-align: center;
}

@media screen and (max-width: 1050px) {
    .topic-box-container {
        margin: 0.5rem;
    }
    .topic-box-container textarea {
        padding: 0.5rem 0.2rem;
    }
}

</style>