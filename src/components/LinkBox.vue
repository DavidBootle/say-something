<script>

export default {
    props: {
        linkText: String
    },
    methods: {
        copyLink() {
            let e = this.$refs.linkText
            console.log(e)

            var range, selection;

            if (window.getSelection && document.createRange) {
                selection = window.getSelection();
                range = document.createRange();
                range.selectNodeContents(e);
                selection.removeAllRanges();
                selection.addRange(range);
            } else if (document.selection && document.body.createTextRange) {
                range = document.body.createTextRange();
                range.moveToElementText(e);
                range.select();
            }

            navigator.clipboard.writeText(e.innerHTML)
        }
    }
}

</script>

<template>
    <div class="link-container">
        <div class="link-text-box" @click="copyLink">
            <span class="link-text" ref="linkText">{{ linkText }}</span>
        </div>
        <p>Click the Link to Copy</p>
    </div>
</template>

<style scoped>

.link-container {
    background-color: #EEE;
    padding: 1rem 2rem;
    border-radius: 0.8rem;
    font-family: sans-serif;
}

.link-text-box {
    border-radius: 0.5rem;
    outline: none;
    border: none;
    box-shadow: #CCC 2px 2px;
    height: 2rem;
    font-size: 1rem;
    text-align: center;
    background-color: rgb(250, 250, 250);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1.5rem;

    transition: box-shadow 0.2s linear;
}

.link-text-box:hover, .link-text-box:focus {
    box-shadow: #AAA 4px 4px;
}

.link-text {
    font-size: 1rem;
    font-family: monospace;
    text-decoration: underline;

    transition: color 0.2s linear;
}

.link-text:hover, .link-text:focus {
    color: darkblue;
    font-weight: bold;
}

p {
    margin: 0.5rem 0 0 0;
    padding: 0;
    text-align: center;
    font-size: 0.8rem;
}

</style>