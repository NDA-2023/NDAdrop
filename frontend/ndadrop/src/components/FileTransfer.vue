<script lang="ts">
import { SendingFile } from '@/logic/SendingFile'
import PeerList from '@/components/PeerList.vue'
import FileUploadToast from '@/components/FileUploadToast.vue';
import { Popover } from 'bootstrap';
import { usePeersStore } from '@/stores/PeersStore'
import { useFileStore } from '@/stores/FileStore';
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
    fileNames: [] as Array<string>,
    sendingFiles: [] as Array<SendingFile>,
    popover: null as Popover | null,
  }),
  computed: {
    computedSendingFiles() {
      let sendFiles: Array<SendingFile> = this.sendingFiles as Array<SendingFile>;
      return sendFiles;
    },
    /**
     * returns all the fileNames in the fileNames array as a single string with ', ' between every fileName
     * ex: ["file1","file2","file3"] -> "file1, file2, file3"
     */
    fileNameString() {
      let fileNameString: string = ""
      for (let i = 0; i < this.fileNames.length - 1; i++) {
        fileNameString += this.fileNames[i] + ', ';
      }
      fileNameString += this.fileNames[this.fileNames.length - 1]
      return fileNameString;
    },
  },
  mounted() {
    this.popover = new Popover(this.$refs.fileInfoPopover as Element);
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
      const fileUpload = document.getElementById("fileUpload");
      if (fileUpload !== null)
        fileUpload.click();
    },
    fileSelected(event: any) {
      this.hasFile = event.target.files.length != 0;
      if (this.hasFile) {
        // add the fileNames for GUI
        for (let i = 0; i < event.target.files.length; i++) {
          this.fileNames.push(event.target.files[i].name);
        }
        // show popover
        if (this.popover !== null)
          this.popover.show();
        // add files to piniastore
        const files = useFileStore();
        files.setFiles(event.target.files);
        console.log("here");
      }
    },
    cancelFile() {
      const fileUpload: HTMLElement | null = document.getElementById("fileUpload");
      if (fileUpload !== null) {
        (fileUpload as HTMLInputElement).value = "";
      }
      this.hasFile = false;
      if (this.popover !== null)
        this.popover.hide();
    },
    sendFile() {
      const peers = usePeersStore();
      peers.getSelectedPeers().forEach((peer) => {
        this.fileNames.forEach((fileName: string) => {
          this.sendingFiles.push(new SendingFile(fileName, peer as Peer));
        })
      });
      this.cancelFile();
      this.fileNames = [];
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
    <input type="file" id="fileUpload" hidden @change="fileSelected" multiple />
    <button class="btn btn-success green add-file" @click="fileButtonClicked" data-bs-toggle="popover"
      data-bs-placement="top" data-bs-trigger="manual" data-bs-content="Select the peers you want to send the file to."
      ref="fileInfoPopover">
      {{ !hasFile ? "Add File(s)" : "Send File(s)" }}
      <img src="@/assets/file.svg" width="40" height="40" />
    </button>
  </div>
  <!-- file name -->
  <div v-if="hasFile" class="file-name fixed-bottom">
    {{ fileNameString }}
  </div>

  <div class="toast-container position-static position-fixed bottom-0 start-0 m-3">
    <div v-for="sendingFile in computedSendingFiles">
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
  width: 180px;
  margin-left: -90px;
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
  width: 100vw;
  margin-left: -50vw;
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