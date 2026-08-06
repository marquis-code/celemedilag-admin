<template>
  <div></div>
</template>

<script setup lang="ts">
import { navigateTo } from 'nuxt/app'

// Immediately redirect the root path to the login page
await navigateTo('/login')
</script>
