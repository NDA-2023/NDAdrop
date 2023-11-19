<script setup lang="ts">
import FileTransfer from '../components/FileTransfer.vue';
import Chat from '../components/Chat.vue';
import { useSocketStore } from '@/stores/SocketStore';
import VideoStreamList from '@/components/VideoStreamList.vue';
</script>

<template>
  <main>
    <!-- <TheWelcome /> -->
    <div class="container">
      <div class="row justify-content-center">
        <div class="col">
          <div class="videostreams" >
            <VideoStreamList/>
          </div>
          <FileTransfer />
        </div>
        <div class="chat col-5">
          <Chat />
        </div>
      </div>
    </div>
    <div class="error">
      {{ useSocketStore().err }}
    </div>
  </main>
</template>

<style scoped>
.chat {
  display: none;
}

.videostreams {
  display: none;
}

@media (min-width: 1024px) {
  .chat {
    display: block;
  }

  .videostreams {
    display: block;
  }
}

.side-view {
  margin: auto 0 auto auto;
  width: 30%;
}

.error {
  position: absolute;
  left: 10;
  bottom: 0;
  color: red;
}
</style>