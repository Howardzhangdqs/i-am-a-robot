/**
 * @description 语音合成
 * @param words 需要合成的文字
 */
export const tts = (words: string) => {
    const utterance = new SpeechSynthesisUtterance(words);
    speechSynthesis.speak(utterance);
};