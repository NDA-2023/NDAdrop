import { defineStore } from 'pinia';

export const useSocketStore = defineStore({
  id: 'socket',
  state: () => ({
    socket: null,
    persistent: null,
  }),
  actions: {
    setSocket(socket: any) {
      this.socket = socket;
    },
    setPersistent(persistent: any) {
      this.persistent = persistent
    },
  },
});
