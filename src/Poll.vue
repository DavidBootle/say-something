<script>

export default {
    data() {
        return {
            backendURL: import.meta.env.VITE_BACKEND_URL,
            pollId: this.$route.params.id,
            poll: null,
            loaded: false,
            error: false
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

<h1>{{ poll }}</h1>

</template>

<style>

</style>