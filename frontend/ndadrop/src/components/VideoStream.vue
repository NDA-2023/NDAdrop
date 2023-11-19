// ScreenShareComponent.vue
<template>
  <div class="videostream green" v-if="!screenShare.websocket.initiator">
    <div v-if="streamFound" class="">
      <video class="video" ref="videoElement" :key="`${screenShare.getUUID()}-${Date.now()}`" :srcObject="screenShare.stream" autoplay muted controls></video>
    </div>
    <div class="peerName">{{ screenShare.getPeer().getName() }}</div>
    <div v-if="!streamFound">
      <span>Stream is loading...</span>
    </div>
    <!-- <div>{{ screenShare.getPeer().getName() }}</div> -->
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

.videostream {
  margin: 1rem;

}
.video{
  width: 200px;
  border-radius: 15px;
}

.peerName {
  text-align: center;
}

.green {
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  border: none;
  padding: 0.2rem 0.2rem 0rem 0.2rem;
  border-radius: 15px;
}
</style>