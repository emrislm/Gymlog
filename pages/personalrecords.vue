<template>
  <div>
    <h1>Mijn PRs</h1>
  </div>
</template>

<script setup lang="ts">
const { pb } = await useAuth();

const mrprs = await pb.collection("personal_records").getFullList();
console.log("mrprs", mrprs);
</script>