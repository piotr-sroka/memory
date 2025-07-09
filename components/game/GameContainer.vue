<template>
  <section class="game w-full h-full flex justify-center items-center">
    <GameIntro v-if="!gameStarted" />
    <TheGame v-else />
    <TheDialog v-model="gameEnded">
      <template #header>
        <p class="text-2xl">Gratulacje!</p>
      </template>
      <template #default>
        <p>Podaj imię, aby zapisać swój wynik:</p>
        <input
          v-model="userName"
          placeholder="Podaj imię (minimum 3 znaki)"
          class="w-full p-2 text-gray-700"
        />
      </template>
      <template #actions>
        <button
          :disabled="!userName || userName.trim().length < 3"
          class="btn text-white font-bold"
          @click="saveScore(userName)"
        >
          Zapisz
        </button>
      </template>
    </TheDialog>
  </section>
</template>

<script setup lang="ts">
import GameIntro from '@components/game/GameIntro.vue';
import TheGame from '@components/game/TheGame.vue';

const { gameEnded, gameStarted, saveScore } = useGame();

const userName = ref();
</script>

<style lang="scss" scoped></style>
