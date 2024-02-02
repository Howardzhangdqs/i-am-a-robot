import { computed, type Ref } from "vue";
import { type CTX, drawBox, drawLine, getCanvasPixelColor, Colors } from "./canvasUtils";

let boxSize = 60;
let lineWidth = 45;

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
            boxSize = 60;
            lineWidth = 45;
        } else if (difficulty.value == 2) {
            boxSize = 40;
            lineWidth = 30;
        } else {
            boxSize = 20;
            lineWidth = 15;
        }

        ctx.value.fillStyle = Colors.BackGround;
        ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);

        buildPlayGround(ctx.value, canvas.value.width, canvas.value.height, difficulty.value);

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



/**
 * 生成指定范围内的随机整数。
 * @param min - 最小值，默认为0。
 * @param max - 最大值，默认为1。
 * @returns 生成的随机整数。
 */
const randomInt = (min: number = 0, max: number = 1) => (Math.random() * (max - min + 1) + min) | 0;


/** 生成局面 */
const buildPlayGround = (ctx: CTX, w: number, h: number, difficulty: number = 1) => {
    const [startingPointX, startingPointY, endingPointX, endingPointY, boxSize] = buildStartAndEnd(w, h, difficulty);

    buildRoute(ctx, w, h, startingPointX, startingPointY, endingPointX, endingPointY, difficulty);
    renderStartAndEnd(ctx, startingPointX, startingPointY, endingPointX, endingPointY, boxSize);
};


/** 生成 出发点 和 结束点 */
const buildStartAndEnd = (w: number, h: number, difficulty: number = 1) => {
    const startingPointX = boxSize / 2;
    const startingPointY = randomInt(0 + boxSize / 2, h / 2 - boxSize / 2);

    const endingPointX = w - boxSize / 2;
    let endingPointY = randomInt(h / 2 + boxSize / 2, h - boxSize / 2);

    if (difficulty == 3) endingPointY = randomInt(0 + boxSize / 2, h / 2 - boxSize / 2);

    return [startingPointX, startingPointY, endingPointX, endingPointY, boxSize];
};


/** 渲染 出发点 和 结束点 */
const renderStartAndEnd = (ctx: CTX, startingPointX: number, startingPointY: number, endingPointX: number, endingPointY: number, boxSize: number) => {
    drawBox(ctx, startingPointX, startingPointY, boxSize, Colors.Red);
    drawBox(ctx, endingPointX, endingPointY, boxSize, Colors.Green);
};


/** 生成并渲染路径 */
const buildRoute = (
    ctx: CTX,
    w: number, h: number,
    startingPointX: number, startingPointY: number,
    endingPointX: number, endingPointY: number,
    difficulty: number = 1,
) => {
    // difficulty = 2;

    if (difficulty == 1) {
        const corner = randomInt(startingPointX + boxSize, endingPointX - boxSize);
        drawLine(ctx, startingPointX, startingPointY, corner, startingPointY, Colors.Yellow, lineWidth);
        drawLine(ctx, corner, startingPointY, corner, endingPointY, Colors.Yellow, lineWidth);
        drawLine(ctx, corner, endingPointY, endingPointX, endingPointY, Colors.Yellow, lineWidth);
    } else if (difficulty == 2) {
        const cornerX = randomInt(startingPointX + boxSize, (endingPointX - boxSize));

        drawLine(ctx, startingPointX, startingPointY, startingPointX, h, Colors.Yellow, lineWidth);
        drawLine(ctx, endingPointX, 0, endingPointX, endingPointY, Colors.Yellow, lineWidth);

        drawLine(ctx, cornerX, 0, cornerX, h, Colors.Yellow, lineWidth);

        drawLine(ctx, startingPointX, h - lineWidth / 2, cornerX, h - lineWidth / 2, Colors.Yellow, lineWidth);
        drawLine(ctx, cornerX, lineWidth / 2, endingPointX, lineWidth / 2, Colors.Yellow, lineWidth);
    } else {
        const cornerX1 = randomInt(startingPointX + boxSize, (endingPointX - boxSize) / 2);
        const cornerX2 = randomInt((endingPointX - boxSize) / 2, (endingPointX - boxSize));

        // 开头朝下
        drawLine(ctx, startingPointX, startingPointY, startingPointX, h, Colors.Yellow, lineWidth);

        // 开头朝右
        drawLine(ctx, startingPointX, h - lineWidth / 2, cornerX1, h - lineWidth / 2, Colors.Yellow, lineWidth);


        // 中间朝上
        drawLine(ctx, cornerX1, 0, cornerX1, h, Colors.Yellow, lineWidth);
        
        // 中间朝右
        drawLine(ctx, cornerX1, lineWidth / 2, cornerX2, lineWidth / 2, Colors.Yellow, lineWidth);

        // 中间朝下
        drawLine(ctx, cornerX2, 0, cornerX2, h, Colors.Yellow, lineWidth);

        
        // 结尾朝右
        drawLine(ctx, cornerX2, h - lineWidth / 2, endingPointX, h - lineWidth / 2, Colors.Yellow, lineWidth);

        // 结尾朝上
        drawLine(ctx, endingPointX, endingPointY, endingPointX, h, Colors.Yellow, lineWidth);
    }
};