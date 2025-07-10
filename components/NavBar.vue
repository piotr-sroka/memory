<template>
  <nav class="nav py-5 w-full flex justify-between items-center">
    <div class="flex gap-5 items-center">
      <button
        type="button"
        class="new-game-btn btn text-white font-bold"
        @click="resetGame()"
      >
        Nowa gra
      </button>
      <span title="Tablica wyników">
        <TrophyIcon
          class="cursor-pointer size-8"
          @click="showScores()"
        />
      </span>
    </div>
    <div
      v-if="gameSeed"
      class="stats flex justify-end gap-6"
    >
      <div class="stats__seed flex items-center gap-2">
        #{{ gameSeed }}
        <span title="Kopiuj seeda">
          <DocumentDuplicateIcon
            class="cursor-pointer size-4"
            @click="copySeed"
          />
        </span>
      </div>
      <div class="stats__moves flex gap-3">
        Ruchy:<span class="stats__moves-count inline-block">{{ moves }}</span>
      </div>
      <div class="stats__time flex gap-3">
        Czas gry:<span class="stats__time-count inline-block">{{
          gameTime
        }}</span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { DocumentDuplicateIcon, TrophyIcon } from '@heroicons/vue/24/solid';
import { useClipboard } from '@vueuse/core';
import { formatTime } from '@utils/helpers/format-time';

const { gameSeed, moves, time, resetGame, showScores } = useGame();

const gameTime = computed(() => formatTime(time.value));

function copySeed() {
  if (gameSeed.value) {
    useClipboard().copy(gameSeed.value);
    useNuxtApp().$toast.success('Seed skopiowany do schowka');
  }
}
</script>

<style lang="scss" scoped>
.nav {
  .stats {
    &__seed {
      margin-right: 128px;

      @media (max-width: 768px) {
        margin-right: 0;
        margin-bottom: 8px;
      }
    }

    &__moves,
    &__time {
      &-count {
        min-width: 60px;
        @media (max-width: 768px) {
          min-width: unset;
        }
      }
    }

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      align-items: center;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
}
</style>
