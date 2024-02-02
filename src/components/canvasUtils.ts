export enum Colors {
    Green = "#00a000",
    Red = "#dd0000",
    BackGround = "#ffffff",
    Yellow = "#eeee00",
}

export type CTX = CanvasRenderingContext2D;

export const drawBox = (ctx: CTX, centerX: number, centerY: number, size: number, color: string) => {
    // console.log(ctx, centerX, centerY, size);

    ctx.beginPath();
    ctx.rect(centerX - size / 2, centerY - size / 2, size, size);
    ctx.fillStyle = color;
    ctx.fill();
};

export const drawPixel = (ctx: CTX, x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
};

export const drawCircle = (ctx: CTX, x: number, y: number, radius: number, color: string) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
};

export const drawLine = (ctx: CTX, x1: number, y1: number, x2: number, y2: number, color: string, radius: number = 1) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = radius;
    ctx.stroke();

    // 在x1, y1处画正方形
    drawBox(ctx, x1, y1, radius, color);
    drawBox(ctx, x2, y2, radius, color);
};

export enum CircularBeadDirection {
    X1Y1,
    X1Y2,
    X2Y1,
    X2Y2,
}

/** 绘制圆角 */
export const drawCircularBead = (
    ctx: CTX, x: number, y: number,
    direction: CircularBeadDirection,
    color: string, bgColor: string = Colors.BackGround,
    radius: number = 1
) => {

    let bgBox: [number, number];
    let curCir: [number, number];

    // 这里没写好
    if (direction == CircularBeadDirection.X1Y1) {
        bgBox = [x + radius * 2, y - radius * 2];
        curCir = [x + radius * 2, y - radius * 2];
    } else if (direction == CircularBeadDirection.X1Y2) {
        bgBox = [x + radius * 2, y + radius * 2];
        curCir = [x + radius * 2, y - radius * 2];
    } else if (direction == CircularBeadDirection.X2Y1) {
        bgBox = [x - radius * 2, y - radius * 2];
        curCir = [x + radius * 2, y - radius * 2];
    } else {
        bgBox = [x - radius * 2, y + radius];
        curCir = [x - radius * 2, y + radius * 2];
    }
    

    ctx.fillStyle = color;
    ctx.fillRect(bgBox[0], bgBox[1], radius, radius);

    // 画圆
    ctx.beginPath();
    ctx.arc(curCir[0], curCir[1], radius, 0, Math.PI * 2);
    ctx.fillStyle = bgColor;
    ctx.fill();
};


const rgb2hex = (r: number, g: number, b: number) => `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;


// 获取canvas每个像素的颜色，使用二维Array表示
export const getCanvasPixelColor = (ctx: CTX, w: number, h: number) => {
    if (w === 0 || h === 0) return [];

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const colors: string[][] = [];

    for (let i = 0; i < h; i++) {
        colors[i] = [];
        for (let j = 0; j < w; j++) {
            const index = (i * w + j) * 4;

            colors[i][j] = rgb2hex(data[index], data[index + 1], data[index + 2]);
        }
    }

    return colors;
};