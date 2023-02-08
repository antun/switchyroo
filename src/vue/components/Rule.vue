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
    <button class="deleteButton" @click="(event) => $emit('deleteRule', id)" >x</button>
    <input type="text" class="ruleInput"
        v-bind:value="search" v-bind:title="search"
        @input="(event) => $emit('updateRule:search', id, event.target.value)" />
    &gt;
    <input type="text" class="ruleInput"
        v-bind:value="replace" v-bind:title="replace"
        @input="(event) => $emit('updateRule:replace', id, event.target.value)" />
  </div>
</template>

<style scoped>
.ruleInput {
  width: 16rem;
}

.rule {
  padding-bottom: 0.3rem;
}

.deleteButton {
  margin-right: 0.2rem;
}
</style>
