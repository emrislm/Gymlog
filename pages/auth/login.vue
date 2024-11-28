<template>
  <div class="min-h-screen flex items-center justify-center">
    <Card class="w-full max-w-md">
      <template #title>
        <h1 class="text-2xl font-bold text-center">Login</h1>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="space-y-4">
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

          <div class="flex flex-col gap-4">
            <Button type="submit" label="Login" class="w-full" />
            <div class="text-center">
              <NuxtLink to="/auth/register" class="text-blue-500 hover:underline">
                Heb je nog geen account? Registreer
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
const { login } = await usePB();

const email = ref("");
const password = ref('');
const errors = ref({ email: '', password: '' });

const handleLogin = async () => {
  // Reset errors
  errors.value = { email: '', password: '' };

  // Validate
  if (!email.value) errors.value.email = 'Email is vereist';
  if (!password.value) errors.value.password = 'Wachtwoord is vereist';
  if (errors.value.email || errors.value.password) return;

  const result = await login(email.value, password.value);
  if (!result.success) {
    errors.value.password = result.error ?? 'Login is niet gelukt';
  }
};
</script>