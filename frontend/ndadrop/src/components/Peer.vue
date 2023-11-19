<script lang="ts">
import { useSocketStore } from '@/stores/SocketStore';
import { Peer } from '../logic/Peer';
import { formatTime } from '@/logic/Logic';
import { DateTime } from 'luxon';
import RoundButton from './RoundButton.vue';
import { importSimplePeer } from '@/plugins/simplePeerPlugin';
import { ScreenShare } from '@/logic/ScreenShare';
import { useScreenShareStore } from '@/stores/ScreenShareStore';

export default {
    props: {
        peer: {
            type: Peer,
            required: true
        }
    },
    data() {
        return {
            myName: this.peer.getName(),
            isScreenShareActive: false,
            isFaceShareActive: false,
            faceStream: null as MediaStream | null,
            screenStream: null as MediaStream | null

        };
    },
    methods: {
        ft(timestamp: DateTime) {
            return formatTime(timestamp);
        },
        selectPeer() {
            this.peer.setSelected(!this.peer.isSelected());
        },
        setName() {
            this.peer.setName(this.myName);
            const socket: any = useSocketStore().socket;
            if (socket)
                socket.send(JSON.stringify({ type: "change-username", uuid: this.peer.getUID(), newName: this.peer.getName() }));
        },
        handleScreenShareClick() {
            this.isScreenShareActive = !this.isScreenShareActive;
            if (this.isScreenShareActive){
                console.log("Staring screen share with ", this.peer.getName());
                navigator.mediaDevices.getDisplayMedia({ video: true })
                .then((stream) => {
                    
                    this.screenStream = stream;
                    importSimplePeer(true, stream).then((peerInstance) => {
                        let screenShareSocket = new ScreenShare('', this.peer, peerInstance);
                        useScreenShareStore().addScreenShare(screenShareSocket);
                    }).catch((error) => {
                        console.error('Error getting SimplePeer: ', error);
                    });

                }).catch((error) => {
                  console.error('Error running screen share:', error);
                  this.isScreenShareActive = false;
                });
            } else {
            console.log("Stopping screen share with ", this.peer.getName());
                let screenShare = useScreenShareStore().getScreenShareOnPeer(this.peer);
                if (screenShare){
                    if (this.screenStream)
                        this.screenStream.getTracks().forEach(track => track.stop());
                    screenShare.websocket.destroy();
                }
            }
        },
        handleFaceShareClick() {
            this.isFaceShareActive = !this.isFaceShareActive;
            if (this.isFaceShareActive){
                console.log("Staring camera share with ", this.peer.getName());
                navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {

                    this.faceStream = stream;
                    importSimplePeer(true, stream).then((peerInstance) => {
                        let screenShareSocket = new ScreenShare('', this.peer, peerInstance);
                        useScreenShareStore().addScreenShare(screenShareSocket);
                    }).catch((error) => {
                        console.error('Error getting SimplePeer: ', error);
                    });

                }).catch((error) => {
                  console.error('Error running camera share:', error);
                  this.isFaceShareActive = false;
                });
            } else {
            console.log("Stopping camera share with ", this.peer.getName());
                let screenShare = useScreenShareStore().getScreenShareOnPeer(this.peer);
                if (screenShare){
                    if (this.faceStream)
                        this.faceStream.getTracks().forEach(track => track.stop());
                    screenShare.websocket.destroy();
                }
            }
        },
    },
    components: { RoundButton }
}
</script>

<template>
    <Transition name="fade">
        <!-- For when it is you that is shown -->
        <div v-if="peer.isMe()">
            <div class="list-group-item list-group-item-action lg blue">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">
                        Me: <input type="text" class="myName" id="exampleFormControlInput1" placeholder="Enter your name" v-model="myName" @blur="setName">
                    </div>
                </div>
            </div>
        </div>

        <!-- If it is another peer -->
        <!-- If that peer is selected -->
        <div v-else>
            <div v-if="peer.isSelected()">
                <button type="button" class="list-group-item list-group-item-action lg active green" aria-current="true"
                    @click="selectPeer">
                    <div class="ms-2 me-auto">
                        <div class="fw-bold">{{ peer.getName() }}</div>
                    </div>
                    Sending file to this peer
                    <span class="badge bg-primary rounded-pill">Joined at: {{ ft(peer.getJoinedTime()) }}</span>
                </button>
            </div>
            <!-- If that peer is not selected -->
            <div v-if="!peer.isSelected()">
                <button type="button" class="list-group-item list-group-item-action lg" style="display: flex; align-items: center;" @click="selectPeer">
                    <RoundButton :isActive="isScreenShareActive" @screenshare-click="handleScreenShareClick" :peer="peer" :IsScreenShare="true" />
                    <RoundButton :isActive="isFaceShareActive" @screenshare-click="handleFaceShareClick" :peer="peer" :IsScreenShare="false" />
                    <div>
                        <div class="ms-2 me-auto">
                            <div class="fw-bold">{{ peer.getName() }}</div>
                        </div>
                        <span class="badge bg-primary rounded-pill">Joined at: {{ ft(peer.getJoinedTime()) }}</span>
                    </div>
                </button>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.lg {
    border-radius: 15px;
    border: none;
    background-color: #ececec;
    margin-bottom: 0.5rem;
}

.green {
    background-color: hsla(160, 100%, 37%, 1);
    border: none;
}

.blue {
    background-color: rgb(14, 175, 233);
    border: none;
    color: #ececec;
    padding: 0.5rem 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.myName {
    border: none;
    background-color: transparent;
    color: white;
}

.myName::placeholder {
    color: white;
}
</style>