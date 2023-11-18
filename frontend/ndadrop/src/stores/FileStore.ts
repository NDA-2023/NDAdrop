import type { File } from '@/logic/File';
import { defineStore } from 'pinia'

export const useFileStore = defineStore('files', {
  state: () => ({
    files: [] as Array<File>
  }),
  actions: {
  setFiles(files: Array<File>) {
      this.files = files;
  },
  addFile(file: File) {
      this.files.push(file);
  },
  removeFileOnUUID(UUID:string){
    const index: number = this.files.indexOf(this.getFileOnUUID(UUID) as File, 0);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }},
  getters: {
    getFileOnUUID: (state) => {
      return (fileUID: string) => state.files.find((file) => file.getUID() === fileUID);
    },
    getFiles(): Array<File> {
      return this.files as Array<File>;
    }
  },
})