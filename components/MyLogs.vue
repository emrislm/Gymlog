<template>
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">Mijn logs</h1>
  </div>
  <div class="flex justify-between items-center mb-4">
    <div class="flex gap-2 sm:gap-4 items-center">
      <DatePicker v-model="filterDate" showButtonBar dateFormat="dd/mm/yy">
        <template #date="slotProps">
          <strong
            v-if="logs.some(log => isSameDay(new Date(log.date), new Date(slotProps.date.year, slotProps.date.month, slotProps.date.day)))"
            style="color: cyan;">
            {{ slotProps.date.day }}
          </strong>
          <template v-else>{{ slotProps.date.day }}</template>
        </template>
      </DatePicker>

      <Button icon="pi pi-sync" severity="contrast" rounded variant="outlined" @click="getUserLogs" />
    </div>
    <Button icon="pi pi-plus" @click="showNewLog = true" />
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
</template>

<script setup lang="ts">
/* IMPORTS */
import type { Log } from '@/types/types';
import { useEventBus } from '@/composables/useEventBus';
import { isSameDay } from '@/types/helper';

/* CONSTANTS */
const { pb, getLogs, addLog, getExercises } = await usePB();
const { refreshStats } = useEventBus();
const isLoading = ref(true);
const logs = ref<any[]>([]);
const showNewLog = ref(false);

const selectedExercise = ref<any>({});
const exercises = ref<any[]>([]);

const filterDate = ref<Date>(new Date());

const newLogObject = ref<Log>({});

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
const stripHtml = (html: string) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const getUserLogs = async () => {
  isLoading.value = true;
  logs.value = [];
  const logsResult = await getLogs(pb.authStore.record?.id || '');
  if (logsResult.success) {
    logs.value = logsResult.data.map(log => ({
      ...log,
      remarks: log.remarks ? stripHtml(log.remarks) : ''
    }));
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
  newLogObject.value.user = pb.authStore.record?.id;
  newLogObject.value.date = new Date().toISOString().toString();

  await addLog(newLogObject.value);
  await getUserLogs();
  refreshStats();

  showNewLog.value = false;
  selectedExercise.value = {};
  newLogObject.value = {
    date: new Date().toISOString().toString(),
    exercise: '',
    reps: 0,
    sets: 0,
    user: pb.authStore.record?.id || '',
    weight: 0,
    remarks: '',
  };
};

const init = async () => {
  await getUserLogs();
  await getAllExercises();
};

init();
</script>
