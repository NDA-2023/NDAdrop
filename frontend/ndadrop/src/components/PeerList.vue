<script lang="ts">
import PeerVue from './Peer.vue';
import { mapState } from 'pinia'
import { usePeersStore } from '../stores/PeersStore'
import type { Peer } from '@/logic/Peer';

export default {
    components: {
        PeerVue: PeerVue
    },
    computed: {
        ...mapState(usePeersStore, ['peers']),
        computedPeers() {
            let peers: Array<Peer> = this.peers as Array<Peer>;
            return peers;
        }
    }
    // props: {
    //     peers: {
    //         type: Array<Peer>
    //     }
    // }
}
</script>

<template>
    <div class="list-group lg">
        <div v-for="peer in computedPeers">
            <PeerVue :peer=peer />
        </div>
    </div>
</template>

<style scoped>
.lg {
    padding: 0 12px 0 12px;
}

.green {
    background-color: hsla(160, 100%, 37%, 1);
    border: none;
}
</style>