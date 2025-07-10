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
  margin: auto;
  color: #272727;
  table-layout: fixed;
}

.scores thead {
  background-color: #f5f5f5;
  display: table;
  width: 100%;
  table-layout: fixed;
}

.scores tbody {
  display: block;
  max-height: 400px;
  overflow-y: auto;
  width: 100%;
}

.scores th,
.scores td {
  padding: 12px 16px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
}

.scores tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.scores tr:hover {
  background-color: #fafafa;
}

.scores th {
  font-weight: bold;
  color: #272727;
}

.scores th:nth-child(2),
.scores td:nth-child(2) {
  width: 20%;
}

.scores th:nth-child(3),
.scores td:nth-child(3) {
  width: 25%;
}

.scores th:nth-child(4),
.scores td:nth-child(4) {
  width: 30%;
}
</style>
