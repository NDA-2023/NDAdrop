<script>
import QrcodeVue from 'qrcode.vue'
import { usePeersStore  } from '@/stores/PeersStore'

export default {
    data() {
        return {
            size: 200,
        }
    },
    computed: {
        roomName() {
            return usePeersStore().room.name;
        },
        roomPassword() {
            return usePeersStore().room.password;
        },
        roomActive() {
            return usePeersStore().roomActive;
        },
        url() {
            return 'https://nda-2023.github.io?roomname='+ this.roomName +'&roompassword='+ this.roomPassword;
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
            <qrcode-vue background="transparent" foreground="white" :value="url" :size="size" level="H" />
            <div class="subtitle">
                <b>Join the NDA drop</b> <br>
                <div v-if="roomActive">
                    <a class="subtitle" :href="url">https://nda-2023.github.io</a><br/> connecting-to-room!
                </div>
                <div v-else>
                    <a class="subtitle" href="https://nda-2023.github.io">https://nda-2023.github.io</a>
                </div>
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