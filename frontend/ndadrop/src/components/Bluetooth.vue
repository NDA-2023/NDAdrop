<script setup lang="ts">
import { pausableWatch, useBluetooth } from '@vueuse/core'
import { ref } from 'vue';
const { isSupported, isConnected, device, requestDevice, server, error } =
    useBluetooth({
        acceptAllDevices: true,
        //filters: [ {services: ['12345678-1234-5678-1234-56789abcdef0'],}],
        optionalServices: ['battery_service', 'object_transfer', 'immediate_alert']
        // optionalServices: ['battery_service', 'object_transfer'],
    })
const batteryPercent = ref<undefined | number>()
const isConnecting = ref(false)

// function requestingDevice() {
//     requestDevice();
//     isGettingBatteryLevels.value = true;
// }

function setLoading() {
    isConnecting.value = true;
    error.value = null;
}

async function getBatteryLevels() {
    isConnecting.value = true
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
    isConnecting.value = false;

    console.log(await (server.value.device.gatt).getPrimaryServices());
    
    try {
        const objectTransfer = await (server.value.device.gatt).getPrimaryService('object_transfer')
    } catch (err) {
        error.value = err;
        error.value += '(object transfer)';
    }

}
const { stop } = pausableWatch(isConnected, (newIsConnected) => {
    if (!newIsConnected || !server.value) return
    // Attempt to get the battery levels of the device:
    getBatteryLevels()
    // We only want to run this on the initial connection, as we will use an event listener to handle updates:
    stop()
})

pausableWatch(error, (newError) => {
    if (error !== null)
        isConnecting.value = false;
})
</script>

<template>
    <div class="card m-4 p-4">
        <div v-if="!isSupported" class="alert alert-success" role="alert">
            Your browser does not support the Bluetooth Web API
        </div>
        <div class="alert alert-warning" role="alert">
            This page is unfinished: <a href="https://webbluetoothcg.github.io/web-bluetooth/#introduction-examples">web-bluetooth</a> only allows communication with BLE devices and is not traditionally used for browser to browser communication.

        </div>

        <div v-if="isSupported" class="">
            <div class="d-flex justify-content-center">
                <button class="btn btButton d-flex justify-content-center green" @click="requestDevice(), setLoading()">
                    Select a Bluetooth Peer
                </button>
                <div v-if="isConnecting">
                    <div class="spinner-grow green" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center">
                <div v-if="error">
                    <code class="alert-danger">{{ error }}</code>
                </div>
            </div>
        </div>
    </div>
    <div class="connectionStatus">
        <div v-if="isConnected" class="alert alert-success" role="alert">
            Connected to {{ device.name }} {{ batteryPercent + '%' }}
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