<template>
  <table class="scores">
    <thead>
      <th>Imię</th>
      <th>Poziom</th>
      <th>Liczba ruchów</th>
      <th>Czas ukończenia</th>
    </thead>
    <tbody>
      <tr
        v-for="(score, index) in scores"
        :key="index"
      >
        <td>{{ score.userName }}</td>
        <td>{{ score.gameLevel }}</td>
        <td>{{ score.moves }}</td>
        <td>{{ formatTime(score.time) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core';

import type { GameLevel } from '@typings/Game.model';
import { formatTime } from '@utils/helpers/format-time';

const scores: Ref<
  {
    gameLevel: GameLevel;
    moves: number;
    time: number;
    userName: string;
  }[]
> = useStorage('cs-memory-scores', [], localStorage);
</script>

<style lang="scss" scoped>
.scores {
  width: 100%;
  max-width: 600px;
  border-collapse: collapse;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: #272727;
}

.scores thead {
  background-color: #f5f5f5;
}

.scores th,
.scores td {
  padding: 12px 16px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.scores tr:hover {
  background-color: #fafafa;
}

.scores th {
  font-weight: bold;
  color: #555;
}
</style>
