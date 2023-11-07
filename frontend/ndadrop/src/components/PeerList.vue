<script lang="ts">
import PeerVue from './Peer.vue';
import { mapState } from 'pinia'
import { usePeersStore } from '../stores/PeersStore'

export default {
    components: { 
        PeerVue: PeerVue 
    },
    computed: {
        ...mapState(usePeersStore, ['peers'])
    }
    // props: {
    //     peers: {
    //         type: Array<Peer>
    //     }
    // }
}
</script>

<template>
    <div class="list-group">
        <div v-for="peer in peers">
            <PeerVue :peer=peer />
        </div>
    </div>
</template>

<style scoped>
.lg {
    border-radius: 15px;
}

.green {
    background-color: hsla(160, 100%, 37%, 1);
    border: none;
}
</style>