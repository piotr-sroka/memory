<template>
  <div class="items__container flex flex-col justify-center items-center gap-6 w-full">
    <div class="row">
      <div
        v-for="image in imagesForGame"
        :key="image.id"
        :class="['item', { selected: image.selected }, { solved: image.solved }]"
        @click="selectImage(image)"
      >
        <img
          :src="image.image"
          class="item__image"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gameLevelToSizeMap } from '@typings/Game.model';

const { imagesForGame, gameLevel, selectImage } = useGame();

const numberOfColumns = gameLevelToSizeMap[gameLevel.value].split('x')[0];
</script>

<style lang="scss" scoped>
.items__container {
  max-width: 800px;
}

.row {
  display: grid;
  grid-template-columns: repeat(v-bind(numberOfColumns), 1fr);
  gap: 12px;
  width: 100%;
}

.col {
  display: flex;
  justify-content: center;
}

.item {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  border: 1px solid #fff;
  position: relative;
  &__image {
    max-width: 100%;
    max-height: 100%;
  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #7c2d12;
  }

  &.selected,
  &.solved {
    &::before {
      background-color: transparent;
    }
  }

  &.solved {
    border-color: #7c2d12;
    opacity: 0.4;
  }
}
</style>
