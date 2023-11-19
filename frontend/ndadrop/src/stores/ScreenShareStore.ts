import type { Peer } from '@/logic/Peer';
import type { ScreenShare } from '@/logic/ScreenShare';
import { defineStore } from 'pinia'

export const useScreenShareStore = defineStore('screens', {
  state: () => ({
    screens: [] as Array<ScreenShare>
  }),
  actions: {
  setScreenShare(screens: Array<ScreenShare>) {
      this.screens = screens;
  },
  addScreenShare(screen: ScreenShare) {
      this.screens.push(screen);
  },
  removeScreenShareOnUUID(UUID:string){
    const index: number = this.screens.indexOf(this.getScreenShareOnUUID(UUID) as ScreenShare, 0);
    if (index > -1) {
      this.screens.splice(index, 1);
    }
  },
  getScreenShareOnUUID(screenShareUID: string){
    return this.screens.find((screen) => screen.getUUID() === screenShareUID);
  }, 
},
  getters: {
    // getScreenShareOnUUID: (state) => {
    //     return (screenShareUID: string) => state.screens.find((screen) => screen.getUUID() === screenShareUID);
    // },   
    getScreenShareOnPeer: (state) => {
        return (screenSharePeer: Peer) => state.screens.find((screen) => screen.getPeer() === screenSharePeer && screen.websocket.initiator);
    } ,
    getScreenShares: (state) => {
        return state.screens;
    } ,
    getScreenShareIDs: (state) => {
      // Assuming each screen share object has a 'getUUID' method
      return state.screens.map((screen) => screen.getUUID());
    },
}
})
