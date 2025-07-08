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
      v-if="gameSeed"
      class="stats flex justify-end gap-6"
    >
      <div class="stats__seed">#{{ gameSeed }}</div>
      <div class="stats__moves flex gap-3">
        Ruchy:<span class="stats__moves-count inline-block">{{ moves }}</span>
      </div>
      <div class="stats__time flex gap-3">
        Czas gry:<span class="stats__time-count inline-block">{{ gameTime }}</span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { gameSeed, moves, time, resetGame } = useGame();

const gameTime = computed(() => {
  const h = Math.floor(time.value / 3600)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((time.value % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const s = (time.value % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
});
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
