<script lang="ts">
export default {
}
</script>

<template>
    <div class="list-group">
        <div v-if="true">
            <button type="button" class="list-group-item list-group-item-action lg active green" aria-current="true">
                Selected Peer 1
            </button>
        </div>
        <div v-if="true">
            <button type="button" class="list-group-item list-group-item-action lg">Peer 2</button>
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