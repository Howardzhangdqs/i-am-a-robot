<template>
    <div class="robot-main-container select-none">
        <component :is="GameOrder[GameProgress.currentIndex].component"
            :difficulty="GameOrder[GameProgress.currentIndex].difficulty" @next="nextfn">
        </component>
        <template v-if="isDev">
            <button @click="nextfn" class="border border-gray-400 px-1 py-0 rounded text-gray-900 bg-gray-100">Next</button>
            (This button will only be displayed in dev mode)
        </template>
    </div>
</template>

<script setup lang="tsx">
import { useGameProgressStore, GameOrder } from "./store/GameProgress";

const GameProgress = useGameProgressStore();

const isDev = import.meta.env.MODE === "development";

const nextfn = () => {
    GameProgress.currentIndex++;
};

</script>

<style scoped>
.robot-main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}
</style>
