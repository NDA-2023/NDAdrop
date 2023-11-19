<script setup lang="ts">
import VideoStreamList from '@/components/VideoStreamList.vue';
import { useScreenShareStore } from '@/stores/ScreenShareStore';
</script>

<template>
  <main>
    <VideoStreamList />

    <div class="d-flex justify-content-center">
        <div v-if="useScreenShareStore().screens.length == 0" class="nobody">
            <b>Currently nobody is streaming with you</b>
        </div>
    </div>
  </main>
</template>

<style scoped>
.nobody {
    margin-top: 5rem;
}
</style>
