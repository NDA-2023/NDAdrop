<!-- RoundButton.vue -->
<template>
    <button class="round-button" @click.stop="onClick" :class="{ 'active': isActive }">
      <img src="@/assets/ScreenShareIcon.png" alt="Round Icon" class="round-icon" :class="{ 'active-icon': isActive }"/>    
    </button>
</template>
  
<script lang="ts">import { Peer } from '@/logic/Peer';
  import { ScreenShare } from '@/logic/ScreenShare';
  import { importSimplePeer } from '@/plugins/simplePeerPlugin';
import { useScreenShareStore } from '@/stores/ScreenShareStore';

  export default {
    data() {
      return {
        isActive: false,
      };
    },
    props: {
        peer: {
            type: Peer,
            required: true
        }
    },
    methods: {
      onClick() {
        // Toggle the isActive state
        this.isActive = !this.isActive;
        // Emit the click event
        this.$emit('click');
        if (this.isActive){
          console.log("Staring screen share with ", this.peer.getName());
          importSimplePeer(true).then((peerInstance) => {
            let screenShareSocket = new ScreenShare('', this.peer, peerInstance);
            useScreenShareStore().addScreenShare(screenShareSocket);
          }).catch((error) => {
            console.error('Error getting SimplePeer: ', error);
          });
        } else {
          console.log("Stopping screen share with ", this.peer.getName());
          //search on this.peer in store
          //call destroy
        }
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
    background-color: #6260d3; /* Purple color */
    animation: pulse 2s infinite alternate; /* Pulse animation */
  }

  .active-icon {
    filter: brightness(0) invert(1); /* Turn the icon white when active */
  }
  
  @keyframes pulse {
    from {
      background-color: #6260d3;
    }
    to {
      background-color: #8d8cd2; /* Light purple color */
    } 
  }
</style>