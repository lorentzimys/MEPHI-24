#!/usr/bin/env node
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  }); 

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

const toDecrypt = args['D'] || args['decrypt']

class MyCrypto {
    static #table = {
        'A': 'C',
        'B': 'D',
        'C': 'A',
        'D': 'B',
        'E': 'H',
        'F': 'I',
        'G': 'J',
        'H': 'E',
        'I': 'F',
        'J': 'G',
        'K': 'O',
        'L': 'P',
        'M': 'Q',
        'N': 'R',
        'O': 'K',
        'P': 'L',
        'Q': 'M',
        'R': 'N',
        'S': 'U',
        'T': 'V',
        'U': 'W',
        'V': ':',
        'W': 'S',
        'X': 'T',
        'Y': 'Z',
        'Z': ' ',
        ' ': 'X',
        '.': 'Y',
        ',': ';',
        '!': '?',
        ':': '-',
        ';': '.',
        '?': ',',
        '-': '!',
    };

    #encryptionMap;

    #decryptionMap;

    constructor() {
        this.#encryptionMap = new Map(Object.entries(MyCrypto.#table));

        this.#decryptionMap = new Map(Object.entries(MyCrypto.#table).map((item) => item.reverse()))
    }

    encrypt(text) {
        const encrypted = [];
        const errors = [];

        for (let char of text) {
            const uppercaseChar = char.toUpperCase();

            if (this.#encryptionMap.has(uppercaseChar)) {
                encrypted.push(this.#encryptionMap.get(uppercaseChar));
            } else {
                errors.push(uppercaseChar);
            }
        }

        if (errors.length > 0) {
            throw new SyntaxError(`Данные символы не могут быть закодированы: ${errors.join(',')}`)
        }

        return encrypted.join('') 
    }

    decrypt(text) {
        const decrypted = [];

        for (let char of text) {
            const uppercaseChar = char.toUpperCase();

            if (this.#decryptionMap.has(uppercaseChar)) {
                decrypted.push(this.#decryptionMap.get(uppercaseChar));
            } else {
                throw new Error(`Данный текст не может быть декодирован`);
            }
        }

        return decrypted.join('');
    }
}

if (toDecrypt) {
    readline.question('Введите текст для дешифрования: ', text => {
        console.log(`Исходный текст, ${text}`);
        const crypto = new MyCrypto()

        try {
            const decrypted = crypto.decrypt(text);
            console.log(`Дешифрованный текст: ${decrypted}!`);
        } catch (e) {
            throw new Error(e)
        } finally {
            readline.close();
        }
    });
} else {
    readline.question('Введите текст латиницей для шифрования: ', text => {
        console.log(`Исходный текст, ${text}!`);
        const crypto = new MyCrypto()

        try {
            const encrypted = crypto.encrypt(text);
            console.log(`Зашифрованный текст: ${encrypted}`);
        } catch (e) {
            throw new Error(e)
        } finally {
            readline.close();
        }
    });
  
}


