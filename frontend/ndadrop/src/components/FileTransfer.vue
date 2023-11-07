<script lang="ts">
import { Peer } from '../logic/Peer'
import PeerList from './PeerList.vue'

export default {
  components: {
    PeerList
  },
  // data() {
  //     return {
  //         peers: [] as Array<Peer>
  //     }
  // },
  data: () => ({
    hasFile: false,
    fileName: ""
  }),
  methods: {
    chooseFile() {
      document.getElementById("fileUpload").click()
    },
    fileChange(event: any) {
      this.hasFile = event.target.files.length != 0;
      if (this.hasFile)
        this.fileName = event.target.files[0].name
    },
    cancelFile() {
      document.getElementById("fileUpload").value = "";
      this.hasFile = false;
    },
    sendFile() {

    }
  }
}
</script>

<template>
  <div class="file-transfer container">
    <div class="row">
      <PeerList />
    </div>
    <div class="row">

    </div>
  </div>
  <!-- File Control -->
  <div v-if="hasFile" class="close-button fixed-bottom">
    <button type="button" class="btn-close" aria-label="Close" @click="cancelFile"></button>
  </div>
  <div class="bottom-sheet fixed-bottom">
    <input type="file" id="fileUpload" hidden @change="fileChange" />
    <div v-if="!hasFile">
      <button class="btn btn-success green add-file" @click="chooseFile">Add File
        <img src="@/assets/file.svg" width="40" height="40" />
      </button>
    </div>
    <div v-if="hasFile">
      <button class="btn btn-success green add-file" @click="sendFile">Send File
        <img src="@/assets/file.svg" width="40" height="40" />
      </button>
    </div>
  </div>
  <div v-if="hasFile" class="file-name fixed-bottom">
    {{ fileName }}
  </div>
</template>

<style scoped>
.file-transfer {
  margin: 1rem;
}

.fill {
  height: 65vh;
  margin: auto;
}

.bottom-sheet {
  /* position: absolute; */
  /* bottom: 16px; */
  left: 50%;
  width: 150px;
  margin-left: -75px;
  display: flex;
  align-items: center;
  flex-direction: column;
  bottom: 2rem;
}

.close-button {
  left: 50%;
  width: 30px;
  margin-left: -110px;
  display: flex;
  align-items: center;
  flex-direction: column;
  bottom: 3.5rem;
}

.file-name {
  left: 50%;
  width: 200px;
  margin-left: -100px;
  display: flex;
  align-items: center;
  flex-direction: column;
  bottom: 0rem;
  color: gray;
}

.add-file {
  padding: 1rem;
}

.green {
  background-color: hsla(160, 100%, 37%, 1);
  border: none;
}
</style>