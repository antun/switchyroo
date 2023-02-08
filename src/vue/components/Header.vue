<script setup>
defineProps({
  version: ''
})
</script>

<template>
  <div class="container">
    <h1>Switchyroo</h1>

    <div class="details">
      <a href="https://github.com/antun/switchyroo" target="_blank">about</a>
      <span class="version">v{{ version }}</span>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 0.36rem;
}

.details {
  margin-bottom: 0.36rem;
}

.details a:visited {
  color: #1a0dab;
}

h1 {
  font-size: 1.6rem;
  margin-bottom: 0;
}
</style>
