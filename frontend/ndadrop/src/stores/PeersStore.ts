import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Peer } from '../logic/Peer'

export const usePeersStore = defineStore('peers', {
  state: () => ({
    peers: [] as Array<Peer>
  }),
  getters: {
    getPeerViaIndex: (state) => {
      return (index: number) => state.peers[index];
    },
    getPeerViaName: (state) => {
      return (peerName: string) => state.peers.find((user) => user.getName() === peerName)
    }
  },
  actions: {
    addPeer(peer: Peer) {
      this.peers.push(peer);
    },
    addNewPeer(peerName: string, selected: boolean = false, me: boolean = false) {
      this.peers.push(new Peer(peerName, selected, me));
    },
    removePeer(peer: Peer) {
      const index: number = this.peers.indexOf(peer, 0);
      if (index > -1) {
        this.peers.splice(index, 1);
      }
    }
  }
})