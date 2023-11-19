import { defineStore } from 'pinia';

export const useSocketStore = defineStore({
  id: 'socket',
  state: () => ({
    socket: null,
    persistent: null,
    err: null,
  }),
  actions: {
    setSocket(socket: any) {
      this.socket = socket;
    },
    setPersistent(persistent: any) {
      this.persistent = persistent
    },
    setError(err: any) {
      this.err = err;
    }
  },
});
