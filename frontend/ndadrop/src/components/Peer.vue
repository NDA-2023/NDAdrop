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
    methods: {
        ft(timestamp: Date) {
            return formatTime(timestamp);
        }
    }
}
</script>

<template>
    <div class="list-group">
        <div  v-if="peer.isMe()">
            <div class="list-group-item list-group-item-action lg">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">{{ peer.getName() }}</div>
                </div>
            </div>
        </div>
        <div v-else>
            <div v-if="peer.isSelected()">
            <button type="button" class="list-group-item list-group-item-action lg active green" aria-current="true">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">{{ peer.getName() }}</div>
                </div>
                <span class="badge bg-primary rounded-pill">Joined at: {{ ft(peer.getJoinedTime()) }}</span>
            </button>
        </div>
        <div v-if="!peer.isSelected()">
            <button type="button" class="list-group-item list-group-item-action lg">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">{{ peer.getName() }}</div>
                </div>
                <span class="badge bg-primary rounded-pill">Joined at: {{ ft(peer.getJoinedTime()) }}</span>
            </button>
        </div>
        </div>
    </div>
</template>

<style scoped>
.lg {
    border-radius: 15px;
    border: none;
    background-color: #ececec;
}

.green {
    background-color: hsla(160, 100%, 37%, 1);
    border: none;
}
</style>