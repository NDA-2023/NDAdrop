<script lang="ts">
</script>

<template>
    <div class="gray">

    </div>
    <div class="message-control">
        <textarea class="form-control message" placeholder="Aa" id="description" rows="1" v-model="message"></textarea>
        <button class="btn btn-link message-button">
            <img src="@/assets/send-message.svg" width="40" height="40"/>
        </button>
    </div>
</template>

<style scoped>

.gray {
    background-color: #ececec;
    height: calc(85vh - 200px);
    margin: 1rem -1rem 0 -1rem;
}

@media (min-height: 700px) {
    .gray {
        margin: 1rem -1rem;
    }
}

@media (min-width: 700px) {
    .gray {
        height: calc(85vh - 100px);
        margin: 1rem;
        border-radius: 15px
    }
}

.green {
    background-color: hsla(160, 100%, 37%, 1);
    border: none;
}

.message-control {
    display: flex;
    margin: auto 0 1rem 1rem;
}

.message {
    /* width: 400px; */
    margin: auto 0 auto auto;
}

.message-button {

}

</style>