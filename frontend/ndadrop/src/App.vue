<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import TopBar from './components/TopBar.vue'
import { usePeersStore } from './stores/PeersStore';
import { useChatStore } from './stores/ChatStore';
import { useSocketStore } from './stores/SocketStore';
import { Peer } from './logic/Peer';
import { importSimplePeer } from '@/plugins/simplePeerPlugin.js';
import { useFileStore } from './stores/FileStore';
import { File } from './logic/File';
import { Message } from './logic/Message';
import { DateTime } from "luxon";
import { useScreenShareStore } from './stores/ScreenShareStore';
import { ScreenShare } from './logic/ScreenShare';

export default {
  components: {
    TopBar: TopBar
  },
  computed: {
    screenShares() {
      // Assuming useScreenShareStore() returns a store with a 'getScreenShares' method
      return useScreenShareStore().getScreenShares;
    },
  },
  // data (){
  //   return {
  //     StreamKey: 0
  //   }
  // },
  // watch: {
  //   // Watch for changes in the screenShare objects
  //   screenShares: {
  //     deep: true,
  //     handler(newScreenShares) {
  //       // Check for stream and update hasStream property
  //       newScreenShares.forEach((screenShare: ScreenShare) => {
  //         if (screenShare.hasStream) {
  //           this.StreamKey += 1;
  //         }
  //       });
  //     },
  //   },
  // },
  // computed: {
  //   ...mapState(usePeersStore, ['peers'])
  // },
  created() {
    let randomNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];
    const peers = usePeersStore();
    const randomIndex = Math.floor(Math.random() * randomNames.length);
    peers.addNewPeer('', randomNames[randomIndex], false, true);
    console.log("My UUID: ", peers.getMyself.getUID());
    // const chat = useChatStore();
    // chat.addMessage(peers.getPeerViaIndex(1) as Peer, "Interlinked");
  },
  mounted() {
    this.setupWebsocketServer();
    this.setupPersistentServer();
  },
  methods: {
    setupWebsocketServer() {
      const ws = new WebSocket("ws://localhost:3001");//'wss://main-bvxea6i-ivztmacy7gpi6.de-2.platformsh.site/ws');
      useSocketStore().setSocket(ws);
      ws.onopen = () => {
        console.log('Connected to Signaling server');
        ws.send(JSON.stringify({ type: 'join', uuid: usePeersStore().getMyself.getUID(), username: usePeersStore().getMyself.getName() }));
      };
      ws.onmessage = (message) => {
        let parsedMessage = JSON.parse(message.data);
        switch (parsedMessage.type) {
          case "onlineUsers":
            updateOnlineUsersList(parsedMessage.data);
            break;
          case "chat-message":
            receivedChatMessage(parsedMessage);
            break;
          default:
            if (!parsedMessage.screenShareID){
              let sendingPeer = useFileStore().getFileOnUUID(parsedMessage.fileID);
              if (!sendingPeer) {
                importSimplePeer(false).then((peerInstance) => {
                  sendingPeer = useFileStore().getFileOnUUID(parsedMessage.fileID);
                  if (!sendingPeer){
                    console.log("Creating file receiving websocket")
                    let peer = new File(parsedMessage.fileID, null, parsedMessage.fileName ? parsedMessage.fileName : '', usePeersStore().getPeerViaUID(parsedMessage.to) as Peer, peerInstance);
                    useFileStore().addFile(peer);
                    peer.websocket.signal(parsedMessage.data);
                  } else
                    sendingPeer.websocket.signal(parsedMessage.data);
                });
              }
              else {
                sendingPeer?.websocket.signal(parsedMessage.data);
              }
           } else {
            let sendingPeer = useScreenShareStore().getScreenShareOnUUID(parsedMessage.screenShareID);
            console.log(useScreenShareStore().screens);
            if (!sendingPeer) {
              importSimplePeer(false).then((peerInstance) => {
                sendingPeer = useScreenShareStore().getScreenShareOnUUID(parsedMessage.screenShareID);
                if (!sendingPeer){
                  console.log("Create receiving screenshare socket: ", parsedMessage.screenShareID);
                  let peer = new ScreenShare(parsedMessage.screenShareID, usePeersStore().getPeerViaUID(parsedMessage.to) as Peer, peerInstance, this.addVideoTag(parsedMessage.screenShareID));
                  useScreenShareStore().addScreenShare(peer);
                  // console.log(useScreenShareStore().screens);
                  peer.websocket.signal(parsedMessage.data);
                } else
                  sendingPeer.websocket.signal(parsedMessage.data);
              });
            } else {
              console.log("Screenshare socket already exists");
              sendingPeer.websocket.signal(parsedMessage.data);
            }
           }
          break;
        }
      };
      ws.onerror = (message) => {
        console.log("Error: cannot connect to signaling server");
      };
    },
    addVideoTag(id: string) {
      // Create a new video element
      const newVideo = document.createElement('video');
      // Set attributes for the video element
      newVideo.muted = true;
      newVideo.controls = true;
      // Set a unique ref for the video element
      const refName = `video-${id}`;
      newVideo.setAttribute('ref', refName);
      newVideo.classList.add('VideoStream');
      return newVideo;
    },
    setupPersistentServer() {
      const persistent = new WebSocket('wss://main-bvxea6i-ivztmacy7gpi6.de-2.platformsh.site/ws-persistent');
      useSocketStore().setPersistent(persistent);
      persistent.onopen = () => {
        console.log('Connected to Persistent server');
        persistent.send(JSON.stringify({ type: 'get-messages' }));
      };
      persistent.onmessage = (message: any) => {
        let parsedMessage = JSON.parse(message.data);
        switch (parsedMessage.type) {
          case "get-messages":
            receivedSessionMessages(parsedMessage);
            break;
          default:
            break;
        }
      };
      persistent.onerror = (message) => {
        console.log("Error: cannot connect to persistent server");
      };
    }
  }
}

