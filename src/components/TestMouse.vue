<template>
    <div class="rc-container">
        <div id="rc-imageselect" aria-modal="true" role="dialog">
            <div class="rc-imageselect-payload">
                <div class="rc-imageselect-instructions">
                    <div class="rc-imageselect-desc-wrapper">
                        <div class="rc-imageselect-desc-no-canonical" style="width: 352px; font-size: 16px;">
                            <p>
                                Place your mouse on the red square and drag to the green square.
                                Do not exceed the yellow area while moving.
                            </p>
                            <span>within {{ totalTime / 1000 }} sec{{ totalTime == 1000 ? "" : "s" }}</span>
                        </div>
                    </div>
                    <template v-if="progressbarDisplay">
                        <ProgressBarVue :time="totalTime" />
                    </template>
                </div>
                <div class="rc-imageselect-challenge">
                    <div id="rc-imageselect-target" class="rc-imageselect-target" dir="ltr" role="presentation"
                        aria-hidden="true">
                        <div class="rc-imageselect" ref="canvasContainer">
                            <canvas ref="canvas" height="200" :width="canvasWidth"></canvas>
                        </div>
                        <div class="rc-imageselect-incorrect-response" v-if="showError">
                            Please try again.<br>
                            <span v-if="failedTimes > SkipFailedTimes">
                                Find it too hard? <button
                                    class="border border-gray-400 px-1 py-0 rounded text-gray-900 bg-gray-100"
                                    @click="GameProgress.skippedTimes++; checkEnd(); $emit('next')">SKIP</button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rc-footer">
                <div class="rc-separator"></div>
                <div class="rc-controls">
                    <div class="primary-controls">
                        <div class="rc-buttons">
                            <div class="button-holder reload-button-holder">
                                <button class="rc-button goog-inline-block rc-button-reload" title="Get a new challenge"
                                    value="" id="recaptcha-reload-button" tabindex="3" @click="init"></button>
                            </div>
                            <div class="button-holder audio-button-holder">
                                <button class="rc-button goog-inline-block rc-button-audio" title="Get an audio challenge"
                                    value="" id="recaptcha-audio-button" tabindex="1"></button>
                            </div>
                            <div class="button-holder help-button-holder">
                                <button class="rc-button goog-inline-block rc-button-help" title="Help" value=""
                                    id="recaptcha-help-button" tabindex="2" @click="showHelp = !showHelp"></button>
                            </div>
                        </div>
                        <div class="verify-button-holder">
                            <button class="rc-button-default goog-inline-block" title="" value=""
                                id="recaptcha-verify-button" tabindex="0" @click="checkEnd()">
                                {{ moveStarted ? "NEXT" : "SKIP" }}
                            </button>
                        </div>
                    </div>
                    <div class="rc-challenge-help" style="width: 414px;" tabindex="0" v-if="showHelp">
                        Place your mouse on the red square and drag to the green square.
                        Do not exceed the yellow area while moving.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch, type Ref } from "vue";
import _ from "lodash";

import ProgressBarVue from "./ProgressBar.vue";
import { CanvasEventHandler } from "./canvasGame";

import { useGameProgressStore, SkipFailedTimes } from "../store/GameProgress";
const GameProgress = useGameProgressStore();


const props = defineProps({
    difficulty: {
        type: Number,
        default: 1,
    },
    reload: {
        type: Boolean,
        default: false,
    }
});

const failedTimes = ref(0);

watch(() => GameProgress.currentIndex, (val) => {
    if (val) {
        init();
        failedTimes.value = 0;
    }
});

const emits = defineEmits(["next"]);

let difficulty = ref(props.difficulty);

const showHelp = ref(false);
const showError = ref(false);

const canvas = ref<HTMLCanvasElement>();
const canvasContainer = ref<HTMLDivElement>();
const canvasWidth = ref(0);
let ctx: CanvasRenderingContext2D;

