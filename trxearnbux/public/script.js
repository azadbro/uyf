const tg = window.Telegram.WebApp;
tg.expand();

let user = tg.initDataUnsafe.user;
let userId = user.id;
let username = user.username || user.first_name;

document.getElementById("welcome").innerText = `Hi ${username}!`;
document.getElementById("refLink").innerText = `https://t.me/trxearnbux?start=${userId}`;

let cooldown = false;
let timer;

document.getElementById("watchAd").addEventListener("click", async () => {
  if (cooldown) return;

  // Ads sequence: Monetag then OnclickA
  show_9723717().then(() => {
    // OnclickA trigger
    const s = document.createElement("script");
    s.src = "https://js.onclckmn.com/static/onclicka.js";
    document.body.appendChild(s);

    setTimeout(async () => {
      const res = await fetch("/api/earn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      document.getElementById("balance").innerText = data.balance.toFixed(3);
    }, 1000);
  });

  startCooldown();
});

function startCooldown() {
  cooldown = true;
  let seconds = 30;
  timer = setInterval(() => {
    document.getElementById("cooldown").innerText = `⏳ Wait ${seconds}s`;
    seconds--;
    if (seconds < 0) {
      clearInterval(timer);
      document.getElementById("cooldown").innerText = "";
      cooldown = false;
    }
  }, 1000);
}

document.getElementById("withdrawBtn").addEventListener("click", async () => {
  let amount = parseFloat(document.getElementById("amount").value);
  let binanceUid = document.getElementById("binanceUid").value;

  const res = await fetch("/api/withdraw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, amount, binanceUid })
  });

  const data = await res.json();
  alert(data.message);
});

function showSection(id) {
  document.querySelectorAll(".page").forEach(sec => (sec.style.display = "none"));
  document.getElementById(id).style.display = "block";
}
