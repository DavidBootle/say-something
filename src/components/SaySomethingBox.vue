<script>

import QRCode from './QRCode.vue'

export default {
    components: {
        'qrcode': QRCode
    },
    props: {
        adjective: String,
        topic: String,
        pollId: String
    },
    data() {
        return {
            opinionText: '',
            buttonDisabled: false,
            backendURL: import.meta.env.VITE_BACKEND_URL,
            showQRCode: false,
            currentURL: window.location.href
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
        },
        toggleQRCode() {
            this.showQRCode = this.showQRCode ? false : true
        }
    }
}

</script>

<template>
    <div class="topic-box-container">
        <h1 class="page-title">Say Something <strong>{{ adjective }}</strong> About <strong>{{ topic }}</strong></h1>
        <textarea id="opinion-input" v-model="opinionText"></textarea>
        <button id="say-it-button" @click="createOpinion" :disabled="buttonDisabled">Say It!</button>
        <span id="openQRModal" @click="toggleQRCode" title="Toggle QR Code" :class="{ active: showQRCode }">
            <svg height="24" width="24"><path d="M13 21v-2h2v2Zm-2-2v-5h2v5Zm8-3v-4h2v4Zm-2-4v-2h2v2ZM5 14v-2h2v2Zm-2-2v-2h2v2Zm9-7V3h2v2ZM4.5 7.5h3v-3h-3ZM3 9V3h6v6Zm1.5 10.5h3v-3h-3ZM3 21v-6h6v6ZM16.5 7.5h3v-3h-3ZM15 9V3h6v6Zm2 12v-3h-2v-2h4v3h2v2Zm-4-7v-2h4v2Zm-4 0v-2H7v-2h6v2h-2v2Zm1-5V5h2v2h2v2ZM5.25 6.75v-1.5h1.5v1.5Zm0 12v-1.5h1.5v1.5Zm12-12v-1.5h1.5v1.5Z"/></svg>
        </span>
        <div v-if="showQRCode" class="qr-container">
            <qrcode :text="currentURL" :size="240"/>
        </div>
    </div>
</template>

<style>

span#openQRModal {
    margin-left: 1rem;
    display: inline;
    vertical-align: middle;
    height: 29px;
    width: 29px;
    display: inline-block;
}

span#openQRModal svg {
    scale: 1.2;
    transition: scale 50ms linear;
    fill: darkgray;
}

span#openQRModal:hover svg, span#openQRModal.active svg {
    scale: 1.5;
    fill: black;
}

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

button#say-it-button {
    margin: 1.5rem 0 -0.5rem 0;
    background-color: #7CC6FE;
    padding: 0.4rem 1rem;
    box-shadow: 0 0 0 0.2rem transparent;
    border: none;
    border-radius: 0.2rem;
    font-size: 15px;
    font-weight: bold;
    color: black;

    transition: box-shadow 0.1s linear;
}

button:hover, button:focus-visible {
    box-shadow: 0 0 0 0.2rem #AAA;
}

button:active {
    box-shadow: 0 0 0 0.3rem #999;
}

.qr-container {
    margin-top: 2rem;
}

@media screen and (max-width: 1050px) {
    .page-title {
        font-size: 1.5rem;
    }

    .topic-box-container textarea {
        padding: 0.5rem 0.2rem;
    }
}

</style>