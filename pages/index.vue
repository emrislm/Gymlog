<template>
  <div class="py-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Mijn logs</h1>
    </div>
    <div class="flex justify-between items-center mb-4">
      <DatePicker v-model="filterDate" size="small" showButtonBar dateFormat="dd/mm/yy">
        <template #date="slotProps">
          <strong
            v-if="logs.some(log => isSameDay(new Date(log.date), new Date(slotProps.date.year, slotProps.date.month, slotProps.date.day)))"
            style="color: cyan;">
            {{ slotProps.date.day }}
          </strong>
          <template v-else>{{ slotProps.date.day }}</template>
        </template>
      </DatePicker>
      <Button label="Nieuwe log" @click="showNewLog = true" />
    </div>
    <div v-if="!isLoading" class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <Log :logs="filteredLogs" @refresh-logs="getUserLogs" />
    </div>
    <div v-else class="card flex justify-center">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s" />
    </div>

    <DialogsAddLog :visible="showNewLog" @update:visible="showNewLog = $event" :exercises="exercises"
      :selected-exercise="selectedExercise" @update:selected-exercise="selectedExercise = $event"
      :log-object="newLogObject" @update:log-object="newLogObject = $event" @save="saveLog" />
  </div>
</template>

<script setup lang="ts">
/* IMPORTS */
import type { Log } from '@/types/types';

/* CONSTANTS */
const { pb, getLogs, addLog, getExercises } = await usePB();
const isLoading = ref(true);
const logs = ref<any[]>([]);
const showNewLog = ref(false);

const selectedExercise = ref<any>({});
const exercises = ref<any[]>([]);

const filterDate = ref<Date>(new Date());

const newLogObject = ref<Log>({
  date: new Date().toISOString().toString(),
  exercise: '',
  reps: 0,
  sets: 0,
  user: pb.authStore.record?.id || '',
  weight: 0
});

/* COMPUTED PROPERTIES */
const filteredLogs = computed(() => {
  if (!logs.value) return [];

  return logs.value.filter((log) => {
    const logDate = new Date(log.date);
    const filterDateValue = new Date(filterDate.value);

    return logDate.getFullYear() === filterDateValue.getFullYear() &&
      logDate.getMonth() === filterDateValue.getMonth() &&
      logDate.getDate() === filterDateValue.getDate();
  });
});

/* FUNCTIONS */
const getUserLogs = async () => {
  isLoading.value = true;
  const logsResult = await getLogs(pb.authStore.record?.id || '');
  if (logsResult.success) {
    logs.value = logsResult.data;
    isLoading.value = false;
  }
  else console.error(logsResult.error);
};

const getAllExercises = async () => {
  const exercisesResult = await getExercises();
  if (exercisesResult.success) {
    exercises.value = exercisesResult.data;
  } else console.error(exercisesResult.error);
};

const saveLog = async () => {
  newLogObject.value.exercise = selectedExercise.value.value;

  await addLog(newLogObject.value);
  await getUserLogs();

  showNewLog.value = false;
  selectedExercise.value = {};
  newLogObject.value = {
    date: new Date().toISOString().toString(),
    exercise: '',
    reps: 0,
    sets: 0,
    user: pb.authStore.record?.id || '',
    weight: 0
  };
};

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
};

const init = async () => {
  await getUserLogs();
  await getAllExercises();
};

init();
</script>
