import { computed, ref, watch, type Ref } from "vue";
import { type CTX, drawBox, drawPixel, drawLine, getCanvasPixelColor, Colors } from "./canvasUtils";

const boxSize = ref(60);
const lineWidth = ref(45);

export const CanvasEventHandler = (
    canvas: Ref<HTMLCanvasElement>,
    difficulty: Ref<number>,
    initFn: () => void,
    endFn: (isEnd: boolean) => void,
) => {
    let preX: number, preY: number;

    let isMouseDown = false;

    const ctx = computed(() => canvas.value?.getContext("2d") as CTX);

    let colors: string[][] = [[]];

    const init = () => {
        isMouseDown = false;

        if (difficulty.value == 1) {
            boxSize.value = 60;
            lineWidth.value = 45;
        } else if (difficulty.value == 2) {
            boxSize.value = 40;
            lineWidth.value = 30;
        } else {
            boxSize.value = 20;
            lineWidth.value = 15;
        }

        ctx.value.fillStyle = Colors.BackGround;
        ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);

        buildPlayGround(ctx.value, canvas.value.width, canvas.value.height);

        colors = getCanvasPixelColor(ctx.value, canvas.value.width, canvas.value.height);
        // console.log(colors);
    };

    const CanvasMoveEvent = (x: number, y: number) => {
        const color = colors[y][x];

        drawLine(ctx.value, preX, preY, x, y, "black");

        if (color == Colors.BackGround) {
            isMouseDown = false;
            endFn(false);
            return;
        }

        if (color == Colors.Green) {
            isMouseDown = false;
            endFn(true);
        }

        preX = x;
        preY = y;
    };

    const CanvasMouseMoveEvent = (e: MouseEvent) => {
        e.preventDefault();

        if (!isMouseDown) return;
        // console.log(e);

        const x = e.offsetX;
        const y = e.offsetY;

        CanvasMoveEvent(x, y);
    };

    const CanvasTouchMoveEvent = (event: TouchEvent) => {
        event.preventDefault();

        const e = event.touches[0];
        if (!e) return;

        if (!isMouseDown) return;

        const rect = canvas.value.getBoundingClientRect();

        const x = e.clientX - rect.x;
        const y = e.clientY - rect.y;

        CanvasMoveEvent(x, y);
    };

    const CanvasMouseUpEvent = (e: MouseEvent) => {
        e.preventDefault();

        if (isMouseDown) endFn(false);

        isMouseDown = false;
    };

    const CanvasTouchEndEvent = (e: TouchEvent) => {
        e.preventDefault();

        if (isMouseDown) endFn(false);
        
        endFn(false);
    };

    const CanvasMouseDownEvent = (e: MouseEvent) => {
        e.preventDefault();

        const [x, y] = [e.offsetX - 1, e.offsetY - 1];
        const color = colors[y][x];

        console.log(x, y, color);

        if (color !== Colors.Red) return;

        preX = x;
        preY = y;

        isMouseDown = true;
    };

    const CanvasTouchStartEvent = (event: TouchEvent) => {
        event.preventDefault();

        const e = event.touches[0];
        if (!e) return;

        const rect = canvas.value.getBoundingClientRect();

        const [x, y] = [e.clientX - rect.x, e.clientY - rect.y];
        const color = colors[y][x];

        if (color !== Colors.Red) return;

        preX = x;
        preY = y;

        isMouseDown = true;
    };

    init();

    return {
        CanvasMouseMoveEvent,
        CanvasMouseDownEvent,
        CanvasMouseUpEvent,
        CanvasTouchMoveEvent,
        CanvasTouchStartEvent,
        CanvasTouchEndEvent,
        init,
    };
};



const randomInt = (min: number = 0, max: number = 1) => (Math.random() * (max - min + 1) + min) | 0;


const buildPlayGround = (ctx: CTX, w: number, h: number) => {
    const [startingPointX, startingPointY, endingPointX, endingPointY, boxSize] = buildStartAndEnd(ctx, w, h);

    buildRoute(ctx, w, h, startingPointX, startingPointY, endingPointX, endingPointY);
    renderStartAndEnd(ctx, startingPointX, startingPointY, endingPointX, endingPointY, boxSize);
};


const buildStartAndEnd = (ctx: CTX, w: number, h: number) => {
    const startingPointX = boxSize.value / 2;
    const startingPointY = randomInt(0 + boxSize.value / 2, h / 2 - boxSize.value / 2);

    const endingPointX = w - boxSize.value / 2;
    const endingPointY = randomInt(h / 2 + boxSize.value / 2, h - boxSize.value / 2);

    drawBox(ctx, startingPointX, startingPointY, boxSize.value, Colors.Red);
    drawBox(ctx, endingPointX, endingPointY, boxSize.value, Colors.Green);

    return [startingPointX, startingPointY, endingPointX, endingPointY, boxSize.value];
};

const renderStartAndEnd = (ctx: CTX, startingPointX: number, startingPointY: number, endingPointX: number, endingPointY: number, boxSize: number) => {
    drawBox(ctx, startingPointX, startingPointY, boxSize, Colors.Red);
    drawBox(ctx, endingPointX, endingPointY, boxSize, Colors.Green);
};

const buildRoute = (
    ctx: CTX,
    w: number, h: number,
    startingPointX: number, startingPointY: number,
    endingPointX: number, endingPointY: number,
) => {
    const corner = randomInt(boxSize.value * 2, w - boxSize.value * 2);

    drawLine(ctx, startingPointX, startingPointY, corner, startingPointY, Colors.Yellow, lineWidth.value);
    drawLine(ctx, corner, startingPointY, corner, endingPointY, Colors.Yellow, lineWidth.value);
    drawLine(ctx, corner, endingPointY, endingPointX, endingPointY, Colors.Yellow, lineWidth.value);
};