import { defineStore } from "pinia";

import TestEntry from "../components/TestEntry.vue";
import TestColor from "../components/TestColor.vue";
import TestMath from "../components/TestMath.vue";
import TestScore from "../components/TestScore.vue";
import TestMouse from "../components/TestMouse.vue";


const StartIndex = 0;

export const useGameProgressStore = defineStore("GameProgress", {
    state: () => {
        return {
            currentIndex: StartIndex,
            skippedTimes: 0,
        };
    },
    getters: {
        successRate: function(): string {
            return (100 * (this.currentIndex + 1 - this.skippedTimes) / (this.currentIndex + 1)).toFixed(1);
        }
    },
    actions: {
        init: function() {
            this.currentIndex = StartIndex;
            this.skippedTimes = 0;
        }
    }
});

export const GameOrder: { component: any; difficulty: number | undefined }[] = [
    // { component: TestMouse, difficulty: 1 },
    { component: TestEntry, difficulty: undefined },
    { component: TestColor, difficulty: 1 },
    { component: TestColor, difficulty: 2 },
    { component: TestColor, difficulty: 3 },
    { component: TestMouse, difficulty: 1 },
    { component: TestMouse, difficulty: 2 },
    { component: TestMouse, difficulty: 3 },
    { component: TestMath, difficulty: 1 },
    { component: TestMath, difficulty: 2 },
    { component: TestMath, difficulty: 3 },
    { component: TestScore, difficulty: undefined },
];

/** 失败SkipFailedTimes次后出现跳过提示 */
export const SkipFailedTimes = 1;