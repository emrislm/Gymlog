<template>
  <div class="min-h-screen flex items-center justify-center">
    <Card class="w-full max-w-md">
      <template #title>
        <h1 class="text-2xl font-bold text-center">Register</h1>
      </template>
      <template #content>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="flex flex-col gap-2">
            <label for="name">Naam</label>
            <InputText id="name" v-model="name" class="w-full" :class="{ 'p-invalid': errors.name }" />
            <small class="text-red-500">{{ errors.name }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="email">Email</label>
            <InputText id="email" v-model="email" type="email" class="w-full" :class="{ 'p-invalid': errors.email }" />
            <small class="text-red-500">{{ errors.email }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="password">Wachtwoord</label>
            <Password v-model="password" :feedback="false" class="w-full" :class="{ 'p-invalid': errors.password }" />
            <small class="text-red-500">{{ errors.password }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="passwordConfirm">Wachtwoord bevestiging</label>
            <Password v-model="passwordConfirm" :feedback="false" class="w-full"
              :class="{ 'p-invalid': errors.passwordConfirm }" />
            <small class="text-red-500">{{ errors.passwordConfirm }}</small>
          </div>

          <div class="flex flex-col gap-4">
            <Button type="submit" label="Register" class="w-full" />
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
const { register } = await useAuth();

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const errors = ref({
  name: '',
  email: '',
  password: '',
  passwordConfirm: ''
});

const handleRegister = async () => {
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
  if (password.value !== passwordConfirm.value) {
    errors.value.passwordConfirm = 'Wachtwoorden komen niet overeen';
  }
  if (errors.value.name || errors.value.email || errors.value.password || errors.value.passwordConfirm) return;

  const result = await register(name.value, email.value, password.value, passwordConfirm.value);
  if (!result.success) {
    errors.value.password = result.error ?? 'Registratie is niet gelukt';
  }
};
</script>