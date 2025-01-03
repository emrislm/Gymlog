<template>
  <Card v-if="logs.length > 0" v-for="log in logs" class="border hover:transition-colors duration-200" :style="{
    borderColor: `color-mix(in srgb, ${log.expand.exercise.expand.body_part.color} 50%, black)`,
    '--hover-color': `color-mix(in srgb, ${log.expand.exercise.expand.body_part.color} 15%, black)`,
  }" :class="['hover:!bg-[var(--hover-color)]']" @click="handleDeleteLog(log.id)" :key="log.id">
    <template #title>
      <div class="flex justify-between mb-2">
        <span class="truncate mr-2">{{ log.expand.exercise.name }}</span>
        <Tag :value="log.expand.exercise.expand.body_part.name"
          :style="{ backgroundColor: log.expand.exercise.expand.body_part.color, height: 'min-content' }" rounded />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-2 mb-2">
        <div class="flex justify-between">
          <span class="font-semibold mr-2">Gewicht</span>
          <span>{{ log.weight }} kg</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold mr-2">Sets</span>
          <span>{{ log.sets }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold mr-2">Reps</span>
          <span>{{ log.reps }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold mr-2">Opmerking</span>
          <span class="truncate italic">{{ log.remarks ? log.remarks : '/' }}</span>
        </div>
      </div>
    </template>
    <!-- <template #footer>
      <div class="flex justify-end">
        <i class="pi pi-trash cursor-pointer" @click="handleDeleteLog(log.id)" style="color: red;"></i>
      </div>
    </template> -->
  </Card>
  <div v-else class="flex justify-center">
    <span class="text-lg font-semibold">Geen loggen gevonden voor deze dag</span>
  </div>

  <DialogsDelete :visible="showConfirmDeleteLog" @update:visible="showConfirmDeleteLog = $event"
    @confirmDeleteLog="confirmDeleteLog" />
</template>

<script setup lang="ts">
defineProps<{
  logs: any[];
}>();

const emit = defineEmits<{
  'refresh-logs': [];
}>();

const { deleteLog } = await usePB();

const showConfirmDeleteLog = ref(false);
let selectedLogId = ref<string | null>(null);

const handleDeleteLog = (logId: string) => {
  selectedLogId.value = logId;
  showConfirmDeleteLog.value = true;
};

const confirmDeleteLog = async () => {
  if (selectedLogId.value) {
    console.log('Deleting log', selectedLogId.value);

    await deleteLog(selectedLogId.value);
    emit('refresh-logs');

    showConfirmDeleteLog.value = false;
    selectedLogId.value = null;
  }
};
</script>