<script setup lang="ts">

</script>

<template>
  <div class="greetings logoTitle">
    <img alt="NDA drop logo" class="logo" src="@/assets/logo.svg" width="75" height="75" />
    <div>
      <h1 class="green">NDA Drop</h1>
      <h3>
        P2P sharing and chat communication.
      </h3>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  left: 10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

.greetings {
  max-width: 500px;
  min-width: 0;
  margin: 0 auto;
}

.logoTitle {
  display: flex;
  place-items: center;
}

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }

  .greetings {
    margin: 0;
    min-width: 500px;
  }
}
</style>
