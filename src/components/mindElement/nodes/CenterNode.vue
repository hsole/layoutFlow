<template>
  <div v-show="!isEditing">
    <div v-for="(text, index) in rowText" :key="index">
      {{text}}
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    properties: Object,
    text: String,
    isSelected: Boolean,
    isEditing: Boolean,
  },
  computed: {
    rowText() {
      if (this.text) {
        return this.text.split(/\n/);
      }
      return []
    },
  },
}
</script>
<style scoped>
</style>
