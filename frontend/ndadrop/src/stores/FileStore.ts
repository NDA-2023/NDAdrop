import type { File } from '@/logic/File';
import type { SendingFile } from '@/logic/SendingFile';
import { defineStore } from 'pinia'

export const useFileStore = defineStore('files', {
  state: () => ({
    files: [] as Array<SendingFile>
  }),
  actions: {
    setFiles(files: Array<SendingFile>) {
        this.files = files;
    },
    addFile(file: SendingFile) {
        this.files.push(file);
    },
    getFiles(): Array<SendingFile> {
        return this.files as Array<SendingFile>;
    }
  }
})