<script>
import QrcodeVue from 'qrcode.vue'

export default {
    data() {
        return {
            value: 'https://nda-2023.github.io',
            size: 200,
        }
    },
    components: {
        QrcodeVue,
    },
}
</script>
<template>
    <div class="mt-1 d-flex justify-content-center">
        <div class="card p-4 background green">
            <qrcode-vue background="transparent" foreground="white" :value="value" :size="size" level="H" />
            <div class="subtitle">
                <b>Join the NDA drop</b> <br>
                <a class="subtitle" href="https://nda-2023.github.io">https://nda-2023.github.io</a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.background {
    border-radius: 10px;
}

.subtitle {
    text-align: center;
    color: white;
}

.green {
  background-color: hsla(160, 100%, 37%, 1);
  border: none;
}
</style>