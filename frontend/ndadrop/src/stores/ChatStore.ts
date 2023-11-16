import { defineStore } from 'pinia'
import { Message } from '../logic/Message'
import type { Peer } from '@/logic/Peer'

export const useChatStore = defineStore('messages', {
  state: () => ({
    messages: [] as Array<Message>
  }),
  actions: {
    addMessage(peer: Peer, content: string): Message {
      const message: Message = new Message(peer, content);
      this.messages.push( message );
      return message;
    }
  }
})