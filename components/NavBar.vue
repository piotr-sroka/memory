<template>
  <nav class="nav py-5 w-full flex justify-between items-center">
    <button
      type="button"
      class="btn text-white font-bold"
      @click="resetGame()"
    >
      Nowa gra
    </button>
    <div
      v-if="gameStarted"
      class="stats flex justify-end gap-6"
    >
      <div class="stats__seed">#{{ gameSeed }}</div>
      <div class="stats__moves flex gap-3">Ruchy:<span class="stats__moves-count inline-block">0</span></div>
      <div class="stats__time flex gap-3">Czas gry:<span class="stats__time-count inline-block">00:00</span></div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { gameSeed, resetGame } = useGame();

const gameStarted = computed(() => gameSeed.value);
</script>

<style lang="scss" scoped>
.nav {
  .stats {
    &__seed {
      margin-right: 128px;
    }

    &__moves,
    &__time {
      &-count {
        min-width: 60px;
      }
    }
  }
}
</style>
