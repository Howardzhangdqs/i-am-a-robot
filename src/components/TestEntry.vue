<template>
    <div class="rc-anchor rc-anchor-normal rc-anchor-light">
        <div class="id-recaptcha-accessible-status rc-anchor-aria-status" aria-hidden="true">
            Recaptcha requires verification.
        </div>
        <div class="rc-anchor-error-msg-container" style="display:none"><span class="rc-anchor-error-msg"
                aria-hidden="true"></span></div>
        <div class="rc-anchor-content">
            <div class="rc-inline-block">
                <div class="rc-anchor-center-container">
                    <div class="rc-anchor-center-item rc-anchor-checkbox-holder">
                        <span
                            class="id-recaptcha-anchor recaptcha-checkbox goog-inline-block recaptcha-checkbox-unchecked rc-anchor-checkbox"
                            role="checkbox" aria-checked="false" tabindex="0" dir="ltr"
                            aria-labelledby="recaptcha-anchor-label"
                            @click="changeImg">
                            <!-- <div class="recaptcha-checkbox-border" role="presentation"></div> -->
                            <div class="recaptcha-checkbox-borderAnimation" role="presentation"></div>
                            <div class="recaptcha-checkbox-spinner" role="presentation">
                                <div class="recaptcha-checkbox-spinner-overlay"></div>
                            </div>
                            <div class="recaptcha-checkbox-checkmark" role="presentation"></div>
                        </span>
                    </div>
                </div>
            </div>
            <div class="rc-inline-block">
                <div class="rc-anchor-center-container">
                    <label class="id-recaptcha-anchor-label rc-anchor-center-item rc-anchor-checkbox-label tcenter"
                        aria-hidden="true" role="presentation">
                        I'm <span class="delete">not</span> a robot
                    </label>
                </div>
            </div>
        </div>
        <div class="rc-anchor-normal-footer">
            <div class="rc-anchor-logo-portrait" aria-hidden="true" role="presentation">
                <div class="rc-anchor-logo-img rc-anchor-logo-img-portrait"></div>
                <div class="rc-anchor-logo-text delete">reCAPTCHA</div>
            </div>
            <div class="rc-anchor-pt">
                <a href="https://www.google.cn/intl/en/policies/privacy/" target="_blank">Privacy</a>
                <span aria-hidden="true" role="presentation"> - </span>
                <a href="https://www.google.cn/intl/en/policies/terms/" target="_blank">Terms</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
// import { useRouter } from "vue-router";

// const router = useRouter();

const emits = defineEmits(["next"]);

const imgIndex = ref(18);
const backGroundPos = computed(() => {
    return `-${imgIndex.value * 28}px`;
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const changeImg = async () => {
    for (let i = 18; i > 0; i--) {
        await sleep(10);
        imgIndex.value = i;
    }
    emits("next");
};

</script>

<style scoped>
.delete {
    text-decoration: line-through 3px red;
}

.recaptcha-checkbox-border {
    cursor: pointer;
}

.recaptcha-checkbox-borderAnimation {
    background-position: -28px v-bind("backGroundPos");
}
</style>

<style scoped src="../assets/recaptcha.css"></style>