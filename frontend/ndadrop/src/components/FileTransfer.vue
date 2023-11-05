<script lang="ts">
import PeerList from './PeerList.vue'
export default {
    components: {
        PeerList
    }
}
</script>

<template>
    <div class="file-transfer container">
        <div class="row">
            <PeerList />
        </div>
        <div class="row">

        </div>
    </div>
    <div class="bottom-sheet fixed-bottom">
            <input type="file" hidden />
            <button class="btn btn-success green add-file">Add File
                <img src="@/assets/file.svg" width="40" height="40" />
            </button>
        </div>
</template>

<style scoped>
.file-transfer {
    margin: 1rem;
}

.fill {
    height: 65vh;
    margin: auto;
}

.bottom-sheet {
    /* position: absolute; */
    /* bottom: 16px; */
    left: 50%;
    width: 30vw;
    margin-left: -15vw;
    display: flex;
    align-items: center;
    flex-direction: column;
    bottom: 1rem;
}

.add-file {
    padding: 1rem;
}

.green {
    background-color: hsla(160, 100%, 37%, 1);
    border: none;
}
</style>