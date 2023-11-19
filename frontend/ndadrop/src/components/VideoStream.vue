// ScreenShareComponent.vue
<template>
  <div>
    <p>{{ screenshare.getPeer().getName() }} is sharing video with you</p>
    <video class="VideoStream" ref="videoElement" :key="`${screenshare.getUUID()}-${Date.now()}`" :srcObject="screenshare.stream" autoplay muted controls></video>
  </div>
</template>

<script lang="ts">
import { ScreenShare } from '@/logic/ScreenShare';

export default {
  props: {
    screenshare: {
      type: ScreenShare,
      required: true,
    },
  },
  watch: {
    'screenshare.stream'(newStream, oldStream) {
      // When the screenShare stream changes, update the video srcObject
      console.log("Test")
      this.updateVideoStream(newStream);
    },
  },
  mounted() {
    // Initialize the video stream when the component is mounted
    this.updateVideoStream(this.screenshare.stream);
  },
  methods: {
    updateVideoStream(stream: MediaStream) {
      const videoElement = this.$refs.videoElement;

      // Check if the video element and stream are available
      if (videoElement && stream) {
        // Assign the stream to the video element
        (videoElement as HTMLVideoElement).srcObject = stream;
      }
    },
  },
};
</script>