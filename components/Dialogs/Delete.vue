<template>
  <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Ben je zeker?"
    :style="{ minwidth: '25rem', maxWidth: '100%' }">
    <div class="flex items-center gap-4 mb-4">
      <span>Deze log wordt permanent verwijderd.</span>
    </div>
    <div class="flex justify-end gap-2">
      <Button label="Nee" severity="secondary" @click="close" />
      <Button label="Verwijder" @click="onConfirm" severity="danger" />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  'confirmDeleteLog': [];
}>();

const close = () => {
  emit('update:visible', false);
};

const onConfirm = () => {
  emit('confirmDeleteLog');
  close();
};
</script>
