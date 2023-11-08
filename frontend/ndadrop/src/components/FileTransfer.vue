<script lang="ts">
import { SendingFile } from '@/logic/SendingFile'
import PeerList from './PeerList.vue'
import FileUploadToast from './FileUploadToast.vue';
import { Popover } from 'bootstrap';
import { usePeersStore } from '../stores/PeersStore'
import type { Peer } from '@/logic/Peer';

export default {
  components: {
    PeerList: PeerList,
    FileUploadToast: FileUploadToast
  },
  // data() {
  //     return {
  //         peers: [] as Array<Peer>
  //     }
  // },
  data: () => ({
    hasFile: false,
    fileName: "",
    sendingFiles: [] as Array<SendingFile>,
    popover: null as Popover,
  }),
  mounted() {
    this.popover = new Popover(this.$refs.fileInfoPopover);
  },
  methods: {
    fileButtonClicked() {
      if (!this.hasFile) {
        this.chooseFile()
      } else {
        this.sendFile()
      }
    },
    chooseFile() {
      document.getElementById("fileUpload").click()
    },
    fileChange(event: any) {
      this.hasFile = event.target.files.length != 0;
      if (this.hasFile) {
        this.fileName = event.target.files[0].name;
        this.popover.show();
      }
    },
    cancelFile() {
      document.getElementById("fileUpload").value = "";
      this.hasFile = false;
      this.popover.hide();
    },
    sendFile() {
      const peers = usePeersStore();
      peers.getSelectedPeers().forEach((peer) => {
        this.sendingFiles.push(new SendingFile(this.fileName, peer as Peer));
      });
      this.cancelFile();
    }
  }
}
</script>

<template>
  <!-- Peerlist -->
  <div class="file-transfer container">
    <!-- <h4>Peer List</h4> -->
    <div class="row">
      <PeerList />
    </div>
  </div>

  <!-- File Control -->
  <!-- Cancel File -->
  <div v-if="hasFile" class="close-button fixed-bottom">
    <button type="button" class="btn-close" aria-label="Close" @click="cancelFile"></button>
  </div>
  <!-- file button -->
  <div class="bottom-sheet fixed-bottom">
    <input type="file" id="fileUpload" hidden @change="fileChange" />
    <button class="btn btn-success green add-file" @click="fileButtonClicked" data-bs-toggle="popover"
      data-bs-placement="top" data-bs-trigger="manual" data-bs-content="Select the peers you want to send the file to."
      ref="fileInfoPopover">
      {{ !hasFile ? "Add File" : "Send File" }}
      <img src="@/assets/file.svg" width="40" height="40" />
    </button>
  </div>
  <!-- file name -->
  <div v-if="hasFile" class="file-name fixed-bottom">
    {{ fileName }}
  </div>

  <div class="toast-container position-static position-fixed bottom-0 start-0 m-3">
    <div v-for="sendingFile in sendingFiles">
      <FileUploadToast :sending-file="sendingFile" />
    </div>
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
  width: 600px;
  margin-left: -300px;
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

.toast-container {
  padding-bottom: 120px;
}

@media (min-width: 1024px) {
  .toast-container {
    padding-bottom: 0;
  }
}
</style>