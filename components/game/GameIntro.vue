<template>
  <div class="w-full flex flex-col gap-5">
    <div class="flex justify-center items-center w-full gap-5 flex-wrap">
      <input
        id="gameSeed"
        v-model="gameSeed"
        placeholder="Podaj seeda gry (8 znaków)"
        type="text"
        class="w-1/2 min-w-64 p-2 text-gray-700"
        @input="onGameSeedInput"
      />
      <button
        :disabled="!gameSeed"
        type="button"
        class="btn text-white font-bold"
        @click="startGame(false)"
      >
        Graj
      </button>
    </div>
    <div class="flex justify-center items-center w-full gap-5 flex-wrap">
      <span>lub wybierz poziom</span>
      <div class="levels flex gap-5">
        <label
          v-for="level in gameLevels"
          :key="level.id"
          class="cursor-pointer px-6 py-3 rounded-md border transition-all text-sm font-medium flex items-center justify-center hover:border-orange-900 hover:shadow-sm"
          :class="{
            'text-white border-orange-900 shadow-md': gameLevel === level.id,
            'bg-white text-gray-700 border-gray-300': gameLevel !== level.id
          }"
        >
          <input
            v-model="gameLevel"
            type="radio"
            name="levels"
            :value="level.id"
            class="sr-only"
          />
          {{ level.name }}
        </label>
      </div>
      <span class="flex gap-5 items-center"
        >i

        <button
          class="btn"
          @click="startGame(true)"
        >
          Losuj grę
        </button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const gameLevels = [
  {
    id: 'easy',
    name: 'Łatwy'
  },
  {
    id: 'medium',
    name: 'Średni'
  },
  {
    id: 'hard',
    name: 'Trudny'
  }
];

const { gameSeed, gameLevel, startGame, trySetGameLevel } = useGame();

function onGameSeedInput() {
  trySetGameLevel();
}
</script>

<style lang="scss" scoped>
.levels {
  @media (max-width: 420px) {
    flex-direction: column;
    width: 100%;
    padding: 0 24px;
  }
}
</style>
