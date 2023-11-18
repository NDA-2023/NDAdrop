<script setup lang="ts">
import { pausableWatch, useBluetooth } from '@vueuse/core'
import { ref } from 'vue';
const { isSupported, isConnected, device, requestDevice, server, error } =
  useBluetooth({
    acceptAllDevices: true,
    filters: [{
        services: ['object_transfer']
    }],
    optionalServices: ['battery_service'],
  })
const batteryPercent = ref<undefined | number>()
const isGettingBatteryLevels = ref(false)
async function getBatteryLevels() {
  isGettingBatteryLevels.value = true
  // Get the battery service:
  const batteryService = await (server.value.device.gatt).getPrimaryService('battery_service')
  // Get the current battery level
  const batteryLevelCharacteristic =
    await batteryService.getCharacteristic('battery_level')
  // Listen to when characteristic value changes on `characteristicvaluechanged` event:
  batteryLevelCharacteristic.addEventListener(
    'characteristicvaluechanged',
    (event: any) => {
      batteryPercent.value = event.target.value.getUint8(0)
    },
  )
  // Convert received buffer to number:
  const batteryLevel = await batteryLevelCharacteristic.readValue()
  batteryPercent.value = await batteryLevel.getUint8(0)
}
const { stop } = pausableWatch(isConnected, (newIsConnected) => {
  if (!newIsConnected || !server.value || isGettingBatteryLevels.value) return
  // Attempt to get the battery levels of the device:
  getBatteryLevels()
  // We only want to run this on the initial connection, as we will use an event listener to handle updates:
  stop()
})
</script>

<template>
    <div class="card m-4 p-4">
        <div v-if="!isSupported" class="alert alert-success" role="alert">
            Your browser does not support the Bluetooth Web API
        </div>

        <div v-if="isSupported">
            <button class="btn btButton d-flex justify-content-center green" @click="requestDevice()">
                Select a Bluetooth Peer
            </button>
            <div v-if="error">
                <code class="alert alert-danger">{{ error }}</code>
            </div>
        </div>
    </div>
    <div class="connectionStatus">
        <div v-if="isConnected" class="alert alert-success" role="alert">
            Connected to {{ device.name }} {{ batteryPercent+'%' }}
        </div>
        <div v-if="!isConnected" class="alert alert-danger" role="alert">
            Not Connected
        </div>
    </div>
</template>

<style scoped>
.green {
    background-color: hsla(160, 100%, 37%, 1);
    border: none;
}

.btButton {
    margin: auto;
}

.connectionStatus {
    position: absolute;
    bottom: 0;
    text-align: center;

    left: 50%;
    width: 300px;
    margin-left: -150px;
    display: flex;
    align-items: center;
    flex-direction: column;
    bottom: 2rem;
}
</style>