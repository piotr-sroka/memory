import type { StateInterface } from "./Response";

export interface ImageI {
    id: string;
    name: string;
    description: string;
    image: string;
}
export interface GameI {
    gameSeed: string | null;
    gameStarted: boolean;
    images: StateInterface<ImageI[]>
}