const a = 3;
const b = 5;
const p = 17;
const x = 1;
const y = 3;
const k1 = 8;
const k2 = 11;



class MyCrypto {
    constructor(params) {
        const { p, x, y, k1, k2 } = params;

        this.p = p;
        this.x = x;
        this.y = y;

        return this;
    }

    establishSecureСonnection(a, b) {
        const E = 
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