function mod(n, p) {
    return ((n % p) + p) % p;
}

function inverseMod(a, p) {
    let [m0, x0, x1] = [p, 0, 1];
    while (a > 1) {
        let q = Math.floor(a / p);
        [a, p] = [p, a % p];
        [x0, x1] = [x1 - q * x0, x0];
    }
    return mod(x1, m0);
}

function pointAddition(p1, p2, a, p) {
    if (p1 === null) return p2;
    if (p2 === null) return p1;

    let [x1, y1] = p1;
    let [x2, y2] = p2;

    if (x1 === x2 && y1 === mod(-y2, p)) return null; // P + (-P) = O

    let m;
    if (x1 === x2) {
        m = mod((3 * x1 ** 2 + a) * inverseMod(2 * y1, p), p);
    } else {
        m = mod((y2 - y1) * inverseMod(x2 - x1, p), p);
    }

    const x3 = mod(m ** 2 - x1 - x2, p);
    const y3 = mod(m * (x1 - x3) - y1, p);
    return [x3, y3];
}

function pointMultiplication(k, point, a, p) {
    let result = null;
    let addend = point;

    while (k > 0) {
        if (k % 2 === 1) {
            result = pointAddition(result, addend, a, p);
        }
        addend = pointAddition(addend, addend, a, p);
        k = Math.floor(k / 2);
    }

    return result;
}

// Исходные данные
const a = 3;
const b = 5;
const p = 17;
const G = [1, 3];
const k1 = 8;
const k2 = 11;

// Проверка эллиптической кривой
if (mod(4 * a ** 3 + 27 * b ** 2, p) === 0) {
    console.log("Кривая недопустима");
    return;
}

// Вычисление открытых ключей
const P1 = pointMultiplication(k1, G, a, p);
const P2 = pointMultiplication(k2, G, a, p);

console.log("Открытые ключи:");
console.log("P1:", P1);
console.log("P2:", P2);

// Вычисление общего секрета
const S1 = pointMultiplication(k1, P2, a, p);
const S2 = pointMultiplication(k2, P1, a, p);

console.log("Общий секрет у абонента A:", S1);
console.log("Общий секрет у абонента B:", S2);

if (JSON.stringify(S1) === JSON.stringify(S2)) {
    console.log("Общий секрет совпадает.");
} else {
    console.log("Общий секрет не совпадает.");
}
