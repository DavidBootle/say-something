<script>

export default {
    data() {
        return {
            adjective: '',
            topic: '',
            backendURL: import.meta.env.VITE_BACKEND_URL,
            buttonDisabled: false,
            adjectivePlaceholder: '',
            topicPlaceholder: ''
        }
    },
    methods: {
        async createPoll() {
            // disable submit button
            this.buttonDisabled = true;
            try {

                // input handling
                // if no input was given, use the placeholder values
                if (this.adjective == '') {
                    this.adjective = this.adjectivePlaceholder
                }
                if (this.topic == '') {
                    this.topic = this.topicPlaceholder
                }

                // send request to create a new poll
                let response = await fetch(this.backendURL + '/new-poll', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        adjective: this.adjective,
                        topic: this.topic
                    })
                })
                if (!response.ok) {
                    // if something went wrong with the response
                    alert("Something went wrong.")
                }
                let body = await response.json()
                if (body.success) {
                    // if the poll was created successfully, redirect to the poll
                    this.$router.push(`/poll/${body.pollId}`)
                } else {
                    // if there was a server error
                    alert("Poll failed to create.")
                }
            } catch {
                // if something went wrong with the code
                alert("Something went wrong.")
            } finally {
                // reenable the submit button after the code has been run
                this.buttonDisabled=false;
            }
        }
    },
    mounted() {
        const adjectivePlaceholders = [
            'Interesting',
            'Cool',
            'Intriguing',
            'Factual',
            'Fun',
            'True',
            'You Like',
            'You Dislike',
            'Nice'
        ]
        this.adjectivePlaceholder = adjectivePlaceholders[Math.floor(Math.random() * adjectivePlaceholders.length)]

        const topicPlaceholders = [
            'The United States',
            'Jeff',
            'Pretzels',
            'Old Cars',
            'Gazebos',
            'Sports Drinks',
            "Last Night's Game",
            'College',
            'High School',
            'Star Wars',
            'Computers',
            'Society'
        ]
        this.topicPlaceholder = topicPlaceholders[Math.floor(Math.random() * topicPlaceholders.length)]
    }
}

</script>

<template>
    <div class="input-box">
        <h1>Say Something</h1>
        <input type="text" v-model="adjective" :placeholder="adjectivePlaceholder"/>
        <h2>About</h2>
        <input type="text" v-model="topic" :placeholder="topicPlaceholder"/>
        <button @click="createPoll" :disabled="buttonDisabled">Create Poll</button>
    </div>
</template>

<style scoped>

.input-box {
    background-color: #EEE;
    padding: 2rem;
    border-radius: 1.5rem;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    
    width: 18rem;

    font-family: sans-serif;
}

.input-box h1 {
    margin: 0 0 0.5rem 0;
    padding: 0;
}

.input-box h2 {
    margin: 1.2rem 0 0.5rem 0;
}

.input-box input {
    border-radius: 0.5rem;
    outline: none;
    border: none;
    box-shadow: #CCC 2px 2px;
    height: 2rem;
    font-size: 20px;
    text-align: center;

    transition: box-shadow 0.2s linear;
}

.input-box input:hover, .input-box input:focus {
    box-shadow: #AAA 4px 4px;
}

.input-box button {
    margin: 2rem 0 -0.5rem 0;
    background-color: #7CC6FE;
    padding: 0.4rem 1rem;
    box-shadow: 0 0 0 0.2rem transparent;
    border: none;
    border-radius: 0.2rem;
    font-size: 15px;
    font-weight: bold;

    transition: box-shadow 0.1s linear;
}

.input-box button:hover, .input-box button:focus-visible {
    box-shadow: 0 0 0 0.2rem #AAA;
}

.input-box button:active {
    box-shadow: 0 0 0 0.3rem #999;
}

</style>