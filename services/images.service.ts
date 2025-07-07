import type { ImageI } from "@typings/Game.model";

export async function fetchImagesList(): Promise<ImageI[]> {
    return await $fetch('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/base_weapons.json')
}