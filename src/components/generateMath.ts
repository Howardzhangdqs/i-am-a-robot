
const templates_easy: { question: string, answer: (x: number, y: number) => number }[] = [
    { question: "{1} \\times {2}", answer: (x: number, y: number) => (x * y) },
    { question: "{1} \\div {2}", answer: (x: number, y: number) => (x / y) },
    { question: "{1} + {2}", answer: (x: number, y: number) => (x + y) },
    { question: "{1} - {2}", answer: (x: number, y: number) => (x - y) },
];

const templates_medium: { question: string, answer: (x: number, y: number, z: number) => number }[] = [
    { question: "{1} \\times {2} + {3}", answer: (x, y, z) => (x * y + z) },
    { question: "\\frac{{1}}{{2}} + {3}", answer: (x, y, z) => (x / y + z) },
    { question: "{1} \\times \\frac{{2}}{{3}}", answer: (x, y, z) => (x * (y / z)) },
    { question: "\\frac{{1}}{{2} + {3}}", answer: (x, y, z) => (x / (y + z)) },
    { question: "{3} - \\frac{{1}}{{2}}", answer: (x, y, z) => (z - x / y) },
];

const hardQuestions1: [string, number][] = [
    ["\\sum_{k=0}^∞\\frac{8}{(4k+3)(4k+5)}", 0.8584073464102068],
    ["\\sum_{k=0}^∞\\frac{8}{(4k+1)(4k+3)}", 3.141592653589793],
    ["\\sum_{k=0}^∞\\frac{16}{(4k+1)(4k+3)(4k+5)}", 1.1415926535897931],
    ["\\sum_{k=0}^∞\\frac{48}{(4k+1)(4k+3)(4k+9)}", 1.9415926535897934],
    ["\\sum_{k=0}^∞\\frac{24}{(4k+3)(4k+9)}", 1.658407346410207],
    ["\\sum_{k=0}^∞\\frac{216}{(4k+3)(4k+6)(4k+12)}", 1.3584073464102069],
    ["\\sum_{k=0}^∞\\frac{48}{(4k+3)(4k+5)(4k+9)}", 0.45840734641020675],
    ["\\sum_{k=0}^∞\\frac{48}{(4k+3)(4k+7)(4k+9)}", 0.34159265358979324],
];

const templates_hard: { question: string | ((x: number, y: number, z: number, a: number) => string), answer: (x: number, y: number, z: number, a: number) => number, }[] = [
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        question: (x, _y, _z, _a) => {
            return `\\displaystyle \\int_0^1\\frac{x^{${4 * x + 2}}-1}{x^4-1}\\,\\mathrm{d}x`;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        answer: (x, _y, _z, _a) => {
            let res = 0;
            for (let i = 1; i <= x; i++) res += 1 / (4 * i - 1);
            return res * 4;
        }
    },
    {
        question: (_x, _1, _2, x) => {
            return hardQuestions1[x][0];
        },
        answer: (_x, _1, _2, x) => {
            return hardQuestions1[x][1];
        }
    }
    // { question: "\\frac{{1}}{{2}}", answer: (x, y, z, a) => (x / y) },
    // { question: "{1} + {2}", answer: (x, y, z, a) => (x + y) },
    // { question: "{1} - {2}", answer: (x, y, z, a) => (x - y) },
];

const randint = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export default (difficulty: number): [string, number] => {
    if (difficulty == 1) {
        const n1 = randint(1, 5);
        const n2 = randint(5, 10);
        const template = templates_easy[randint(0, templates_easy.length - 1)];
        return [
            template.question.replace("{1}", n1.toString()).replace("{2}", n2.toString()),
            template.answer(n1, n2)
        ];
    } else if (difficulty == 2) {
        const n1 = randint(100, 999);
        const n2 = randint(100, 999);
        const n3 = randint(100, 999);
        const template = templates_medium[randint(0, templates_medium.length - 1)];
        return [
            template.question
                .replace("{1}", n1.toString())
                .replace("{2}", n2.toString())
                .replace("{3}", n3.toString()),
            template.answer(n1, n2, n3)
        ];
    } else {
        const n1 = randint(3, 10);
        const n2 = randint(10, 100);
        const n3 = randint(100, 999);
        const n4 = randint(0, 7);
        const template = templates_hard[randint(0, templates_hard.length - 1)];
        return [
            typeof template.question == "string" ?
                template.question
                    .replace("{1}", n1.toString())
                    .replace("{2}", n2.toString())
                    .replace("{3}", n3.toString())
                    .replace("{4}", n4.toString()) : template.question(n1, n2, n3, n4),
            template.answer(n1, n2, n3, n4)
        ];
    }
};