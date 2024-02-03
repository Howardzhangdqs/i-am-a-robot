<template>
    <div class="rc-container unselectable">
        <div id="rc-imageselect" aria-modal="true" role="dialog">
            <div class="rc-imageselect-response-field"></div><span class="rc-imageselect-tabloop-begin" tabindex="0"></span>
            <div class="rc-imageselect-payload">
                <div class="rc-imageselect-instructions">
                    <div class="rc-imageselect-desc-wrapper">
                        <div class="rc-imageselect-desc-no-canonical" style="width: 352px; font-size: 16px;">
                            <strong style="text-align: center;" ref="robotCertificate">
                                You are {{ GameProgress.successRate }}% a robot.
                            </strong>
                        </div>
                    </div>
                </div>
                <div class="rc-imageselect-challenge">
                    <div id="rc-imageselect-target" class="rc-imageselect-target" dir="ltr" role="presentation"
                        aria-hidden="true">
                        <div class="rc-imageselect">
                            <div>Thank you for your valueless time and electricity.</div>
                            <div>Test <button @click="GameProgress.init"
                                class="border border-gray-400 px-1 py-0 rounded text-gray-900 bg-gray-100 hover:bg-gray-200 transition-all"
                            >again</button> to make sure that you are a real robot.</div>
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
                                    value="" id="recaptcha-reload-button" tabindex="3"></button>
                            </div>
                            <div class="button-holder audio-button-holder">
                                <button class="rc-button goog-inline-block rc-button-audio" title="Get an audio challenge"
                                    value="" id="recaptcha-audio-button" tabindex="1"></button>
                            </div>
                            <div class="button-holder image-button-holder">
                                <button class="rc-button goog-inline-block rc-button-image" title="Get a visual challenge"
                                    value="" id="recaptcha-image-button" tabindex="0" style="display: none;"></button>
                            </div>
                            <div class="button-holder help-button-holder">
                                <button class="rc-button goog-inline-block rc-button-help" title="Help" value=""
                                    id="recaptcha-help-button" tabindex="2"></button>
                            </div>
                        </div>
                    </div>
                    <div class="rc-challenge-help" style="display:none" tabindex="0"></div>
                </div>
            </div>
            <span class="rc-imageselect-tabloop-end" tabindex="0"></span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import party from "party-js";

import { useGameProgressStore } from "@/store/GameProgress";

const GameProgress = useGameProgressStore();

const robotCertificate = ref<HTMLElement>();

console.log(GameProgress);


onMounted(() => {
    party.confetti(robotCertificate.value as HTMLElement, {
        count: party.variation.range(40, 50),
        size: party.variation.range(0.8, 2),
    });
});
</script>

<style scoped>
.unselectable {
    user-select: none;
}

.rc-container {
    /* 外边 外阴影 */
    box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.2);
}
</style>

<style scoped src="../assets/recaptcha.css"></style>