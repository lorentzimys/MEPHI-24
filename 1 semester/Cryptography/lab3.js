#!/usr/bin/env node
const io = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

const originalText = `В 1982 году правительство США запросило предложения по стандарту подписи с открытым ключом. В августе 1991 года Национальный институт стандартов и технологий (NIST) предложил DSA для использования в своем стандарте цифровой подписи (DSS). Первоначально последовала значительная критика, особенно со стороны программных компаний, которые уже вложили усилия в разработку программного обеспечения для цифровой подписи на основе криптосистемы RSA.[1]: 484 Тем не менее, NIST принял DSA в качестве федерального стандарта (FIPS 186) в 1994 году. Выпущено пять редакций первоначальной спецификации: FIPS 186-1 в 1998 году,[4] FIPS 186-2 в 2000 году,[5] FIPS 186-3 в 2009 году,[6] FIPS 186-4 в 2013 году,[3] и FIPS 186-5 в 2023 году.[7] Стандарт FIPS 186-5 запрещает подписание с помощью DSA, разрешая проверку подписей, сгенерированных ранее. до даты внедрения стандарта в качестве документа. Он должен быть заменен более новыми схемами подписи, такими как EdDSA.[8]

DSA защищен патентом США 5 231 668, поданным 26 июля 1991 года, срок действия которого истек, и приписывается Дэвиду В. Кравицу,[9] бывшему сотруднику АНБ. Этот патент был выдан "Соединенным Штатам Америки в лице Министра торговли, Вашингтон, Округ Колумбия", и NIST сделал этот патент доступным по всему миру без роялти.[10] Клаус П. Шнорр утверждает, что его патент США 4 995 082 (также срок действия которого истек) распространяется на DSA; это утверждение оспаривается.[11]

В 1993 году Дейву Банисару удалось получить подтверждение через запрос FOIA, что алгоритм DSA разработан не NIST, а АНБ.[12]

OpenSSH объявила, что DSA планируется удалить в 2025 году.[13]`;

const compromisedInput = `В 1982 году правительство США запросило предложения по стандарту подписи с открытым ключом. В августе 1991 года Национальный институт стандартов и технологий (NIST) предложил DSA для использования в своем стандарте цифровой подписи (DSS). Первоначально последовала значительная критика, особенно со стороны программных компаний, которые уже вложили усилия в разработку программного обеспечения для цифровой подписи на основе криптосистемы RSA.[1]: 484 Тем не менее, NIST принял DSA в качестве федерального стандарта (FIPS 186) в 1994 году. Выпущено пять редакций первоначальной спецификации: FIPS 186-1 в 1998 году,[4] FIPS 186-2 в 2000 году,[5] FIPS 186-3 в 2009 году,[6] FIPS 186-4 в 2013 году,[3] и FIPS 186-5 в 2023 году.[7] Стандарт FIPS 186-5 запрещает подписание с помощью DSA, разрешая проверку подписей, сгенерированных ранее. до даты внедрения стандарта в качестве документа. Он должен быть заменен более новыми схемами подписи, такими как EdDSA.[8]
DSA защищен патентом США 5 231 668, поданным 26 июля 1991 года, срок действия которого истек, и приписывается Дэвиду В. Кравицу,[9] бывшему сотруднику АНБ. Этот патент был выдан "Соединенным Штатам Америки в лице Министра торговли, Вашингтон, Округ Колумбия", и NIST сделал этот патент доступным по всему миру без роялти.[10] Клаус П. Шнорр утверждает, что его патент США 4 995 082 (также срок действия которого истек) распространяется на DSA; это утверждение оспаривается.[11]

В 1993 году Дейву Банисару удалось получить подтверждение через запрос FOIA, что алгоритм DSA разработан не NIST, а АНБ.[12]

OpenSSH объявила, что DSA планируется удалить в 2025 году[13]`;

const p = 2027;
const q = 1013;
const a = 2025;

class MyCrypto {
    constructor(p, q, a) {
        this.p = p;
        this.q = q;
        this.a = a;

        return this;
    }

    /**
     * Фнукция для создания секретного ключа (x) и открытого ключа (y)
     */
    generateKeys() {
        const secretKey = BigInt(Math.max(1, Math.floor(Math.random() * this.q)));
        const publicKey = BigInt(this.a) ** BigInt(secretKey) % BigInt(this.p);

        return {
            publicKey,
            secretKey,
        }
    }

    #rotateRight(value, bits) {
        return (value >>> bits) | (value << (16 - bits)) & 0xFFFF;
    }
    
    /* Функция для генерации контрольной суммы */
    generateChecksum(input) {
        // Преобразуем строку в массив кодов символов
        const charCodes = [];
        for (let i = 0; i < input.length; i++) {
            const code = input.charCodeAt(i);
            charCodes.push(code);
        }
    
        // Разбиение на блоки по 16 бит
        const blocks = [];
        for (let i = 0; i < charCodes.length; i += 2) {
            let block = charCodes[i];
            if (i + 1 < charCodes.length) {
                block = (block << 8) | charCodes[i + 1];
            }
            blocks.push(block);
        }
    
        // Выполнение операций
        let hash = 0;

        for (let block of blocks) {
            hash = (hash ^ block) & 0xFFFF; // XOR и ограничение до 16 бит
            hash = this.#rotateRight(hash, 1);    // Циклический сдвиг вправо
        }

        return hash;
    }
    
    /* Функция создания временного сессионного ключа */
    generateSessionKey() {
        return Math.max(1, Math.floor(Math.random() * this.q));
    }

    /* Функция создания цифровой подписи */
    generateSignature(input, x) {
        const hash = BigInt(this.generateChecksum(input));
        const sessionKey = BigInt(this.generateSessionKey());
        const r = BigInt(this.a) ** BigInt(sessionKey) % BigInt(this.p);
        let r1 = 0n;
        
        while (r1 === 0n) {
            r1 = r % BigInt(this.q);
        }

        const signature = (BigInt(x) * r1 + sessionKey*hash) % BigInt(this.q);

        return { signature, r1 };
    }

    /* Функция проверки цифровой подписи */
    checkSignature(input, signature, r1, publicKey) {
        if (r1 <= 0n || r1 >= BigInt(this.q)) {
            return false;
        }

        let hash = BigInt(this.generateChecksum(input));

        if (hash % BigInt(this.q) === 0n) {
            hash = 1n;
        }

        const q = BigInt(this.q);
        const p = BigInt(this.p);
        const a = BigInt(this.a);

        const vector = hash**(q-2n) % q;
        const z1 = (signature * vector) % q;
        const z2 = ((q-r1) * vector) % q;
        const u = ((a ** z1) * (publicKey ** z2) % p) % q;

        return u === r1;
    }
}

const c = new MyCrypto(p, q, a);

// Генерируем ключи
const { publicKey, secretKey } = c.generateKeys();

// Генерируем цифровую подпись для текста
const { signature, r1 } = c.generateSignature(originalText, secretKey);

const isSignValid = c.checkSignature(originalText, signature, r1, publicKey)
const isSignValid1 = c.checkSignature(compromisedInput, signature, r1, publicKey)

console.log('Signature is valid for original text:', isSignValid);
console.log('Signature is valid for compromised text:', isSignValid1);

io.close();
