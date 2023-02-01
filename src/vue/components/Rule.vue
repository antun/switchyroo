<script setup>
defineProps({
  id: {
    type: Number,
    required: true
  },
  search: {
    type: String,
    required: true
  },
  replace: {
    type: String,
    required: true
  }
});
defineEmits(['update-rule']);
</script>

<template>
  <div class="rule">
    <input type="text" class="ruleInput"
        v-bind:value="search" v-bind:title="search"
        @input="(event) => $emit('updateRule:search', id, event.target.value)" />
    &gt;
    <input type="text" class="ruleInput"
        v-bind:value="replace" v-bind:title="replace"
        @input="(event) => $emit('updateRule:replace', id, event.target.value)" />
    <button @click="(event) => $emit('deleteRule', id)" >x</button>
  </div>
</template>

<style scoped>
.ruleInput {
  width: 15rem;
}

.rule {
  padding-bottom: 0.3rem;
}
</style>
