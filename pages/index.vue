<template>
    <TheLoader v-if="images.pending" />
    <TheGame v-else />
</template>

<script setup lang="ts">
const { images, fetchImages } = useGame();

onMounted(() => fetchImages())
</script>

<style lang="scss" scoped></style>