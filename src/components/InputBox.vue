<script>

</script>

<template>
    <div class="input-box">
        <h1>Say Something</h1>
        <input type="text"/>
        <h2>About</h2>
        <input type="text"/>
    </div>
</template>

<style>

.input-box {
    background-color: #EEE;
    padding: 2rem;
    border-radius: 1.5rem;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    
    width: 18rem;
    margin: 0 auto;

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

</style>