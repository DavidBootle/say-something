<script>
import InputBox from './components/InputBox.vue'

export default {
    components: {
        'input-box': InputBox
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
    height: 100vh;
}
</style>