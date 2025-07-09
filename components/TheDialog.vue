<template>
  <div
    v-if="model"
    class="dialog fixed flex items-center justify-center w-full h-full"
  >
    <div
      class="dialog__content flex flex-col gap-4 w-full rounded-md px-4 py-6 bg-slate-200 text-zinc-800"
    >
      <div class="dialog__header flex justify-between items-center">
        <slot name="header" />
        <span
          v-if="closeAvailable"
          class="dialog__header-close flex items-center justify-center cursor-pointer ml-auto"
          @click="model = false"
        >
          &#x2715;
        </span>
      </div>
      <div class="border-b-2 border-b-zinc-700 my-2 w-full h-1" />
      <slot />
      <div class="flex justify-end mt-6">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  closeAvailable: {
    type: Boolean,
    default: true
  }
});

defineEmits(['close']);

const model = defineModel<boolean>();
</script>

<style lang="scss" scoped>
.dialog {
  top: 0;
  left: 0;
  background-color: #272727e8;

  &__content {
    max-width: 400px;
    border: 1px solid #f8f8f8;
  }
}
</style>
