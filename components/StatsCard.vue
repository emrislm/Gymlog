<template>
  <Card v-if="stats.length > 0" v-for="stat in stats" class="border hover:transition-colors duration-200" :style="{
    borderColor: `color-mix(in srgb, ${stat.color} 50%, black)`,
    '--hover-color': `color-mix(in srgb, ${stat.color} 15%, black)`,
  }" :class="['hover:!bg-[var(--hover-color)]']" :key="stat.id">
    <template #title>
      <div class="flex justify-between mb-2">
        <span class="truncate mr-2">{{ stat.bodyPart }}</span>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-2 mb-2">
        <div class="flex justify-between">
          <span class="font-semibold mr-2">Totaal Sets</span>
          <span>{{ stat.totalSets }}</span>
        </div>
      </div>
    </template>
  </Card>
  <div v-else class="flex justify-center">
    <span class="text-lg font-semibold">Geen statistieken gevonden</span>
  </div>
</template>

<script setup lang="ts">
import type { BodyPartStats } from '~/types/types';

defineProps<{
  stats: BodyPartStats[];
}>();
</script>