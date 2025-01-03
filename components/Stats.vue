<template>
  <div class="flex flex-col mb-4">
    <h1 class="text-2xl font-bold mb-4">Wekelijkse statistieken</h1>

    <div v-if="!isLoading" class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-8">
      <StatsCard :stats="stats" />
    </div>
    <div v-else class="card flex justify-center">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s" />
    </div>
  </div>
</template>

<script setup lang="ts">
/* IMPORTS */
import type { BodyPartStats } from '@/types/types';
import { calculateStatsPerBodyPart } from '~/types/helper';

/* CONSTANTS */
const { pb, getLogsOfCurrentWeek } = await usePB();
const isLoading = ref(true);
const stats = ref<BodyPartStats[]>([]);

/* COMPUTED PROPERTIES */

/* FUNCTIONS */
const getLogsOfThisWeek = async () => {
  isLoading.value = true;

  /* Get all Logs of current user of current week */
  const logsResponse = await getLogsOfCurrentWeek(pb.authStore.record?.id || '');
  if (logsResponse.success) {
    const logs = logsResponse.data;

    /* Calculate weekly stats like total sets, reps... */
    stats.value = calculateStatsPerBodyPart(logs);

    isLoading.value = false;
  }
  else console.error(logsResponse.error);
}

const init = async () => {
  await getLogsOfThisWeek();
};

init();
</script>