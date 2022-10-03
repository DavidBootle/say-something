<script>

export default {
    props: {
        adjective: String,
        topic: String,
        pollId: String
    },
    data() {
        return {
            opinionText: '',
            buttonDisabled: false,
            backendURL: import.meta.env.VITE_BACKEND_URL
        }
    },
    methods: {
        async createOpinion() {
            // disable submit button
            this.buttonDisabled = true;
            try {
                // send request to create new opinion to the database
                let response = await fetch(this.backendURL + '/new-opinion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: this.opinionText,
                        pollId: this.pollId
                    })
                })
                if (!response.ok) {
                    // if something went wrong with the request
                    alert("Something went wrong.");
                    return;
                }
                let data = await response.json();
                if (data.success) {
                    // if the opinion was created properly, send emission to let parent know
                    this.opinionText = '';
                    this.$emit('submit');
                } else {
                    // if the request was recieved but there was a server error
                    alert("Something went wrong.");
                }
            } catch {
                // if there was an error with fetch
                alert("Something went wrong.")
            } finally {
                // reenable submit button after code has been run
                this.buttonDisabled = false;
            }
        }
    }
}

</script>

<template>
    <div class="topic-box-container">
        <h1 class="page-title">Say Something <strong>{{ adjective }}</strong> About <strong>{{ topic }}</strong></h1>
        <textarea id="opinion-input" v-model="opinionText"></textarea>
        <button id="say-it-button" @click="createOpinion" :disabled="buttonDisabled">Say It!</button>
    </div>
</template>

<style>

.page-title {
    text-align: center;
    font-family: sans-serif;
    font-size: 3rem;
    margin: 0;
}

.topic-box-container {
    /* margin: 2rem auto; */
    margin: 0;
    background-color: #EEE;
    padding: 2rem;
    border-radius: 1rem;
    max-width: 60rem;
    text-align: center;
    box-sizing: border-box;
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

button {
    margin: 1.5rem 0 -0.5rem 0;
    background-color: lightblue;
    padding: 0.4rem 1rem;
    box-shadow: 0 0 0 0.2rem transparent;
    border: none;
    border-radius: 0.2rem;
    font-size: 15px;
    font-weight: bold;

    transition: box-shadow 0.1s linear;
}

button:hover, button:focus-visible {
    box-shadow: 0 0 0 0.2rem #AAA;
}

button:active {
    box-shadow: 0 0 0 0.3rem #999;
}

@media screen and (max-width: 1050px) {
    .topic-box-container textarea {
        padding: 0.5rem 0.2rem;
    }
}

</style>