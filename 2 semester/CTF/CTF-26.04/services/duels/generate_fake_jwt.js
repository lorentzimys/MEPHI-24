// Устанавливаем зависимости:
// npm install jsonwebtoken

import jwt from 'jsonwebtoken';
import fs from 'fs';

// Твой секрет (раз ты его знаешь)
const secret = 'i-am-so-secret'; // <-- сюда вставь настоящий секрет

// Данные, которые ты хочешь зашить в токен
const payload = {
  username: 'admin',
  role: 'admin', // можно добавить любые поля
  iat: Math.floor(Date.now() / 1000), // время выпуска токена
  exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // токен живет 1 день
};

// Генерация токена
const token = jwt.sign({ username: 'admin'}, secret);

// Вывод токена в консоль
console.log('Generated JWT Token:\n');
console.log(token);

// Если хочешь сохранить токен в файл
fs.writeFileSync('fake_token.txt', token);
console.log('\nToken saved to fake_token.txt');
