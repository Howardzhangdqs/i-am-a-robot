<template>
    <div class="robot-main-container select-none">
        <component :is="GameOrder[GameProgress.currentIndex].component"
            :difficulty="GameOrder[GameProgress.currentIndex].difficulty" @next="nextfn">
        </component>
        <button v-if="isDev" @click="nextfn">Next</button>
    </div>
</template>

<script setup lang="tsx">
// import { RouterLink, RouterView } from "vue-router";
import { ref } from "vue";
import { useGameProgressStore } from "./store/GameProgress";

import { GameOrder } from "./store/GameProgress";

const GameProgress = useGameProgressStore();

const isDev = import.meta.env.MODE === "development";

const nextfn = () => {
    // index.value++;

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
