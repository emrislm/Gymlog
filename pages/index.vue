<template>
  <div class="py-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Mijn sessies</h1>
    </div>
    <div class="flex justify-between items-center mb-4">
      <DatePicker v-model="filterDate" size="small" showButtonBar dateFormat="dd/mm/yy" />
      <Button label="Nieuwe sessie" @click="showNewLog = true" />
    </div>
    <div v-if="!isLoading" class="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-3">
      <Log :logs="filteredLogs" />
    </div>
    <div v-else class="card flex justify-center">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s" />
    </div>

    <Dialog v-model:visible="showNewLog" modal header="Voeg een log toe"
      :style="{ minwidth: '25rem', maxWidth: '100%' }">
      <div class="flex items-center gap-4 mb-4">
        <label for="exercise" class="font-semibold w-24">Oefening</label>

        <Select v-model="selectedExercise" :options="exercises" optionLabel="label" optionGroupLabel="label"
          optionGroupChildren="items" placeholder="Kies een oefening" class="w-full md:w-56">
          <template #optiongroup="slotProps">
            <div class="flex items-center">
              <div>{{ slotProps.option.label }}</div>
            </div>
          </template>
        </Select>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="weight" class="font-semibold w-24">Gewicht</label>
        <InputNumber v-model="newLogObject.weight" suffix=" kg" inputId="weight" size="small" :min="0" :max="1000"
          :useGrouping="false" fluid />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="sets" class="font-semibold w-24">Sets</label>
        <InputNumber v-model="newLogObject.sets" inputId="sets" size="small" :min="0" :max="1000" :useGrouping="false"
          fluid />
      </div>
      <div class="flex items-center gap-4 mb-8">
        <label for="reps" class="font-semibold w-24">Reps</label>
        <InputNumber v-model="newLogObject.reps" inputId="reps" size="small" :min="0" :max="1000" :useGrouping="false"
          fluid />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Annuleer" severity="secondary" @click="showNewLog = false" size="small" />
        <Button type="button" label="Opslaan" @click="saveLog" size="small" />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
/* IMPORTS */
import type { Log } from '@/types/types';

/* CONSTANTS */
const { pb, addLog } = await useAuth();
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
const getLogs = async () => {
  const records = await pb.collection('logs').getFullList({
    sort: '-date',
    expand: 'exercise.body_part',
    filter: `user = "${pb.authStore.record?.id}"`
    /* filter: `user = "${user.value.id}"` */
  });

  logs.value = records as Log[];
  isLoading.value = false;
};

const getExercises = async () => {
  const records = await pb.collection('exercises').getFullList({
    sort: '-created',
    expand: 'body_part'
  });

  const transformed = Object.values(
    records.reduce((acc: Record<string, { label: string; items: { label: string; value: string }[] }>, obj) => {
      const bodyPartName = obj.expand?.body_part.name;
      if (!acc[bodyPartName]) {
        acc[bodyPartName] = {
          label: bodyPartName,
          items: []
        };
      }
      acc[bodyPartName].items.push({ label: obj.name, value: obj.id });
      return acc;
    }, {})
  );

  exercises.value = transformed;
};

const saveLog = async () => {
  newLogObject.value.exercise = selectedExercise.value.value;
  await addLog(newLogObject.value);
  await getLogs();
  showNewLog.value = false;
  selectedExercise.value = {};
};

const init = async () => {
  await getLogs();
  await getExercises();
};

init();
</script>
