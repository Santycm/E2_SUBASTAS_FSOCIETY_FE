<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import { AnimatePresence, motion } from 'motion-v'
</script>

<template>
  <AppLayout>
    <RouterView v-slot="{ Component, route }">
      <AnimatePresence mode="wait">
        <motion.div
          :key="route.fullPath"
          :initial="{
            opacity: 0,
            y: 35,
            scale: 0.97,
            filter: 'blur(12px)',
          }"
          :animate="{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
          }"
          :exit="{
            opacity: 0,
            y: -20,
            scale: 0.985,
            filter: 'blur(8px)',
          }"
          :transition="{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }"
        >
          <component :is="Component" />
        </motion.div>
      </AnimatePresence>
    </RouterView>
  </AppLayout>
</template>
