import type { FetchError } from 'ofetch';
import { isClient, notNullish, useStorage } from '@vueuse/core';

import { fetchImagesList } from '@services/images.service';

import { GameLevel, gameLevelToSizeMap } from '@typings/Game.model';
import type { GameI, ImageI } from '@typings/Game.model';

import { shuffle } from '@utils/helpers/random-seed';

const state = reactive<GameI>({
  gameEnded: false,
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

const gameSession: Ref<{
  gameLevel?: GameLevel;
  gameSeed?: string | null;
  moves?: number;
  solvedImages?: string[];
  time?: number;
}> = useStorage('cs-memory-current-session', {}, localStorage);

const gameScores: Ref<
  {
    date: string;
    userName: string;
    gameLevel: string;
    moves: number;
    time: number;
  }[]
> = useStorage('cs-memory-scores', [], localStorage);

export function useGame() {
  const {
    gameEnded,
    gameLevel,
    gameSeed,
    gameStarted,
    images,
    imagesForGame,
    moves,
    selectedImages,
    time,
    timer
  } = toRefs(state);

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

    if (
      gameSession.value &&
      notNullish(gameSession.value.gameSeed) &&
      notNullish(gameSession.value.gameLevel) &&
      notNullish(gameSession.value.moves) &&
      notNullish(gameSession.value.solvedImages) &&
      notNullish(gameSession.value.time)
    ) {
      gameSeed.value = gameSession.value.gameSeed;
      gameLevel.value = gameSession.value.gameLevel;
      moves.value = gameSession.value.moves;
      time.value = gameSession.value.time;
      startGame(false);
    }
  }

  function startGame(random = false) {
    if (images.value.data) {
      if (random) {
        gameSeed.value = null;
      }
      if (!trySetGameLevel()) {
        if (isClient)
          useNuxtApp().$toast.error('Niepoprawny seed', {
            position: 'top-center'
          });
        return;
      }
      const [cols, rows] = gameLevelToSizeMap[gameLevel.value]
        .split('x')
        .map(Number);
      const numberOfImages = cols * rows;
      const { seed, shuffled } = shuffle(
        images.value.data,
        gameSeed.value,
        gameLevel.value
      );
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
      if (gameSession.value && notNullish(gameSession.value.solvedImages)) {
        imagesForGame.value.forEach((img) => {
          if (gameSession.value.solvedImages?.includes(img.id)) {
            img.solved = true;
          }
        });
      }
      gameSeed.value = seed;
      gameStarted.value = true;
      if (!imagesForGame.value.every((img) => img.solved)) {
        startTimer();
      }
    }
  }

  function resetGame() {
    gameEnded.value = false;
    gameLevel.value = GameLevel.EASY;
    gameSeed.value = null;
    gameStarted.value = false;
    moves.value = 0;
    time.value = 0;
    selectedImages.value = [];
    gameSession.value = {};
    imagesForGame.value.forEach((img) => {
      img.solved = false;
    });
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
    if (
      selectedImages.value.length === 2 ||
      imagesForGame.value.every((img) => img.solved)
    )
      return;
    sounds.selected.pause();
    sounds.selected.currentTime = 0;
    sounds.selected.play();
    moves.value++;
    const imageExistInSelected = selectedImages.value.find(
      (img) => img.id === image.id
    );
    if (imageExistInSelected) {
      selectedImages.value.splice(
        selectedImages.value.indexOf(imageExistInSelected),
        1
      );
      imageExistInSelected.selected = false;
    } else {
      image.selected = true;
      selectedImages.value.push(image);
    }

    if (selectedImages.value.length === 2) {
      if (
        selectedImages.value[0].id.replace('----copy', '') ===
        selectedImages.value[1].id.replace('----copy', '')
      ) {
        sounds.solved.pause();
        sounds.solved.currentTime = 0;
        sounds.solved.play();
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
      saveSession();
      stopTimer();
      setTimeout(() => {
        if (isClient) {
          useNuxtApp().$toast.success('gratulacje!', {
            position: 'top-center'
          });
        }
        return;
      }, 500);
      setTimeout(() => {
        gameEnded.value = true;
      }, 1500);
    }
  }

  function startTimer() {
    timer.value = setInterval(() => {
      saveSession();
      time.value++;
    }, 1000);
  }

  function stopTimer() {
    if (timer.value) clearInterval(timer.value);
  }

  function saveSession() {
    gameSession.value = {
      gameSeed: gameSeed.value,
      gameLevel: gameLevel.value,
      moves: moves.value,
      solvedImages: imagesForGame.value
        .filter((img) => img.solved)
        .map((img) => img.id),
      time: time.value
    };
  }

  function saveScore(userName: string) {
    const data = {
      date: new Date().toISOString(),
      userName: userName,
      gameLevel: gameLevel.value,
      moves: moves.value,
      time: time.value
    };
    gameScores.value.push(data);
    gameEnded.value = false;
  }

  return {
    gameEnded,
    gameLevel,
    gameSeed,
    gameStarted,
    images,
    imagesForGame,
    moves,
    selectedImages,
    time,
    fetchImages,
    saveScore,
    selectImage,
    startGame,
    resetGame,
    trySetGameLevel
  };
}
