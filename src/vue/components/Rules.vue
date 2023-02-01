<script setup>
defineProps({
  rules: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div>
    <div v-for="rule in rules">
      <input type="text" class="ruleInput"
          v-bind:value="rule.search" v-bind:title="rule.search"
          @input="(event) => $emit('update:rule.search', event.target.value)" />
      &gt;
      <input type="text" class="ruleInput"
          v-bind:value="rule.replace" v-bind:title="rule.replace"
          @input="(event) => $emit('update:rule.replace', event.target.value)" />
      <button>x</button>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}

.ruleInput {
  width: 15rem;
}
</style>
