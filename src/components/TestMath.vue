<template>
    <div class="rc-container">
        <div id="rc-imageselect" aria-modal="true" role="dialog">
            <div class="rc-imageselect-response-field"></div><span class="rc-imageselect-tabloop-begin" tabindex="0"></span>
            <div class="rc-imageselect-payload">
                <div class="rc-imageselect-instructions">
                    <div class="rc-imageselect-desc-wrapper">
                        <div class="rc-imageselect-desc-no-canonical" style="width: 352px; font-size: 16px;">
                            Solve this math problem:
                            <vue-latex :expression="questionContent" display-mode />

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
                            <div>Input your answer here (Accurate to {{ accuracy }} decimal place)</div>
                            <input class="w-1/2 mt-1 px-1.5 py-px text-center font-mono border border-gray-400 rounded-md"
                                type="text" v-model.trim="answerContent" @keyup.enter="checkEnd" spellcheck="false" />
                        </div>
                        <div class="rc-imageselect-incorrect-response" v-if="showError">
                            Please try again.<br>
                            <span v-if="failedTimes > SkipFailedTimes">
                                Find it too hard? <button class="border border-gray-400 px-1 py-0 rounded text-gray-900 bg-gray-100"
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
                                id="recaptcha-verify-button" tabindex="0" @click="checkEnd">
                                {{ answerContent ? "NEXT" : "SKIP" }}
                            </button>
                        </div>
                    </div>
                    <div class="rc-challenge-help" style="width: 414px;" tabindex="0" v-if="showHelp">
                        Do the easy math problems above and fill in the blanks bellow.
                        <a href="https://support.google.com/recaptcha" target="_blank">Do not learn more.</a>
                    </div>
                </div>
            </div>
            <span v-show="false" :data-answer="realAnswer"></span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import _ from "lodash";

import generateMath from "./generateMath";
import ProgressBarVue from "./ProgressBar.vue";

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

const answerContent = ref("");
const questionContent = ref("");

const accuracy = ref(1);

let realAnswer = ref("");



/** 初始化 */
const init = () => {
    updDifficulty();
    
    const [question, answer] = generateMath(difficulty.value);

    console.log(question, answer);

    realAnswer.value = answer.toFixed(accuracy.value);

    console.log(question, answer, realAnswer.value);

    questionContent.value = question;

    answerContent.value = "";

    progressbarDisplay.value = false;

    failedTimes.value++;

    nextTick(progress);
};


/** 检查是否结束 */
const checkEnd = () => {
    progressbarDisplay.value = false;
    nextTick(() => {

        if (realAnswer.value == answerContent.value) {

            clearTimeout(timeoutInstance);

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


/** 进度条 */
const progress = () => {
    clearTimeout(timeoutInstance);

    if (difficulty.value == 1) {
        totalTime.value = 10000;
        currentTime.value = 0;
        accuracy.value = 1;
    } else if (difficulty.value == 2) {
        totalTime.value = 3000;
        currentTime.value = 0;
        accuracy.value = 2;
    } else {
        totalTime.value = 1000;
        currentTime.value = 0;
        accuracy.value = 5;
    }

    progressbarDisplay.value = true;

    timeoutInstance = setTimeout(() => {
        progressbarDisplay.value = false;
        nextTick(checkEnd);
    }, totalTime.value);
};

const updDifficulty = () => {
    difficulty.value = props.difficulty;

    if (difficulty.value == 1) {
        totalTime.value = 10000;
        currentTime.value = 0;
        accuracy.value = 1;
    } else if (difficulty.value == 2) {
        totalTime.value = 3000;
        currentTime.value = 0;
        accuracy.value = 2;
    } else {
        totalTime.value = 1000;
        currentTime.value = 0;
        accuracy.value = 5;
    }
};

watch(() => props.difficulty, updDifficulty);

onMounted(init);
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