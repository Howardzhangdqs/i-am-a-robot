<template>
    <div class="rc-container">
        <div id="rc-imageselect" aria-modal="true" role="dialog">
            <div class="rc-imageselect-response-field"></div><span class="rc-imageselect-tabloop-begin" tabindex="0"></span>
            <div class="rc-imageselect-payload">
                <div class="rc-imageselect-instructions">
                    <div class="rc-imageselect-desc-wrapper">
                        <div class="rc-imageselect-desc-no-canonical" style="width: 352px; font-size: 16px;" ref="speak">
                            Select all squares that are
                            <template v-if="difficulty == 1">
                                <div style="font-weight: 900; font-size: 28px;">
                                    {{ majorColor.name }}<sub>
                                        <span style="font-weight: 900; font-size: .8em;">{{ majorColor.color }}</span>
                                    </sub>
                                </div>
                            </template>
                            <template v-else-if="difficulty == 2">
                                <div style="font-weight: 900; font-size: 28px;">
                                    {{ majorColor.color }}
                                </div>
                            </template>
                            <template v-else>
                                <div style="font-weight: 900; font-size: 28px; background-color: #fff;">
                                    {{ majorColor.color }}
                                </div>
                            </template>

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
                        <div class="rc-imageselect">
                            <template v-for="(color, index) in imgSelect" :key="index">
                                <div @click="randomSelected[index] = !randomSelected[index]" style="position: relative;">
                                    <div class="rc-imageselect-img" :style="{
                                        backgroundColor: (color == 0 ? majorColor.color : minorColor.color),
                                        borderColor: (color == 0 ? (majorColor.border ? '#bbb' : undefined) : (minorColor.border ? '#bbb' : undefined)),
                                        transform: randomSelected[index] ? `scale(0.8)` : undefined,
                                    }" :data-color="(color == 0 ? majorColor.color : minorColor.color)"></div>
                                    <div class="rc-imageselect-checkbox" v-if="randomSelected[index]"></div>
                                </div>
                            </template>
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
                                    value="" id="recaptcha-audio-button" tabindex="1" @click="tts(buildSpeech())"></button>
                            </div>
                            <div class="button-holder help-button-holder">
                                <button class="rc-button goog-inline-block rc-button-help" title="Help" value=""
                                    id="recaptcha-help-button" tabindex="2" @click="showHelp = !showHelp"></button>
                            </div>
                        </div>
                        <div class="verify-button-holder">
                            <button class="rc-button-default goog-inline-block" title="" value=""
                                id="recaptcha-verify-button" tabindex="0" @click="randomSelected.every(x => x == false) ? skipCurrentTest() : checkEnd()">
                                {{ randomSelected.every(x => x == false) ? "SKIP" : "NEXT" }}
                            </button>
                        </div>
                    </div>
                    <div class="rc-challenge-help" style="width: 414px;" tabindex="0" v-if="showHelp">
                        Select each squre that contains the object
                        described in the text or in the image at the top of the UI. Then click Verify. To get a new
                        challenge, click the reload icon.
                        <a href="https://support.google.com/recaptcha" target="_blank">Do not learn more.</a>
                    </div>
                </div>
            </div>
            <span class="rc-imageselect-tabloop-end" tabindex="0"></span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch, onMounted, onUnmounted } from "vue";
import _ from "lodash";

import rawSupportedColor from "./colors";
import ProgressBarVue from "./ProgressBar.vue";

import { tts } from "@/utils";

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

let End = false;


const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

let supportedColor = rawSupportedColor.slice(0, 8);

const majorColor = ref(supportedColor[0]);
const minorColor = ref(supportedColor[0]);

const showHelp = ref(false);
const showError = ref(false);

let imgSelect = reactive(new Array(9).fill(0));

const randomSelected: boolean[] = reactive(new Array(9).fill(false));

const init = () => {
    if (End) return;

    majorColor.value = supportedColor[randomInt(0, supportedColor.length - 1)];
    minorColor.value = supportedColor.filter(
        (x) => x.name != majorColor.value.name
    )[randomInt(0, supportedColor.length - 2)];

    imgSelect.fill(0);
    for (let i = 1; i <= randomInt(5, 7); i++) imgSelect[i] = 1;

    imgSelect = _.shuffle(imgSelect);
    randomSelected.fill(false);

    console.log(imgSelect, majorColor.value, minorColor.value);

    progressbarDisplay.value = false;

    failedTimes.value++;

    nextTick(progress);
    // progress();
};


const checkEnd = () => {
    progressbarDisplay.value = false;
    nextTick(() => {
        console.log(imgSelect, randomSelected);
        if (randomSelected.every((val, index) => val == (imgSelect[index] == 0))) {

            clearTimeout(timeoutInstance);
            GameProgress.finishedTimes ++;

            emits("next");
        } else {
            showError.value = true;
            nextTick(init);
        }
    });
};


const totalTime = ref(0);
const currentTime = ref(0);
const progressbarDisplay = ref(false);
let timeoutInstance = 0;

const progress = () => {
    clearTimeout(timeoutInstance);

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

    progressbarDisplay.value = true;

    timeoutInstance = setTimeout(() => {
        progressbarDisplay.value = false;
        nextTick(checkEnd);
    }, totalTime.value);
};


watch(() => props.difficulty, () => {
    difficulty.value = props.difficulty;

    if (difficulty.value == 1) supportedColor = rawSupportedColor.slice(0, 8);
    else if (difficulty.value == 2) supportedColor = rawSupportedColor.slice(0, 16);
    else supportedColor = rawSupportedColor;
});

onMounted(init);
onUnmounted(() => {
    console.log("unmount");
    clearTimeout(timeoutInstance);
});


const skipCurrentTest = () => {
    GameProgress.skippedTimes++;
    checkEnd();
    emits("next");
};


const buildSpeech = () => {
    let speech = "";

    if (difficulty.value == 1)
        speech = `Select all squares that are ${majorColor.value.name} within ${totalTime.value / 1000} seconds`;
    else if (difficulty.value == 2)
        speech = `Select all squares that are ${majorColor.value.color} within ${totalTime.value / 1000} seconds`;
    else
        speech = `Select all squares that are ${majorColor.value.color} within ${totalTime.value / 1000} seconds`;

    return speech;
};

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

.rc-imageselect {
    display: grid;
    gap: 4px;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
}

.rc-imageselect-img {
    width: 100%;
    height: 130px;
    border: 1px solid #ddd;
    transition: transform 0.2s;
}
</style>

<style scoped src="../assets/recaptcha.css"></style>