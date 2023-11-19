<script setup lang="ts">
</script>

<template>
  <div class="d-flex justify-content-center header">
    <img alt="NDA drop logo" class="logo" src="@/assets/logo.svg" />
    <div>
      <h1 class="green title">NDA Drop</h1>
      <h3 class="subtitle">
        P2P file sharing and chat communication.
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

.logo {
  width: 40px;
  height: 40px;
}

.header {
  display: flex;
  place-items: center;
}

.title {
  font-size: 3vh;
}

.subtitle {
  font-size: 2vh;
}

@media (min-width: 1024px) {

  .h1,
  .h3 {
    text-align: left;
  }

  .header {
    margin: 0;
    min-width: 500px;
  }

  .logo {
    width: 75px;
    height: 75px;
  }
}
</style>
