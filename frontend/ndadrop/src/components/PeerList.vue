<script lang="ts">
import Peer from './Peer.vue';

export default {
    components: { Peer }
}
</script>

<template>
    <div class="list-group">
        <!-- <div v-for="1"> -->
            <Peer />
        <!-- </div> -->
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