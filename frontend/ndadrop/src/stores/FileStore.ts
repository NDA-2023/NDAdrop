import { defineStore } from 'pinia'

export const useFileStore = defineStore('files', {
  state: () => ({
    files: [] as Array<any> //normally of type FileList but i'm KISS for migration
  }),
  actions: {
    setFiles(files: Array<any>) {
        this.files = files;
    },
    getFiles(): Array<any> {
        return this.files;
    }
  }
})