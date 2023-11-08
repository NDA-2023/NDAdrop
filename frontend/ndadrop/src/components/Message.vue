<script lang="ts">
import { Message } from '../logic/Message';
import { formatTime } from '../logic/Logic';

export default {
  props: {
    message: {
      type: Message,
      required: true
    }
  },
  computed: {
    isItMe() {
      return this.message.getPeer().isMe();
    },
    isSelected() {
      return this.message.getPeer().isSelected();
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
  <div v-if="true">
    <div :class="'list-group-item list-group-item-action message ' + (isItMe ? 'blue ' : ' ') + (isSelected ? 'green ' : ' ')" aria-current="true">
      <div class="ms-2 me-auto">
        <div class="fw-bold"> {{ message.getPeer().getName() }} <span class="badge bg-primary rounded-pill"> {{ ft(message.getTimestamp()) }} </span> </div>
        {{ message.getContents() }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.message {
  border-radius: 15px;
  border: none;
  background-color: #ececec;
  max-width: 100%;
  width: 90%;
  min-width: 70%;
  padding: 0;
  margin: 1rem auto;
}

.green {
  background-color: hsla(160, 100%, 37%, 1);
  border: none;
  color: #ececec;
  padding: 0.5rem 0;
}

.blue {
  background-color: rgb(14, 175, 233);
  border: none;
  color: #ececec;
  padding: 0.5rem 0;
}
</style>