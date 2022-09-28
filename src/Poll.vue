<script>

export default {
    data() {
        return {
            pollId: this.$route.params.id
        }
    }
}

</script>

<template>

<h1>{{ pollId }}</h1>

</template>

<style>

</style>