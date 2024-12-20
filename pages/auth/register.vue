<template>
  <div class="min-h-screen flex items-center justify-center">
    <Card class="w-full max-w-md">
      <template #title>
        <h1 class="text-2xl font-bold text-center">Register</h1>
      </template>
      <template #content>
        <form @submit.prevent="handleRegister" class="space-y-4 mt-4">
          <div class="flex flex-col gap-2">
            <FloatLabel>
              <InputText id="name" v-model="name" class="w-full" :class="{ 'p-invalid': errors.name }" />
              <label for="name">Voornaam Naam</label>
            </FloatLabel>
            <small class="text-red-500">{{ errors.name }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <FloatLabel>
              <InputText id="email" v-model="email" type="email" class="w-full"
                :class="{ 'p-invalid': errors.email }" />
              <label for="email">Email</label>
            </FloatLabel>
            <small class="text-red-500">{{ errors.email }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <FloatLabel>
              <Password v-model="password" :feedback="false" class="w-full" :class="{ 'p-invalid': errors.password }"
                toggle-mask fluid />
              <label for="password">Wachtwoord</label>
            </FloatLabel>
            <small class="text-red-500">{{ errors.password }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <FloatLabel>
              <Password v-model="passwordConfirm" :feedback="false" class="w-full"
                :class="{ 'p-invalid': errors.passwordConfirm }" toggle-mask fluid />
              <label for="passwordConfirm">Wachtwoord bevestiging</label>
            </FloatLabel>
            <small class="text-red-500">{{ errors.passwordConfirm }}</small>
          </div>

          <div class="flex flex-col gap-4">
            <Button type="submit" label="Registreer" :loading="isLoading" class="w-full" />
            <div class="text-center">
              <NuxtLink to="/auth/login" class="text-blue-500 hover:underline">
                Heb je al een account? Login
              </NuxtLink>
            </div>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});
const { register } = await usePB();

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const isLoading = ref(false);
const errors = ref({
  name: '',
  email: '',
  password: '',
  passwordConfirm: ''
});

const handleRegister = async () => {
  isLoading.value = true;

  // Reset errors
  errors.value = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  };

  // Validate
  if (!name.value) errors.value.name = 'Naam is vereist';
  if (!email.value) errors.value.email = 'Email is vereist';
  if (!password.value) errors.value.password = 'Wachtwoord is vereist';
  if (!passwordConfirm.value) errors.value.passwordConfirm = 'Wachtwoord bevestiging is vereist';
  if (password.value !== passwordConfirm.value) errors.value.passwordConfirm = 'Wachtwoorden komen niet overeen';
  if (errors.value.name || errors.value.email || errors.value.password || errors.value.passwordConfirm) {
    isLoading.value = false;
    return;
  }

  const result = await register(name.value, email.value, password.value, passwordConfirm.value);
  if (!result.success) {
    errors.value.password = result.error ?? 'Registratie is niet gelukt';
    isLoading.value = false;
    return;
  }
  isLoading.value = false;
};
</script>