<template>
  <TheLoader v-if="images.pending" />
  <GameContainer v-else />
</template>

<script setup lang="ts">
import GameContainer from '@components/game/GameContainer.vue';

const { images, fetchImages } = useGame();

onMounted(() => fetchImages());
</script>

<style lang="scss" scoped></style>
