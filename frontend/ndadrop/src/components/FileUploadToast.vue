<script lang="ts">
import { File } from '@/logic/File';
import { useFileStore } from '@/stores/FileStore';
import { Toast } from 'bootstrap';
import Preview from './Preview.vue';

export default {
    props: {
        sendingFile: {
            type: File,
            required: true
        },
        isInitiator: {
            type: Boolean,
            required: false
        }
    },
    components: {
        Preview: Preview,
    },
    created() {
        this.startRefreshing();
    },
    mounted() {
        this.toast = new Toast(this.$refs.uploadToast as Element);
        this.toast.show();
    },
    data: () => ({
        minutesAgo: "0 seconds ago",
        toast: null as Toast | null,
        isComplete: false,
    }),
    methods: {
        startRefreshing() {
            //refresh time ago
            setInterval(() => {
                this.minutesAgo = this.sendingFile.timeAgo();

                this.isComplete = this.sendingFile.getProgress() >= 100;
                    
                // console.log(this.sendingFile.getProgress());
            }, 1000)
            
            //DEPRECATED:
            //refresh progress bar
            // var id = setInterval(() => {

            //     if (this.sendingFile.getProgress() >= 100 || !this.sendingFile){
            //         this.isComplete = true;
            //         clearInterval(id);
            //     }
                    
            //     console.log(this.isComplete)
            //     // else
            //     //     //TODO: added random progress! -> used for demonstration purposes
            //     //     this.sendingFile.setProgress(this.sendingFile.getProgress() + (Math.random() * 10))

            // }, 100)
        },
        remove() {
            useFileStore().removeFileOnUUID(this.sendingFile.getUID());
        },
        preview() {
            useFileStore().previewUUID = this.sendingFile.getUID();
        }
    },
}
</script>

<template>
    <div ref="uploadToast" class="toast m-1" style="z-index: 11" role="alert" aria-live="assertive" aria-atomic="true"
        data-bs-autohide="false">
        <div class="toast-header green">
            <strong v-if="isInitiator" class="me-auto">Sending {{ sendingFile.getFileName() }} to {{ sendingFile.getPeer().getName()
            }}</strong>
            <strong v-else class="me-auto">Receiving {{ sendingFile.getFileName() }} from {{ sendingFile.getPeer().getName()
            }}</strong>
            <small>{{ minutesAgo }}</small>
            <button v-if="isComplete" type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            <div class="progress" role="progressbar" aria-label="Basic example" :aria-valuenow="sendingFile.getProgress()"
                aria-valuemin="0" aria-valuemax="100">
                <div :class="'progress-bar' + (isComplete ? ' green' : ' blue')"
                    :style="'width: ' + sendingFile.getProgress() + '%'"></div>
                <div v-if="isComplete" class="done">Done</div>
            </div>
            <div v-if="!sendingFile.websocket.initiator" class="d-flex m-2 justify-content-around">
                <button type="button" class="btn btn-danger" @click="sendingFile.decline()">Decline</button>
                <button type="button" class="btn green" @click="sendingFile.accept()">Accept</button>
                <!-- <button v-if="isComplete" type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#preview" @click="preview()">Preview</button> -->
            </div>
        </div>
    </div>

    <div v-if="isComplete" >
        <Preview />
    </div>

    <!-- <div ref="downloadToast" class="toast m-1" style="z-index: 11" role="alert" aria-live="assertive" aria-atomic="true"
        data-bs-autohide="false">
        <div class="toast-header green">
            <strong class="me-auto">Receiving {{ sendingFile.getFileName() }} from {{ sendingFile.getPeer().getName()
            }}</strong>
            <small>{{ minutesAgo }}</small>
            <button v-if="isComplete" type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            <div class="progress" role="progressbar" aria-label="Basic example" :aria-valuenow="sendingFile.getProgress()"
                aria-valuemin="0" aria-valuemax="100">
                <div :class="'progress-bar' + (isComplete ? ' green' : ' blue')"
                    :style="'width: ' + sendingFile.getProgress() + '%'"></div>
                <div v-if="isComplete" class="done">Done</div>
            </div>
        </div>
    </div> -->
</template>

<style scoped>
.green {
    background-color: hsla(160, 100%, 37%, 1);
    border: none;
}

.blue {
    background-color: rgb(14, 175, 233);
    color: #ececec;
}

.done {
    position: absolute;
    left: 50%;
    width: 100px;
    margin-left: -50px;
    display: flex;
    align-items: center;
    flex-direction: column;
    color: white;
    font-weight: bold;
}
</style>