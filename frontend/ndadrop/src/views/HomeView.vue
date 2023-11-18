<script setup lang="ts">
import FileTransfer from '../components/FileTransfer.vue';
import Chat from '../components/Chat.vue';
import { useSocketStore } from '@/stores/SocketStore';
</script>

<template>
  <main>
    <!-- <TheWelcome /> -->
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-8">
          <FileTransfer />
        </div>
        <div class="chat col">
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

.side-view {
  margin: auto 0 auto auto;
  width: 30%;
}

@media (min-width: 1024px) {
  .chat {
    display: block;
  }
}

.error {
  position: absolute;
  left: 10;
  bottom: 0;
  color: red;
}
</style>