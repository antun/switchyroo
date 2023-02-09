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
  },
  matched: {
    type: Boolean
  }
});
defineEmits(['update-rule']);
</script>

<template>
  <div class="rule"
       v-bind:class="{ ruleMatched: matched }">
    <button class="deleteButton" @click="(event) => $emit('deleteRule', id)" >&#215;</button>
    <input type="text" class="ruleInput"
        v-bind:value="search" v-bind:title="search"
        @input="(event) => $emit('updateRule:search', id, event.target.value)" />
    &#8658;
    <input type="text" class="ruleInput"
        v-bind:value="replace" v-bind:title="replace"
        @input="(event) => $emit('updateRule:replace', id, event.target.value)" />
  </div>
</template>

<style scoped>
.ruleInput {
  width: 275px;
}

.rule {
  margin: 0.34rem;
  padding: 0.18rem;
}

.ruleMatched {
  outline-style: dotted;
  outline-color: #04aa6d;
  outline-width: 1px;
}

.deleteButton {
  margin-right: 0.2rem;
}
</style>
