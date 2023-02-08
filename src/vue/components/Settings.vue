<script setup>
defineProps({
  enabled: {
    type: Boolean,
    required: true
  }
})
</script>

<template>
  <div>
    <input type="checkbox" id="enabledCheckbox" 
        v-bind:checked="enabled"
        @input="(event) => $emit('enabledChecked', event.target.checked)">
    <label for="checkbox">Enabled</label>
  </div>
</template>

<style scoped>

</style>
