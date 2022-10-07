<script>
import InputBox from './components/InputBox.vue'
import LinkBox from './components/LinkBox.vue'

export default {
    components: {
        'input-box': InputBox,
        'link-box': LinkBox
    },
    data() {
        return {
            tempLinkText: ''
        }
    },
    mounted() {
        document.title = 'Say Something'
    }
}
</script>

<template>
    <section id="home-container">
        <object data="/logo.svg" id="logo-svg"></object>
        <input-box/>
        <p class="credit-text">© 2022 David Bootle</p>
    </section>
</template>

<style>
section#home-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    width: 100%;
}

section#home-container > .padding {
    height: 1rem;
}

section#home-container > .column {
    display: flex;
    flex-direction: column;
}

#logo-svg {
    height: 6rem;
    width: 6rem;
    margin-bottom: 1rem;
}

.credit-text {
    font-family: sans-serif;
    font-size: 1rem;
    color: gray;
}
</style>