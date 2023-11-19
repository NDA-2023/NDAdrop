<script lang="ts">
import MessageVue from './Message.vue';
import { usePeersStore } from '@/stores/PeersStore'
import { useChatStore } from '@/stores/ChatStore';
import { useSocketStore } from '@/stores/SocketStore';
import { Peer } from '@/logic/Peer';
import type { Message as MessageType } from '@/logic/Message';
import IconQR from './icons/IconQR.vue';
import IconHistory from './icons/IconHistory.vue';
import IconRoom from './icons/IconRoom.vue';
import QR from './QR.vue';

export default {
  components: {
    IconHistory: IconHistory,
    IconQR: IconQR,
    IconRoom: IconRoom,
    MessageVue: MessageVue,
    QR
  },
  computed: {
    computedMessages() {
      let messages: Array<MessageType> = useChatStore().messages as Array<MessageType>;
      return messages;
    },
    computedSessions() {
      let sessions: Array<Array<MessageType>> = useChatStore().sessions as Array<Array<MessageType>>;
      return sessions;
    }
  },
  data() {
    return {
      typedMessage: "" as string,
      showingHistory: false,
      showingQR: false,
      data: null,
    }
  },
  created() {
  },
  methods: {
    sendMessage() {
      try {
        let audio = new Audio('../src/assets/message.mp3');
        audio.play();
      } catch (err) {}

      const peers = usePeersStore();
      const chat = useChatStore();
      const message = chat.addMessage(peers.getMyself as Peer, this.typedMessage);


      const socket: any = useSocketStore().socket;
      socket.send(
        JSON.stringify({
          type: 'chat-message',
          uuid: peers.getMyself.getUID(),
          username: peers.getMyself.getName(),
          timestamp: message.getTimestamp(),
          content: this.typedMessage
        })
      );

      if (!peers.roomActive) {
        const persistent: any = useSocketStore().persistent;
        persistent.send(
          JSON.stringify({
            type: 'add-message',
            peername: peers.getMyself.getName(),
            content: this.typedMessage,
            senttime: message.getTimestamp(),
            session: peers.getMyself.getUID(),
          })
        )
      }
      // reset message
      this.typedMessage = "";
    },
    toggleQR() {
      const chats = useChatStore()
      chats.showingQR = !chats.showingQR;
    },
    toggleRoom() {
      const chats = useChatStore()
      chats.showingRoom = !chats.showingRoom;
    }
  }
}
</script>

<template>
  <div class="list-group">
    <div class="chat-background overflow-scroll">
      <div class="d-flex justify-content-end">
        <button class="btn" @click="toggleRoom()">
          <IconRoom />
        </button>
        <button class="btn" @click="toggleQR()">
          <IconQR />
        </button>
        <button class="btn" @click="() => { showingHistory = !showingHistory }">
          <IconHistory />
        </button>
      </div>
      <div v-if="!showingHistory">
        
        <div v-for="message in computedMessages">
          <MessageVue :message=message />
        </div>
      </div>
      <div v-else>
        <div class="accordion" id="messagesHistory">
          <div v-for="session, index in computedSessions">
            <div class="accordion-item session-background">
              <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse"
                  :data-bs-target="'#collapse' + index" :aria-controls="'collapse' + index">
                  Session {{ index }}
                </button>
              </h2>
              <div :id="'collapse' + index" class="accordion-collapse collapse" data-bs-parent="#messagesHistory">
                <div class="accordion-body">
                  <div v-for="message in session">
                    <MessageVue :message=message />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="!showingHistory" class="message-control">
    <!-- v-model="message" -->
    <textarea class="form-control message" placeholder="Aa" id="description" rows="1" v-model="typedMessage"></textarea>
    <button class="btn btn-link message-button" @click="sendMessage">
      <img src="@/assets/send-message.svg" width="40" height="40" />
    </button>
  </div>
</template>

<style scoped>
.chat-background {
  background-color: #ececec;
  height: calc(85vh - 200px);
  margin: 1rem -1rem 0 -1rem;
}

@media (min-height: 700px) {
  .chat-background {
    margin: 1rem -1rem;
  }
}

@media (min-width: 700px) {
  .chat-background {
    height: calc(75vh - 100px);
    margin: 1rem;
    border-radius: 15px
  }
}

.green {
  background-color: hsla(160, 100%, 37%, 1);
  border: none;
}

.message-control {
  display: flex;
  margin: auto 0 1rem 1rem;
}

.message {
  /* width: 400px; */
  margin: auto 0 auto auto;
}

.session-background {
  background-color: transparent;
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