<!-- RoundButton.vue -->
<template>
    <button class="round-button" @click.stop="onClick" :class="{ [buttonClass]: $props.isActive }">
      <img v-if="IsScreenShare" src="@/assets/ScreenShareIcon.png" alt="Round Icon" class="round-icon" :class="{ 'active-icon': $props.isActive }"/>
      <img v-if="!IsScreenShare" src="@/assets/FaceTimeIcon.png" alt="Round Icon" class="round-icon" :class="{ 'active-icon': $props.isActive }"/>        
    </button>
</template>
  
<script lang="ts">import { Peer } from '@/logic/Peer';
  export default {
    props: {
        peer: {
            type: Peer,
            required: true
        },
        isActive: {
            type: Boolean,
            required: true
        },
        IsScreenShare: {
          type: Boolean, 
          required: true,
        }
    },
    computed: {
    buttonClass() {
      return this.IsScreenShare ? 'active' : 'active-blue';
    },
  },
    methods: {
      onClick() {
        this.$emit('screenshare-click');
      },
    },
  };
  </script>
  
  <style scoped>
  /* RoundButton.vue styles */
  .round-icon {
    width: 100%; /* Make the image take up 100% of the container */
    height: 45%; /* Make the image take up 100% of the container */
    object-fit: cover; /* Cover the entire container while maintaining aspect ratio */
    padding-left: 2px;
  }

  .round-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background-color: #fff; /* FaceTime blue color */
    border-radius: 50%;
    border: none;
    color: #fff; /* Text color */
    font-size: 20px;
    cursor: pointer;
    margin-right: 2%;
  }
  
  .round-button:hover {
    background-color: #dddddd; /* Darker blue on hover */
  }

  .active {
    background-color: #abaae3; /* Purple color */
    animation: pulse-purple 0.4s infinite alternate; /* Pulse animation */
  }

  .active-blue {
    background-color: #2927c5; /* Purple color */
    animation: pulse-blue 0.4s infinite alternate; /* Pulse animation */
  }

  .active-icon {
    filter: brightness(0) invert(1); /* Turn the icon white when active */
  }
  
  @keyframes pulse-purple {
    from {
      background-color: #6260d3;
    }
    to {
      background-color: #abaae3; /* Light purple color */
    } 
  }

  @keyframes pulse-blue {
    from {
      background-color: rgb(32, 132, 195);
    }
    to {
      background-color: rgb(112, 166, 199); /* Light purple color */
    } 
  }
</style>