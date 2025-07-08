import type { FetchError } from 'ofetch';

import { fetchImagesList } from '@services/images.service';

import { GameLevel, gameLevelToSizeMap } from '@typings/Game.model';
import type { GameI, ImageI } from '@typings/Game.model';

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
  imagesForGame: [],
  moves: 0,
  selectedImages: [],
  time: 0,
  timer: null
});

export function useGame() {
  const { gameLevel, gameSeed, gameStarted, images, imagesForGame, moves, selectedImages, time, timer } = toRefs(state);

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
      imagesForGame.value = shuffle(
        [
          ...selectedImages,
          ...selectedImages.map((img) => {
            return {
              ...img,
              id: `${img.id}----copy`
            };
          })
        ],
        gameSeed.value,
        gameLevel.value
      ).shuffled;
      gameSeed.value = seed;
      gameStarted.value = true;
      startTimer();
    }
  }

  function resetGame() {
    gameLevel.value = GameLevel.EASY;
    gameSeed.value = null;
    gameStarted.value = false;
    stopTimer();
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
    return true;
  }

  function selectImage(image: ImageI) {
    moves.value++;
    const imageExistInSelected = selectedImages.value.find((img) => img.id === image.id);
    if (imageExistInSelected) {
      selectedImages.value.splice(selectedImages.value.indexOf(imageExistInSelected), 1);
      imageExistInSelected.selected = false;
    } else {
      image.selected = true;
      selectedImages.value.push(image);
    }

    if (selectedImages.value.length === 2) {
      if (selectedImages.value[0].id.replace('----copy', '') === selectedImages.value[1].id.replace('----copy', '')) {
        selectedImages.value.forEach((img) => (img.solved = true));
      }
      setTimeout(() => {
        selectedImages.value.forEach((img) => (img.selected = false));
        selectedImages.value = [];
      }, 500);
    }

    checkScore();
  }

  function checkScore() {
    if (imagesForGame.value.every((img) => img.solved)) {
      stopTimer();
      setTimeout(() => {
        return alert('gratulacje!');
      }, 1000);
    }
  }

  function startTimer() {
    timer.value = setInterval(() => {
      time.value++;
    }, 1000);
  }

  function stopTimer() {
    if (timer.value) clearInterval(timer.value);
  }

  return {
    gameLevel,
    gameSeed,
    gameStarted,
    images,
    imagesForGame,
    moves,
    selectedImages,
    time,
    fetchImages,
    selectImage,
    startGame,
    resetGame,
    trySetGameLevel
  };
}
