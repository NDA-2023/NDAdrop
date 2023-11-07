import { defineStore } from 'pinia'
import { Message } from '../logic/Message'
import type { Peer } from '@/logic/Peer'

export const useChatStore = defineStore('messages', {
  state: () => ({
    messages: [] as Array<Message>
  }),
  actions: {
    addMessage(peer: Peer, contents: string) {
        this.messages.push( new Message(peer, contents) )
    }
  }
})