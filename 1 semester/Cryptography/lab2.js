#!/usr/bin/env node
const io = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
})

const getArgs = () =>
process.argv.reduce((args, arg) => {
    // long arg
    if (arg.slice(0, 2) === "--") {
    const longArg = arg.split("=");
    const longArgFlag = longArg[0].slice(2);
    const longArgValue = longArg.length > 1 ? longArg[1] : true;
    args[longArgFlag] = longArgValue;
    }
    // flags
    else if (arg[0] === "-") {
    const flags = arg.slice(1).split("");
    flags.forEach((flag) => {
        args[flag] = true;
    });
    }
    return args;
}, {});
  
const args = getArgs();

const decrypt = args['D'] || args['decrypt'];
const encrypt = args['E'] || args['encrypt'];

class MyCrypto {
    static #calcGCD(a, b) {
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    
    static #findE(phi) {
        let e;
        do {
            e = Math.floor(Math.random() * (phi - 2)) + 2;
        } while (MyCrypto.#calcGCD(e, phi) !== 1);
        return e;
    }

    static #extendedEuclidean(a, b) {
        let oldR = a, r = b;
        let oldS = 1n, s = 0n;
        let oldT = 0n, t = 1n;
    
        while (r !== 0n) {
            const quotient = oldR / r;
            [oldR, r] = [r, oldR - quotient * r];
            [oldS, s] = [s, oldS - quotient * s];
            [oldT, t] = [t, oldT - quotient * t];
        }
    
        return { gcd: oldR, x: oldS, y: oldT };
    }
    
    static #modInverse(e, phi) {
        const { gcd, x } = MyCrypto.#extendedEuclidean(e, phi);
        if (gcd !== 1n) {
            throw new Error("e and φ are not coprime");
        }
        return (x % phi + phi) % phi;
    }

    static generateKeyPair(p,q) {
        const n = p*q;
        const phi = (p-1)*(q-1);
        const e = MyCrypto.#findE(phi);

         const d = MyCrypto.#modInverse(BigInt(e), BigInt(phi));

        const publicKey = {e: Number(e), n: Number(n)};
        const privateKey = {d: Number(d), n: Number(n)};
        
        return { publicKey, privateKey };
    }

    static encrypt(text, {e, n}) {
        return text
            .split("")
            .map(char => Number(BigInt(char.charCodeAt(0)) ** BigInt(e) % BigInt(n)))
            .join(" ");
    }

    static decrypt(ciphertext, {d, n}) {
        return ciphertext
            .split(" ")
            .map(charCode => String.fromCharCode(Number(BigInt(charCode) ** BigInt(d) % BigInt(n))))
            .join("");
    }
}

const p = 223;
const q = 317;

if (encrypt) {
    const { n, e } = args;
    console.log(n);
    console.log(e);
    
    io.question('Введите текст для шифрования:\n', text => {
        try {
            const encrypted = MyCrypto.encrypt(text, {n, e});
    
            console.log(`Зашифрованный текст:\n${encrypted}`);
        } catch (e) {
            throw new Error(e)
        } finally {
            io.close()
        }
    });   
} 

if (decrypt) {
    const { d, n } = args;
    console.log(d);
    console.log(n);

    io.question('Введите текст для дешифрования:\n', text => {
        try {
            const decrypted = MyCrypto.decrypt(text, {d, n});
            
            console.log(`Дешифрованный текст:\n${decrypted}`);
        } catch (e) {
            throw new Error(e);
        } finally {
            io.close();
        }
    });
} 

if (!encrypt && !decrypt) {
    const { privateKey, publicKey } = MyCrypto.generateKeyPair(p, q);
    
    console.log(`privateKey: ${JSON.stringify(privateKey)}, publicKey: ${JSON.stringify(publicKey)}`)
    io.close();
}

