<script lang="ts">
import MessageVue from './Message.vue';
import { mapState } from 'pinia'
import { usePeersStore } from '@/stores/PeersStore'
import { useChatStore } from '@/stores/ChatStore';
import { useSocketStore } from '@/stores/SocketStore';
import type { Peer } from '@/logic/Peer';
import type { Message } from '@/logic/Message';

export default {
  components: {
    MessageVue: MessageVue
  },
  computed: {
    ...mapState(useChatStore, ['messages']),
    computedMessages() {
      let messages : Array<Message> = this.messages as Array<Message>;
      return messages;
    }
  },
  // props: {
  //     peers: {
  //         type: Array<Peer>,
  //         required: true
  //     }
  // },
  data() {
    return {
      typedMessage: "" as string
    }
  },
  created() {
  },
  methods: {
    sendMessage() {
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

      // reset message
      this.typedMessage = "";
    }
  }
}
</script>

<template>
  <div class="list-group">
    <div class="chat-background overflow-scroll">
      <div v-for="message in computedMessages">
        <MessageVue :message=message />
      </div>
    </div>
  </div>
  <div class="message-control">
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

.message-button {}
</style>