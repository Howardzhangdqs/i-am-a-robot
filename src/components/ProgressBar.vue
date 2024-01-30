<template>
    <div class="g-container">
        <div class="g-progress"></div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    time: number,
}>();

const time = computed(() => `${(props.time || 0) / 1000}s`);
</script>

<style scoped>
.g-container {
    width: 100%;
    height: 3px;
    background: #eee;
}

.g-progress {
    height: inherit;
    background: #1a73e8;
    animation: progress v-bind("time") linear;
}

/** 10秒liner */
@keyframes progress {
    0% {
        width: 0;
    }
    100% {
        width: 100%;
    }
}
</style>