const moveStarted = ref(false);
const moveEnd = ref(false);


const setDifficulty = () => {
    difficulty.value = props.difficulty;

    if (difficulty.value == 1) {
        totalTime.value = 10000;
        currentTime.value = 0;
    } else if (difficulty.value == 2) {
        totalTime.value = 3000;
        currentTime.value = 0;
    } else {
        totalTime.value = 1000;
        currentTime.value = 0;
    }
};



let CanvasEvents: ReturnType<typeof CanvasEventHandler>;

const init = () => {
    setDifficulty();

    const myCanvas = canvas.value as HTMLCanvasElement;

    myCanvas.removeEventListener("mousemove", CanvasEvents.CanvasMouseMoveEvent);
    myCanvas.removeEventListener("mousedown", CanvasEvents.CanvasMouseDownEvent);
    myCanvas.removeEventListener("mouseup", CanvasEvents.CanvasMouseUpEvent);
    myCanvas.removeEventListener("touchmove", CanvasEvents.CanvasTouchMoveEvent);
    myCanvas.removeEventListener("touchstart", CanvasEvents.CanvasTouchStartEvent);
    myCanvas.removeEventListener("touchend", CanvasEvents.CanvasTouchEndEvent);
    myCanvas.removeEventListener("mouseout", CanvasEvents.CanvasMouseUpEvent);

    CanvasEvents.init();

    myCanvas.addEventListener("mousemove", CanvasEvents.CanvasMouseMoveEvent);
    myCanvas.addEventListener("mousedown", CanvasEvents.CanvasMouseDownEvent);
    myCanvas.addEventListener("mouseup", CanvasEvents.CanvasMouseUpEvent);
    myCanvas.addEventListener("touchmove", CanvasEvents.CanvasTouchMoveEvent);
    myCanvas.addEventListener("touchstart", CanvasEvents.CanvasTouchStartEvent);
    myCanvas.addEventListener("touchend", CanvasEvents.CanvasTouchEndEvent);
    myCanvas.addEventListener("mouseout", CanvasEvents.CanvasMouseUpEvent);


    // ctx全涂满红色
    // ctx.fillStyle = "#ddd";
    // ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);


    progressbarDisplay.value = false;

    failedTimes.value++;

    nextTick(progress);
};


const checkEnd = (isEnd: boolean = false) => {
    progressbarDisplay.value = false;
    nextTick(() => {

        if (isEnd) {
            emits("next");
        } else {
            showError.value = true;
            nextTick(init);
        }
    });
};


const totalTime = ref(1000);
const currentTime = ref(0);
const progressbarDisplay = ref(false);
let timeoutInstance = 0;

const progress = () => {
    clearTimeout(timeoutInstance);

    // console.log(route.path);

    progressbarDisplay.value = true;

    timeoutInstance = setTimeout(() => {
        progressbarDisplay.value = false;
        nextTick(() => {
            checkEnd();
        });
    }, totalTime.value);
};

onMounted(() => {
    canvasWidth.value = canvasContainer.value?.clientWidth as number;


    CanvasEvents = CanvasEventHandler(canvas as Ref<HTMLCanvasElement>, difficulty, init, checkEnd);

    ctx = (canvas.value as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
    nextTick(init);
});

onUnmounted(() => {
    console.log("unmount");
    clearTimeout(timeoutInstance);
});

</script>

<style scoped>
.progress-bar {
    width: 100%;
    height: 20px;
}

.rc-imageselect-desc-wrapper {
    margin-bottom: 0 !important;
}

.rc-imageselect-checkbox {
    display: block;
    background-repeat: no-repeat !important;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
}

.rc-container {
    /* 外边 外阴影 */
    box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.2);
}

.rc-imageselect-img {
    width: 100%;
    height: 130px;
    border: 1px solid #ddd;
    transition: transform 0.2s;
}
</style>

<style scoped src="../assets/recaptcha.css"></style>