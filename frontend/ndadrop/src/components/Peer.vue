<script lang="ts">
import { Peer } from '../logic/Peer';
import { formatTime } from '@/logic/Logic';

export default {
    props: {
        peer: {
            type: Peer,
            required: true
        }
    },
    data() {
        return {
            myName: "",
        }
    },
    methods: {
        ft(timestamp: Date) {
            return formatTime(timestamp);
        },
        selectPeer() {
            this.peer.setSelected(!this.peer.isSelected());
        },
        setName() {
            this.peer.setName(this.myName);
            console.log(this.peer.getName());
        }
    }
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
                <button type="button" class="list-group-item list-group-item-action lg" @click="selectPeer">
                    <div class="ms-2 me-auto">
                        <div class="fw-bold">{{ peer.getName() }}</div>
                    </div>
                    <span class="badge bg-primary rounded-pill">Joined at: {{ ft(peer.getJoinedTime()) }}</span>
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