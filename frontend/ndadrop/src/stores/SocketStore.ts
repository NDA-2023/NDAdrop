import { defineStore } from 'pinia';

export const useSocketStore = defineStore({
  id: 'socket',
  state: () => ({
    socket: null,
  }),
  actions: {
    setSocket(socket: any) {
      this.socket = socket;
    },
  },
});
