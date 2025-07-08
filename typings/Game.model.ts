import type { StateInterface } from './Response';

export enum GameLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum SizeOfGame {
  EASY = '3x4',
  MEDIUM = '4x4',
  HARD = '5x6'
}

export interface ImageI {
  id: string;
  name: string;
  description: string;
  image: string;
}
export interface GameI {
  gameLevel: GameLevel;
  gameSeed: string | null;
  gameStarted: boolean;
  images: StateInterface<ImageI[]>;
  imagesForGame: ImageI[];
}

export const gameLevelToSizeMap: Record<GameLevel, SizeOfGame> = {
  [GameLevel.EASY]: SizeOfGame.EASY,
  [GameLevel.MEDIUM]: SizeOfGame.MEDIUM,
  [GameLevel.HARD]: SizeOfGame.HARD
};
