// ScreenShareComponent.vue
<template>
  <div v-if="!screenShare.websocket.initiator">
    <p>{{ screenShare.getPeer().getName() }} is sharing video with you</p>
    <div v-if="streamFound">
      <video class="VideoStream" ref="videoElement" :key="`${screenShare.getUUID()}-${Date.now()}`" :srcObject="screenShare.stream" autoplay muted controls></video>
    </div>
    <div v-if="!streamFound">
      <span>Stream is loading...</span>
    </div>
  </div>
</template>

<script lang="ts">
import { useScreenShareStore } from '@/stores/ScreenShareStore';

export default {
  props: {
    screenshareID: {
      type: String,
      required: true,
    },
  },
  computed: {
    screenShare() {
      return useScreenShareStore().getScreenShareOnUUID(this.screenshareID)!;
    },
  },
  data() {
        return {
            streamFound: false
        };
      },
  mounted() {
    this.waitForStream()
    .then(() => {
      this.streamFound = true;
    })
    .catch((error) => {
      console.error('Error while waiting for stream:', error);
    });
  },
  methods: {
    waitForStream() {
    return new Promise<void>((resolve) => {
      const checkStream = () => {
        if (this.screenShare && this.screenShare.stream) {
          resolve();
        } else {
          if (!this.screenShare)
            return;
          setTimeout(checkStream, 100);
        }
      };

      checkStream();
    });
  },
  }
};
</script>

<style scoped>
.VideoStream{
  width: 30%;
}
</style>