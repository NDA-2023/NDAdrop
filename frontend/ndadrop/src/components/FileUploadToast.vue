<script lang="ts">
import { SendingFile } from '@/logic/SendingFile';
import { Toast } from 'bootstrap';

export default {
    props: {
        sendingFile: {
            type: SendingFile,
            required: true
        }
    },
    created() {
        this.startRefreshing();
    },
    mounted() {
        this.toast = new Toast(this.$refs.uploadToast);
        this.toast.show();
    },
    data: () => ({
        minutesAgo: "0 seconds ago",
        toast: null as Toast,
        isComplete: false,
    }),
    methods: {
        startRefreshing() {
            //refresh time ago
            setInterval(() => {
                this.minutesAgo = this.sendingFile.timeAgo();
            }, 1000)

            //refresh progress bar
            setInterval(() => {

                if (this.sendingFile.getProgress() >= 100)
                    this.isComplete = true;
                else
                    //TODO: added random progress! -> used for demonstration purposes
                    this.sendingFile.setProgress(this.sendingFile.getProgress() + (Math.random() * 10))

            }, 100)
        }
    }
}
</script>

<template>
    <div ref="uploadToast" class="toast m-1" style="z-index: 11" role="alert" aria-live="assertive" aria-atomic="true"
        data-bs-autohide="false">
        <div class="toast-header green">
            <strong class="me-auto">Sending {{ sendingFile.getFileName() }} to {{ sendingFile.getPeer().getName()
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