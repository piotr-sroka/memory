<template>
  <section class="game w-full h-full flex justify-center items-center">
    <GameIntro v-if="!gameStarted" />
    <TheGame v-else />
  </section>
</template>

<script setup lang="ts">
import GameIntro from '@components/game/GameIntro.vue';
import TheGame from '@components/game/TheGame.vue';

const { gameStarted } = useGame();
</script>

<style lang="scss" scoped></style>
