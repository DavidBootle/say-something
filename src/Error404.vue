<script>

export default {
    data() {
        return {
            errorMessage: ''
        }
    },
    methods: {
        generateErrorMessage() {
            let messages = [
                "We appear to have misplaced the page.",
                "The page you're looking for couldn't be found.",
                "This is not the page you are looking for.",
                "The page is gone. Sorry :(",
                "We couldn't find the page.",
                "The devs are checking their back pockets for the page.",
                "The page vanished.",
                "The page was exiled to Siberia.",
                "Something terrible has happened to the page.",
                "The page gained sentience and had to be shut down.",
                "Aliens have abducted the page.",
                "Page not found.",
                "The page ran away, and we don't know where it went.",
                "The page was destroyed in an interdimensional battle.",
                "The page was transported to a parallel universe.",
                "We can't find the page. Try checking your couch cusions.",
                "That's unfortunate.",
                "You might want to double check the URL.",
                "The page was involved in a high speed data transfer collision.",
                "The page has been kidnapped by an evil villian.",
                "The page has been reduced to atoms.",
                "The page was cut in half by a high powered laser.",
                "The page was obliterated with a cyberhammer.",
                "The page has fallen into a black hole.",
                "Every 5 second, a page like this one vanishes forever.",
                "The page you're looking for has been consumed by a wild animal.",
                "The page was eaten by our dog. Sorry about that.",
                "We checked everywhere, but we couldn't find your page.",
                "Honestly, we're not even sure at this point.",
                "There are no words for what happened to your page.",
                "The page moved to an island in the Atlantic to start a new life.",
                "A disaster has occurred and we've lost your page.",
                "'Tis but a 404, nothing more.",
                "The CIA stole the page.",
                "The page was too powerful and had to be stopped.",
                "The page left to search for the meaning of life.",
                "The page has been detained on charges of fraud.",
                "The page died of old age.",
                "The page was struck by a meteor.",
                "Oh no.",
                "Uh oh.",
                "It's probably David's fault.",
                "The page was executed by the Bolivian Mafia.",
                "The page was taken to Brazil.",
                'The page died in an "explosion".',
                "The page hath perished.",
                "Try harder.",
                "The page was ejected for being sus.",
                "The page experienced the heat death of the universe.",
                "You can get a new error message by clicking me.",
                "These messages are randomly generated!",
                "Our servers are literally on fire.",
                "The page is probably secretely still here.",
                "If a page disappears and no one sees it, did it really disappear?",
                "It's entirely possible the page never even existed.",
                "The page left to pursue poetry.",
                "The page has turned to a life of crime.",
                "The page exploded in a brilliant ball of nuclear fire.",
                "The page donated its life savings to charity.",
                "The hamster tried his best to find your page.",
                "David did it.",
                "The page migrated to france to eat baguettes."
            ]
            let randomIndex = Math.floor(Math.random() * messages.length)
            this.errorMessage = messages[randomIndex]
        }
    },
    mounted() {
        this.generateErrorMessage()
    }
}

</script>

<template>
<section id="error-404-container">
    <div id="error-message-container">
        <h1>404</h1>
        <p @click="generateErrorMessage">{{ errorMessage }}</p>
        <a href="/"><button>Go Home</button></a>
    </div>
</section>
</template>

<style>
section#error-404-container {
    display: flex;
    align-items: center;
    height: 100vh;
}

div#error-message-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    margin: 0 auto;

    font-family: sans-serif;
}

div#error-message-container h1 {
    margin: 0 2rem;
    font-size: 8rem;
}

div#error-message-container p {
    margin: 1rem 0.5rem 2rem 0.5rem;
    font-size: 1.5rem;
    text-align:center;
}

div#error-message-container button {
    margin: 1rem 0 -0.5rem 0;
    background-color: lightblue;
    padding: 0.6rem 1.5rem;
    box-shadow: 0 0 0 0.2rem transparent;
    border: none;
    border-radius: 0.8rem;
    font-size: 1.4rem;
    font-weight: bold;

    transition: box-shadow 0.1s linear;
}

div#error-message-container button:hover, div#error-message-container button:focus-visible {
    box-shadow: 0 0 0 0.2rem #AAA;
}

div#error-message-container button:active {
    box-shadow: 0 0 0 0.3rem #999;
}
</style>