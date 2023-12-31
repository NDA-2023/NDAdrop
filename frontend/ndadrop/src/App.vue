<script lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import TopBar from '@/components/TopBar.vue';
import { usePeersStore } from './stores/PeersStore';
import { useChatStore } from './stores/ChatStore';
import { useSocketStore } from './stores/SocketStore';
import { Peer } from './logic/Peer';
import { importSimplePeer } from '@/plugins/simplePeerPlugin.js';
import { useFileStore } from './stores/FileStore';
import { File } from './logic/File';
import { Message } from './logic/Message';
import { DateTime } from "luxon";
import { ScreenShare } from './logic/ScreenShare';
import { useScreenShareStore } from './stores/ScreenShareStore';

export default {
  components: {
    TopBar: TopBar,
  },
  // computed: {
  //   ...mapState(usePeersStore, ['peers'])
  // },
  created() {
    let randomNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];
    const peers = usePeersStore();
    const randomIndex = Math.floor(Math.random() * randomNames.length);
    peers.addNewPeer('', randomNames[randomIndex], false, true);
    // console.log("My UUID: ", peers.getMyself.getUID());
  },
  mounted() {
    this.setupWebsocketServer();
    this.setupPersistentServer();
  },
  methods: {
    setupWebsocketServer() {
      const ws = new WebSocket("wss://main-bvxea6i-ivztmacy7gpi6.de-2.platformsh.site/ws");
      useSocketStore().setSocket(ws);
      ws.onopen = () => {
        console.log('Connected to Signaling server');
        ws.send(JSON.stringify({ type: 'join', uuid: usePeersStore().getMyself.getUID(), username: usePeersStore().getMyself.getName() }));

        this.routeToRoom();
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
          case "room-status":
            receivedRoomStatus(parsedMessage.roomActive);
            break;
          default:
            if (!parsedMessage.screenShareID) {
              createReceivingWebsocketForFile(parsedMessage);
            } else {
              createReceivingWebsocketForVideoStream(parsedMessage);
            }
            break;
        }
      };
      ws.onerror = (message) => {
        console.log("Error: cannot connect to signaling server");
      };
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
    },
    routeToRoom() {
      const urlParams = new URLSearchParams(window.location.search);
      const name = urlParams.get('roomname');
      const password = urlParams.get('roompassword');
      // const query = this.$route.query;
      if (name) {
        const peers = usePeersStore();
        const socket: any = useSocketStore().socket;
        if (socket)
          socket.send(JSON.stringify({ type: 'change-room', uuid: peers.getMyself.getUID(), room: name, password: password }));
      }
    }
  }
}

function createReceivingWebsocketForVideoStream(parsedMessage: any) {
  let sendingPeer = useScreenShareStore().getScreenShareOnUUID(parsedMessage.screenShareID);
  if (!sendingPeer) {
    importSimplePeer(false).then((peerInstance) => {
      sendingPeer = useScreenShareStore().getScreenShareOnUUID(parsedMessage.screenShareID);
      if (!sendingPeer) {
        let peer = new ScreenShare(parsedMessage.screenShareID, usePeersStore().getPeerViaUID(parsedMessage.to) as Peer, peerInstance);
        useScreenShareStore().addScreenShare(peer);
        peer.websocket.signal(parsedMessage.data);

        try {
          let audio = new Audio('../assets/stream.mp3');
          audio.play();
        } catch (err) { }
      }
      else
        sendingPeer.websocket.signal(parsedMessage.data);
    });
  } else {
    sendingPeer.websocket.signal(parsedMessage.data);
  }
}

async function createReceivingWebsocketForFile(parsedMessage: any) {
  const lockName = 'websocketReceivingCriticalSection';
  const lock = await navigator.locks.request(lockName, { mode: 'exclusive' }, async (lock) => {
    const files = useFileStore();
    let file = files.getFileOnUUID(parsedMessage.fileID);
    if (!file) {
      console.log("Creating receiving websocket")
      importSimplePeer(false).then((peerInstance) => {
        file = files.getFileOnUUID(parsedMessage.fileID);
        if (!file) {
          let peer = new File(parsedMessage.fileID, null, parsedMessage.fileName ? parsedMessage.fileName : '', usePeersStore().getPeerViaUID(parsedMessage.to) as Peer, peerInstance);
          files.addFile(peer);
          peer.websocket.signal(parsedMessage.data);
        } else {
          file.websocket.signal(parsedMessage.data);
        }
      });
    }
    else {
      file?.websocket.signal(parsedMessage.data);
    }
  })
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
      try {
        let audio = new Audio('../assets/join.mp3');
        audio.play();
      } catch (err) { }
    } else {
      if (user[1] != foundUser.getName()) { // Change username
        foundUser.setName(user[1]);
      }
    }
  });

  //
  for (let i = peersStore.peers.length - 1; i >= 0; i--) {
    const peer = peersStore.peers[i];
    if (!foundUsers.includes(peer.getUID())) {
      peersStore.removePeer(peer as Peer);
    }
  }
}

function receivedChatMessage(message: any) {
  try {
    let audio = new Audio('../assets/message.mp3');
    audio.play();
  } catch (err) { }
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
      arraySessions[currentSessionIndex].push(new Message(new Peer('no uuid', data[i].peername), data[i].content, senttime));
    } else {
      currentSession = data[i].session;
      arraySessions.push([]);
      arraySessions[++currentSessionIndex].push(new Message(new Peer('no uuid', data[i].peername), data[i].content, senttime));
    }
  }

  chat.sessions = arraySessions;
}

function receivedRoomStatus(roomActive: boolean) {
  usePeersStore().roomActive = roomActive;
}



</script>

<template>
  <div>
    <header class="wrapper">
      <TopBar msg="NDA Drop" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/chat" class="chat">Chat</RouterLink>
        <RouterLink to="/streams" class="streams">Streams</RouterLink>
        <RouterLink to="/bluetooth">Bluetooth</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>
  </div>

  <RouterView v-slot="{ Component, route: String }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" :key="$route.path"></component>
    </Transition>
  </RouterView>
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
  /* margin-top: 2rem; */
}

nav a.router-link-exact-active {
  color: hsla(160, 100%, 37%, 1);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 0.3rem;
  border-left: 1px solid var(--color-border);
  text-decoration: none;
  color: black;
  font-size: 1rem;
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

  nav a {
    font-size: 1.5rem;
  }

  .chat {
    display: none;
  }

  .streams {
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
