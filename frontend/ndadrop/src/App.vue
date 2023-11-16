<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import TopBar from './components/TopBar.vue'
import { usePeersStore } from './stores/PeersStore';
import { useChatStore } from './stores/ChatStore';
import { useSocketStore } from './stores/SocketStore';
import type { Peer } from './logic/Peer';
import { importSimplePeer } from '@/plugins/simplePeerPlugin.js';

//TODO: Change username in server

//TODO: peer zelfde moment sturen??
//TODO: Timestamp??
//TODO: close peer??

export default {
  components: {
    TopBar: TopBar
  },
  // computed: {
  //   ...mapState(usePeersStore, ['peers'])
  // },
  created() {
    let randomNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];
    const peers = usePeersStore();
    const randomIndex = Math.floor(Math.random() * randomNames.length);
    peers.addNewPeer('',randomNames[randomIndex], false, true);
    // const chat = useChatStore();
    // chat.addMessage(peers.getPeerViaIndex(1) as Peer, "Interlinked");
  },
  mounted() {
    const ws = new WebSocket('ws://127.0.0.1:3001');
    useSocketStore().setSocket(ws);
    ws.onopen = () => {
      console.log('Connected to Signaling server');
      ws.send(JSON.stringify({type: 'join', uuid: usePeersStore().getPeerViaIndex(0).getUID(), username: usePeersStore().getPeerViaIndex(0).getName()}));
      // importSimplePeer().then((peerInstance) => {
      //   usePeersStore().addNewPeer("Test user", false, false, peerInstance);
      // }).catch((error) => {
      //   console.error('Error getting SimplePeer:', error);
      // });
    };
    ws.onmessage = (message) => {
      let parsedMessage = JSON.parse(message.data);
      if (parsedMessage.type === "onlineUsers"){
        updateOnlineUsersList(parsedMessage.data);
      }
    };
  },
}

//*** AVAILABLE USERS LIST ***//
function updateOnlineUsersList(onlineUsers: any) {
  const peersStore = usePeersStore();
  const foundUsers = [peersStore.getPeerViaIndex(0).getUID(),];
  onlineUsers.forEach((user:any) => {
    let foundUser = usePeersStore().getPeerViaUID(user[0])
    foundUsers.push(user[0]);
    if (!foundUser){
      importSimplePeer().then((peerInstance) => {
        peersStore.addNewPeer(user[0],user[1], false, false, peerInstance);
      }).catch((error) => {
        console.error('Error getting SimplePeer:', error);
      });    
    }
  });
  peersStore.peers.forEach(peer => {
    if (!foundUsers.includes(peer.getUID())) {
      peersStore.removePeer(peer as Peer);
    }
  });
}

</script>

<template>
  <div>
    <header class="wrapper">
      <TopBar msg="NDA Drop" />

      <nav>
        <RouterLink to="/NDAdrop/">Home</RouterLink>
        <RouterLink to="/NDAdrop/chat" class="chat">Chat</RouterLink>
        <RouterLink to="/NDAdrop/about">About</RouterLink>
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
</style>
