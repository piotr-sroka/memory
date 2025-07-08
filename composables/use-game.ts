import type { FetchError } from 'ofetch';

import { fetchImagesList } from '@services/images.service';

import { GameLevel, gameLevelToSizeMap } from '@typings/Game.model';
import type { GameI } from '@typings/Game.model';

import { shuffle } from '@utils/helpers/random-seed';

const state = reactive<GameI>({
  gameLevel: GameLevel.EASY,
  gameSeed: null,
  gameStarted: false,
  images: {
    data: null,
    error: null,
    pending: false
  },
  imagesForGame: []
});

export function useGame() {
  const { gameLevel, gameSeed, gameStarted, images, imagesForGame } = toRefs(state);

  async function fetchImages() {
    images.value.pending = true;
    try {
      const response = await fetchImagesList();
      if (response) {
        images.value.data = response;
      }
    } catch (error) {
      if (error) {
        images.value.error = error as FetchError;
      }
    } finally {
      setTimeout(() => {
        images.value.pending = false;
      }, 1000);
    }
  }

  function startGame(random = false) {
    if (images.value.data) {
      if (random) {
        gameSeed.value = null;
      }
      if (!trySetGameLevel()) return alert('Niepoprawny seed'); // to improve
      const [cols, rows] = gameLevelToSizeMap[gameLevel.value].split('x').map(Number);
      const numberOfImages = cols * rows;
      const { seed, shuffled } = shuffle(images.value.data, gameSeed.value, gameLevel.value);
      const selectedImages = [...shuffled.slice(0, numberOfImages / 2)];
      imagesForGame.value = shuffle([...selectedImages, ...selectedImages], gameSeed.value, gameLevel.value).shuffled;
      gameSeed.value = seed;
      gameStarted.value = true;
    }
  }

  function resetGame() {
    gameLevel.value = GameLevel.EASY;
    gameSeed.value = null;
    gameStarted.value = false;
  }

  function trySetGameLevel() {
    if (gameSeed.value) {
      const seedParts = gameSeed.value.split('-');
      const mayBeGameLevel = seedParts[seedParts.length - 1];
      if (Object.values(GameLevel).includes(mayBeGameLevel as GameLevel)) {
        gameLevel.value = mayBeGameLevel as GameLevel;
        return true;
      } else {
        return false;
      }
    }
  }

  return {
    gameLevel,
    gameSeed,
    gameStarted,
    images,
    imagesForGame,
    fetchImages,
    startGame,
    resetGame,
    trySetGameLevel
  };
}
