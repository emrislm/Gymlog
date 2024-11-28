<template>
  <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Voeg een log toe"
    :style="{ minwidth: '25rem', maxWidth: '100%' }">
    <div class="flex items-center gap-4 mb-4">
      <label for="exercise" class="font-semibold w-24">Oefening</label>

      <Select v-model="selectedExerciseModel" :options="exercises" optionLabel="label" optionGroupLabel="label"
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
      <InputNumber v-model="logModel.weight" suffix=" kg" inputId="weight" size="small" :min="0" :max="1000"
        :useGrouping="false" fluid />
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label for="sets" class="font-semibold w-24">Sets</label>
      <InputNumber v-model="logModel.sets" inputId="sets" size="small" :min="0" :max="1000" :useGrouping="false"
        fluid />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="reps" class="font-semibold w-24">Reps</label>
      <InputNumber v-model="logModel.reps" inputId="reps" size="small" :min="0" :max="1000" :useGrouping="false"
        fluid />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Annuleer" severity="secondary" @click="$emit('update:visible', false)"
        size="small" />
      <Button type="button" label="Opslaan" @click="onSave" size="small" />
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

const onSave = () => {
  emit('save');
};
</script>