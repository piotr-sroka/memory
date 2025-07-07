<template>
    <nav class="nav">
        <div>CS Memory</div>
        <div class="stats" v-if="gameStarted">
            <div class="stats__seed">#{{ gameSeed }}</div>
            <div class="stats__moves">Ruchy:<span class="stats__moves-count">0</span></div>
            <div class="stats__time">Czas gry:<span class="stats__time-count">00:00</span></div>
        </div>
    </nav>
</template>

<script setup lang="ts">
const { gameSeed } = useGame();

const gameStarted = computed(() => gameSeed.value)
</script>

<style lang="scss" scoped>
.nav {
    padding: 20px 0;
    width: 100%;
    display: flex;
    justify-content: space-between;

    .stats {
        display: flex;
        justify-content: flex-end;
        gap: 24px;

        &__seed {
            margin-right: 128px;
        }

        &__moves,
        &__time {
            display: flex;
            gap: 12px;

            &-count {
                display: inline-block;
                min-width: 60px;
            }
        }
    }
}
</style>