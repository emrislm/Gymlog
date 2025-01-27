<template>
  <div class="flex flex-col mb-4">
    <h1 class="text-2xl font-bold mb-4">Wekelijkse statistieken</h1>

    <div v-if="!isLoadingWeekly" class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-8 mb-4">
      <StatsCard :stats="weeklyStats" />
    </div>
    <div v-else class="card flex justify-center">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s" />
    </div>

    <h1 class="text-2xl font-bold mb-4">Sets van vandaag</h1>

    <div v-if="!isLoadingDaily" class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-8 mb-4">
      <StatsCard :stats="dailyStats" />
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
import { useEventBus } from '~/composables/useEventBus';

/* CONSTANTS */
const { pb, getLogsOfCurrentWeek, getLogsByDate } = await usePB();
const { onRefreshStats } = useEventBus();
const isLoadingWeekly = ref(true);
const isLoadingDaily = ref(true);
const weeklyStats = ref<BodyPartStats[]>([]);
const dailyStats = ref<BodyPartStats[]>([]);

onMounted(() => {
  const cleanup = onRefreshStats(() => {
    getLogsWeekly();
    getLogsDaily();
  });

  // Cleanup event listener when component is unmounted
  onUnmounted(() => {
    cleanup();
  });
});

/* COMPUTED PROPERTIES */

/* FUNCTIONS */
const getLogsWeekly = async () => {
  isLoadingWeekly.value = true;

  /* Get all Logs of current user of current week */
  const logsResponse = await getLogsOfCurrentWeek(pb.authStore.record?.id || '');
  if (logsResponse.success) {
    const logs = logsResponse.data;

    /* Calculate weekly stats like total sets, reps... */
    weeklyStats.value = calculateStatsPerBodyPart(logs);

    isLoadingWeekly.value = false;
  }
  else console.error(logsResponse.error);
}

const getLogsDaily = async () => {
  isLoadingDaily.value = true;

  /* Get all Logs of current user of current week */
  const logsResponse = await getLogsByDate(pb.authStore.record?.id || '', Date.now());
  if (logsResponse.success) {
    const logs = logsResponse.data;
    console.log(logs);

    /* Calculate weekly stats like total sets, reps... */
    dailyStats.value = calculateStatsPerBodyPart(logs);

    isLoadingDaily.value = false;
  }
  else console.error(logsResponse.error);
}

const init = async () => {
  await getLogsWeekly();
  await getLogsDaily();
};

init();
</script>