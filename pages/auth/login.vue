<template>
  <div class="min-h-screen flex items-center justify-center">
    <Card class="w-full max-w-md">
      <template #title>
        <h1 class="text-2xl font-bold text-center">Login</h1>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="space-y-4 mt-4">
          <div class="flex flex-col gap-2 w-full">
            <FloatLabel>
              <InputText id="email" v-model="email" type="email" class="w-full"
                :class="{ 'p-invalid': errors.email }" />
              <label for="email">Email</label>
            </FloatLabel>
            <small class="text-red-500">{{ errors.email }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <FloatLabel>
              <Password input-id="password" v-model="password" :feedback="false"
                :class="{ 'p-invalid': errors.password }" toggle-mask fluid />
              <label for="password">Wachtwoord</label>
            </FloatLabel>
            <small class="text-red-500">{{ errors.password }}</small>
          </div>

          <div class="flex flex-col gap-4">
            <Button type="submit" label="Login" class="w-full" :loading="isLoading" />
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
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;

  // Reset errors
  errors.value = { email: '', password: '' };

  // Validate
  if (!email.value) errors.value.email = 'Email is vereist';
  if (!password.value) errors.value.password = 'Wachtwoord is vereist';
  if (errors.value.email || errors.value.password) {
    isLoading.value = false;
    return;
  }

  const result = await login(email.value, password.value);
  if (!result.success) {
    errors.value.password = result.error ?? 'Login is niet gelukt';
    isLoading.value = false;
    return;
  }
  isLoading.value = false;
};
</script>