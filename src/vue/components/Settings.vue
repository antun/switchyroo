<script setup>
defineProps({
  msg: {
    type: String,
    required: false
  },
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
        @input="(event) => $emit('update:enabled', event.target.checked)">
    <label for="checkbox">Enabled</label>

    <p v-if="!enabled" id="notEnabledText">
        Switching is not enabled.
    </p>
  </div>
</template>

<style scoped>

</style>
