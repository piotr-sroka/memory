<template>
    <section class="game">
        <div v-if="!gameSeed" class="game__seed">
            <input id="gameSeed" v-model="gameSeedValue" placeholder="Podaj seeda gry (8 znaków)" type="text"
                class="game__seed-input" maxlength="8">
            <button type="button" @click="setGame()">Graj</button>
            <span>lub</span>
            <button class="btn">Losuj grę</button>
        </div>
    </section>
</template>

<script setup lang="ts">
const gameSeedValue = ref();

const { gameSeed, gameStarted } = useGame();

function setGame() {
    console.log('w?')
    gameSeed.value = gameSeedValue.value;
}
</script>

<style lang="scss" scoped>
.game {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;

    &__seed {
        &-input {
            padding: 8px;
        }
    }
}
</style>