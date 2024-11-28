<template>
  <div>
    <MegaMenu :model="items" class="p-4 border" style="border-radius: 0.25rem">
      <template #item="{ item }">
        <a v-if="item.root" @click="() => item.command"
          class="flex items-center cursor-pointer px-4 py-2 overflow-hidden relative font-semibold text-lg"
          style="border-radius: 2rem">
          <span>{{ item.label }}</span>
        </a>
      </template>
      <template #end>
        <span v-if="pb.authStore.isValid">Welkom, {{ pb.authStore.record?.name }}</span>
      </template>
    </MegaMenu>
  </div>
</template>

<script setup lang="ts">
const { logout, user, pb } = await useAuth();

const items = ref<any[]>([
  {
    label: 'Home',
    root: true,
    command: () => navigateTo("/")
  },
  {
    label: 'Mijn PRs',
    root: true,
    command: () => navigateTo("/personalrecords")
  },
  {
    label: 'Logout',
    root: true,
    command: () => logout()
  }
]);
</script>
