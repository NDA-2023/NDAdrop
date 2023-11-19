<script lang="ts">
import { useScreenShareStore } from '@/stores/ScreenShareStore';
import VideoStream from '@/components/VideoStream.vue';

export default {
    components: {
        VideoStream: VideoStream
    },
    computed: {
    screenShares() {
      return useScreenShareStore().getScreenShareIDs;
    },
  },
}
</script>

<template>
    <div class="d-flex justify-content-center">
        <div class="d-flex justify-content-left flex-nowrap overflow-x-scroll list">
            <div v-for="screenShareID in screenShares">
                <VideoStream :screenshareID="screenShareID" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.list {
    width: 70vw;
    background-color: lightgray;
    border-radius: 15px;
}

@media (min-width: 1024px) {
  .list {
    width: 40vw;
  }
}
</style>