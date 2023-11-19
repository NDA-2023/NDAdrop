<script lang="ts">
import { File } from '@/logic/File.js'
import PeerList from '@/components/PeerList.vue'
import FileUploadToast from '@/components/FileUploadToast.vue';
import { Popover } from 'bootstrap';
import { usePeersStore } from '@/stores/PeersStore'
import { useFileStore } from '@/stores/FileStore';
import { useSocketStore } from '@/stores/SocketStore';
import type { Peer } from '@/logic/Peer';
import { importSimplePeer } from '@/plugins/simplePeerPlugin';
import { v1 as uuid } from 'uuid';
import QR from '@/components/QR.vue';
import { useChatStore } from '@/stores/ChatStore';
import IconLock from './icons/IconLock.vue';
import IconQR from './icons/IconQR.vue';
import IconRoom from './icons/IconRoom.vue';

export default {
  components: {
    PeerList: PeerList,
    FileUploadToast: FileUploadToast,
    QR: QR,
    IconLock: IconLock,
    IconQR: IconQR,
    IconRoom: IconRoom,
  },
  // data() {
  //     return {
  //         peers: [] as Array<Peer>
  //     }
  // },
  data: () => ({
    hasFile: false,
    fileNames: [] as Array<string>,
    sendingFiles: [] as Array<any>,
    popover: null as Popover | null,
    room: '' as string,
    password: '' as string,
  }),
  computed: {
    computedSendingFiles() {
      let sendFiles: Array<File> = useFileStore().files as Array<File>;
      return sendFiles;
    },
    showingQR() {
      return useChatStore().showingQR;
    },
    showingRoom() {
      return useChatStore().showingRoom;
    },
    roomActive() {
      return usePeersStore().roomActive;
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
          this.sendingFiles.push(event.target.files[i]);
          // files.addFile(new File(event.target.files[i].name, event.target.files[i], uuidv4()))
        }
        // show popover
        if (this.popover !== null)
          this.popover.show();
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

      this.sendingFiles = [];
      this.fileNames = [];
    },
    sendFile() {
      const files = useFileStore();
      const peers = usePeersStore();
      peers.getSelectedPeers().forEach((peer) => {
        this.sendingFiles.forEach((file: any) => {
          console.log("Creating Sender Websocket");
          importSimplePeer(true).then((peerInstance) => {
            let uid: string = uuid();
            files.addFile(new File(uid, file, file.name, peer as Peer, peerInstance));
          }).catch((error) => {
            console.error('Error getting SimplePeer: ', error);
          });
        })
      });
      this.cancelFile();
    },
    toggleQR() {
      const chats = useChatStore()
      chats.showingQR = !chats.showingQR;
    },
    toggleRoom() {
      const chats = useChatStore()
      chats.showingRoom = !chats.showingRoom;
    },
    createRoom() {
        const peers = usePeersStore();
        peers.room.name = this.room;
        peers.room.password = this.password;
        const socket: any = useSocketStore().socket;
        if(socket)
            socket.send(JSON.stringify({ type: 'change-room', room: peers.room.name, password: peers.room.password}));
    },
  }
}
</script>
<template>
  <!-- Room Control -->
  <Transition name="fade" mode="out-in">
    <div v-if="roomActive" class="d-flex justify-content-center roomStatus">
      You are now in a room
      <IconLock class="lock" />
    </div>
  </Transition>
  <Transition name="fade" mode="out-in">
    <div v-if="showingRoom" class="roomControl">
      <div class="d-flex justify-content-center">
        <div class="mb-1 me-1 mt-1">
          <input type="email" class="form-control green roomControlText" id="roomName" aria-describedby="roomName"
            placeholder="Room Name">
        </div>
        <div class="mb-1 mt-1">
          <input type="password" class="form-control green roomControlText" id="roomPassword"
            placeholder="Room's Password">
        </div>
        <div class="mb-1 mt-1">
          <button class="btn green" @click="createRoom()">Create Room</button>
        </div>
      </div>
    </div>
  </Transition>

  <div class="controls">
    <button class="btn" @click="toggleRoom()">
      <IconRoom />
    </button>
    <button class="btn" @click="toggleQR()">
      <IconQR />
    </button>
  </div>

  <!-- Peerlist -->
  <div class="file-transfer container">
    <!-- <h4>Peer List</h4> -->
    <div class="row">
      <PeerList />
    </div>
    <Transition name="fade" mode="out-in">
      <div v-if="showingQR">
        <QR />
      </div>
    </Transition>
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
      <FileUploadToast :is-initiator="sendingFile.websocket.initiator" :sending-file="sendingFile" />
    </div>
  </div>
</template>

<style scoped>
.file-transfer {
  margin-top: 1rem;
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

.roomControl {
  border-radius: 15px;
}

.roomControlText::placeholder {
  color: white;
  text-align: center;
}

.roomStatus {
  color: hsla(160, 100%, 37%, 1);
}

.lock {
  margin-top: 5px;
  margin-left: 5px;
  color: hsla(160, 100%, 37%, 1);
}

.controls {
  display: block;
}

.roomControlInBetween {
  margin-top: 10px;
  display: none;
}

@media (min-width: 1024px) {
  .toast-container {
    padding-bottom: 0;
  }

  .roomControlInBetween {
    display: block;
  }

  .controls {
    display: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


</style>