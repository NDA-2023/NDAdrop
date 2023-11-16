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
    },
    getPeerViaUID: (state) => {
      return (peerUID: string) => state.peers.find((user) => user.getUID() === peerUID)
    }
  },
  actions: {
    addPeer(peer: Peer) {
      this.peers.push(peer);
    },
    addNewPeer(peerUUID:string = '', peerName: string, selected: boolean = false, me: boolean = false, websocket: any = null) {
      if (peerUUID.length == 0)
        this.peers.push(new Peer('',peerName, selected, me, websocket));
      else
        this.peers.push(new Peer(peerUUID,peerName, selected, me, websocket));
    },
    removePeer(peer: Peer) {
      const index: number = this.peers.indexOf(peer, 0);
      if (index > -1) {
        this.peers.splice(index, 1);
      }
    },
    getSelectedPeers() {
      return this.peers.filter((peer) => {return peer.isSelected()});
    }
  }
})