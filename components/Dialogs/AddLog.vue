<template>
  <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Voeg een log toe"
    :style="{ minwidth: '25rem', maxWidth: '100%' }">

    <div class="flex flex-col gap-4 mb-4">
      <div class="flex flex-col">
        <Select v-model="selectedExerciseModel" :options="exercises" optionLabel="label" optionGroupLabel="label"
          optionGroupChildren="items" :invalid="!selectedExerciseModel" placeholder="Kies een oefening">
          <template #optiongroup="slotProps">
            <div class="flex items-center">
              <div>{{ slotProps.option.label }}</div>
            </div>
          </template>
        </Select>
        <small class="text-red-500">{{ errors.exercise }}</small>
      </div>

      <div class="flex flex-col">
        <div class="grid grid-cols-2 items-center">
          <span>Gewicht (kg)</span>
          <InputNumber v-model="logModel.weight" :minFractionDigits="0" :invalid="logModel.weight === 0"
            :maxFractionDigits="2" inputId="weight" size="small" :useGrouping="false" locale="nl-BE" fluid />
        </div>
        <small class="text-red-500">{{ errors.weight }}</small>
      </div>

      <div class="flex flex-col">
        <div class="grid grid-cols-2 items-center">
          <span>Sets</span>
          <InputNumber v-model="logModel.sets" inputId="sets" size="small" :invalid="logModel.sets === 0"
            :useGrouping="false" fluid />
        </div>
        <small class="text-red-500">{{ errors.sets }}</small>
      </div>

      <div class="flex flex-col">
        <div class="grid grid-cols-2 items-center">
          <span>Reps</span>
          <InputNumber v-model="logModel.reps" inputId="reps" size="small" :invalid="logModel.reps === 0"
            :useGrouping="false" fluid />
        </div>
        <small class="text-red-500">{{ errors.reps }}</small>
      </div>
    </div>

    <div class="flex justify-end gap-2">
      <Button type="button" label="Annuleer" severity="secondary" @click="handleCancel" size="small" />
      <Button type="button" label="Opslaan" @click="handleSave" size="small" />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import type { Log } from '@/types/types';

const props = defineProps<{
  visible: boolean;
  exercises: any[];
  selectedExercise: any;
  logObject: Log;
}>();

const errors = ref({ exercise: '', weight: '', sets: '', reps: '' });

const emit = defineEmits<{
  'update:visible': [value: boolean];
  'update:selectedExercise': [value: any];
  'update:logObject': [value: Log];
  'save': [];
}>();

const selectedExerciseModel = computed({
  get: () => props.selectedExercise,
  set: (value) => emit('update:selectedExercise', value)
});

const logModel = computed({
  get: () => props.logObject,
  set: (value) => emit('update:logObject', value)
});

const handleCancel = () => {
  // Reset errors
  errors.value = { exercise: '', weight: '', sets: '', reps: '' };

  emit('update:visible', false)
};

const handleSave = () => {
  // Reset errors
  errors.value = { exercise: '', weight: '', sets: '', reps: '' };

  // Validate
  if (selectedExerciseModel.value.label == undefined) errors.value.exercise = 'Oefening is vereist';
  if (!logModel.value.weight) errors.value.weight = 'Gewicht is vereist';
  if (!logModel.value.sets) errors.value.sets = 'Sets is vereist';
  if (!logModel.value.reps) errors.value.reps = 'Reps is vereist';
  if (errors.value.exercise || errors.value.weight || errors.value.sets || errors.value.reps) return;

  emit('save');
};
</script>