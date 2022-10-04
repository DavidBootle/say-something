<script>

export default {
    props: {
        alertTitle: String
    }
}

</script>

<template>
    <div class="error-alert-box">
        <h4 class="alert-text">{{ alertTitle }}</h4>
        <p class="alert-body"><slot></slot></p>
    </div>
</template>

<style scoped>

div.error-alert-box {
    background-color: #FFCCCC;
    border: 3px solid #fa5f5f;
    border-radius: 1rem;
    padding: 1rem;
    margin-bottom: 1rem;
}
h4.alert-text {
    font-family: sans-serif;
    margin: 0.5rem 0 0 0;
    padding: 0;
}

p.alert-body {
    font-family: sans-serif;
    margin: 0 0 0.4rem 0;
    padding: 0;
}

</style>