//*** AVAILABLE USERS LIST ***//
function updateOnlineUsersList(onlineUsers: any) {
  // console.log("Updating users")
  const peersStore = usePeersStore();
  const foundUsers = [peersStore.getMyself.getUID(),];
  onlineUsers.forEach((user: any) => {
    let foundUser: Peer = usePeersStore().getPeerViaUID(user[0]) as Peer
    foundUsers.push(user[0]);
    if (!foundUser) {
      peersStore.addNewPeer(user[0], user[1], false, false);
    } else {
      if (user[1] != foundUser.getName()) { // Change username
        foundUser.setName(user[1]);
      }
    }
  });
  peersStore.peers.forEach(peer => {
    if (!foundUsers.includes(peer.getUID())) {
      peersStore.removePeer(peer as Peer);
    }
  });
}

function receivedChatMessage(message: any) {
  const peers = usePeersStore();
  const chat = useChatStore();
  chat.addMessage(peers.getPeerViaUID(message.uuid) as Peer, message.content);
}

function receivedSessionMessages(sessions: any) {
  const chat = useChatStore();
  const data = sessions.result.rows;
  let currentSession = data[0].session;
  let arraySessions: Array<Array<Message>> = new Array<Array<Message>>([]);
  let currentSessionIndex = 0;
  for (let i = 0; i < data.length; i++) {
    const senttime = DateTime.fromISO(data[i].senttime);
    if (currentSession == data[i].session) {
      arraySessions[currentSessionIndex].push(new Message(new Peer('no uuid',data[i].peername), data[i].content, senttime));
    } else {
      currentSession = data[i].session;
      arraySessions.push([]);
      arraySessions[++currentSessionIndex].push(new Message(new Peer('no uuid',data[i].peername), data[i].content, senttime));
    }
  }

  chat.sessions = arraySessions;
}

</script>

<template>
  <div>
    <header class="wrapper">
      <TopBar msg="NDA Drop" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/chat" class="chat">Chat</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>
  </div>

  <RouterView v-slot="{ Component, route: String }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" :key="$route.path"></component>
    </Transition>
  </RouterView>
  <!-- <div v-show="screenShares.length > 0">
    <h2>Video Streams</h2>
    <ul id="VideoStreamList">
    </ul>
  </div> -->
  <div >
    <h2>Video Streams</h2>
    <ul>
      <li v-for="screenShare in screenShares" :key="screenShare.getUUID()">
        <template v-if="!screenShare.websocket.initiator">
          <span> {{ screenShare.getPeer().getName() }} is screen sharing with you</span>
          <video class="VideoStream" v-if="screenShare.stream" :srcObject="screenShare.stream" autoplay muted controls></video>
        </template>
      </li>
    </ul>
  </div>

  <!-- <div v-show="screenShares.length > 0 && screenShares.every(screenShare => !screenShare.websocket.initiator)">
    <h2>Active Video Streams</h2>
    <ul class="stream-list">
      <li v-for="screenShare in screenShares" :key="screenShare.getUUID()" class="stream-item">
        <template v-if="!screenShare.websocket.initiator">
          <div class="stream-info">
            <p class="stream-status" v-if="screenShare.hasStream">{{ screenShare.getPeer().getName() }} is screen sharing with you</p>
            <p class="stream-status" v-else>Pending screen sharing...</p>
          </div>
          <video class="VideoStream" v-if="screenShare.hasStream" :srcObject="screenShare.stream" autoplay muted controls></video>
        </template>
      </li>
    </ul>
  </div> -->
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: hsla(160, 100%, 37%, 1);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  text-decoration: none;
  color: black;
  font-size: 1.5rem;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: right;

    padding: 1rem 0;
    margin-top: 1rem;
  }

  .chat {
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

.VideoStream{
  width: 10%;
}
</style>
