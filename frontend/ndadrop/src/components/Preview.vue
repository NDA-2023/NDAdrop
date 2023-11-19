<script lang="ts">
import type { File as FileType } from '@/logic/File';
import { useFileStore } from '@/stores/FileStore'; 

export default {
    data() {
        return {
            data: null as any,
            type: null as any,
        }
    },
    computed: {
        getPreviewingFileBlob() {
            const files = useFileStore();
            const file: FileType | undefined = files.getFileOnUUID(files.previewUUID) as FileType;
            if (file != undefined) {
                const blob: Blob | null | undefined = file.getBlob();
                const fileForObject: File = new File([blob!], file.getFileName(), {type: 'image/png'});
                this.type = fileForObject.type
                this.data = URL.createObjectURL(fileForObject);
            }
        }
    },
}
</script>

<template>
    <div class="modal fade" id="preview" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="previewLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5 green-text" id="previewLabel">Previewing</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <object ref="object" :data="data" :type="type"></object>
                </div>
                <!-- Add New Task Button -->
                <!-- <div class="modal-footer">
                    <button type="button" class="btn btn-danger" @click="">Decline</button>
                    <button type="button" class="btn green" @click="">Accept</button>
                </div> -->
            </div>
        </div>
    </div>
</template>

<style scoped>
.green {
  background-color: hsla(160, 100%, 37%, 1);
  border: none;
}

.green-text {
  color: hsla(160, 100%, 37%, 1);
}
</style>