<template>
  <Card v-if="logs.length > 0" v-for="log in logs" class="border"
    :style="{ borderColor: `color-mix(in srgb, ${log.expand.exercise.expand.body_part.color} 50%, black)` }"
    :key="log.id">
    <template #title>
      <div class="flex justify-between">
        <span>{{ log.expand.exercise.name }}</span>
        <Tag :value="log.expand.exercise.expand.body_part.name"
          :style="{ backgroundColor: log.expand.exercise.expand.body_part.color, height: 'min-content' }" rounded />
      </div>
    </template>
    <template #subtitle>{{ format(new Date(log.date), 'dd-MM-yyyy') }}</template>
    <template #content>
      <div class="flex flex-col gap-2">
        <div class="flex justify-between">
          <span>Weight</span>
          <span>{{ log.weight }} kg</span>
        </div>
        <div class="flex justify-between">
          <span>Sets</span>
          <span>{{ log.sets }}</span>
        </div>
        <div class="flex justify-between">
          <span>Reps</span>
          <span>{{ log.reps }}</span>
        </div>
      </div>
    </template>
  </Card>
  <div v-else class="flex justify-center">
    <span class="text-lg font-semibold">Geen loggen gevonden voor deze dag</span>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';

defineProps<{
  logs: any[];
}>();


</script>