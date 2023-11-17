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
  }},
  getters: {
    getScreenShareOnUUID: (state) => {
      return (screenShareUID: string) => state.screens.find((screen) => screen.getUUID() === screenShareUID);
    }   
}
})
