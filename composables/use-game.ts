import type { FetchError } from 'ofetch';

import { fetchImagesList } from "@services/images.service";
import type { GameI } from "@typings/Game.model";

const state = reactive<GameI>({
    gameSeed: null,
    gameStarted: false,
    images: {
        data: null,
        error: null,
        pending: false
    }
})

export function useGame() {
    const { gameSeed, gameStarted, images } = toRefs(state);

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
                images.value.pending = false
            }, 1000);
        }
    }

    return {
        gameSeed,
        gameStarted,
        images,
        fetchImages
    }
}