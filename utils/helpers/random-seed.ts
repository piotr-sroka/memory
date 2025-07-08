import type { GameLevel } from '@typings/Game.model';

function generateRandomSeed(): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return hash;
}

export function shuffle<T>(
  array: T[],
  seed: string | null,
  gameLevel?: GameLevel
): {
  shuffled: T[];
  seed: string;
} {
  const randomBase = seed ?? generateRandomSeed();
  const finalSeed = seed ?? `${randomBase}-${gameLevel}`;

  const rng = mulberry32(stringToSeed(finalSeed));
  const a = [...array];

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return {
    shuffled: a,
    seed: finalSeed
  };
}
