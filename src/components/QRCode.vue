<script>

import QrCreator from 'qr-creator'

export default {
    props: {
        text: String,
        size: Number
    },
    mounted() {
        QrCreator.render({
            text: this.text,
            radius: 0.5,
            ecLevel: 'M',
            fill: '#000000',
            background: null,
            size: this.size,
        }, this.$refs.qrBox)
    }
}

</script>

<template>
    <div ref="qrBox" id="qr-box"></div>
</template>

<style>
    
</style>