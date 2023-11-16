<script setup lang="ts">
import FileTransfer from '../components/FileTransfer.vue';
import Chat from '../components/Chat.vue';
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
</style>