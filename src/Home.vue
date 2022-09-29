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
    }
}
</script>

<template>
    <section id="home-container">
        <input-box/>
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
</style>