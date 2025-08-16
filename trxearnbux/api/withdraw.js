import { db } from "../firebaseConfig.js";

export default async function handler(req, res) {
  const { userId, amount, binanceUid } = req.body;
  if (!userId || !amount || !binanceUid) return res.status(400).json({ error: "Missing params" });

  if (amount < 0.5) return res.json({ status: "fail", message: "Minimum 0.5 TRX required" });

  const userRef = db.ref("users/" + userId);
  const snap = await userRef.get();
  if (!snap.exists()) return res.json({ status: "fail", message: "User not found" });

  let balance = snap.val().balance || 0;
  if (balance < amount) return res.json({ status: "fail", message: "Insufficient balance" });

  balance -= amount;

  await userRef.update({ balance });

  const withdrawRef = db.ref("withdrawals").push();
  await withdrawRef.set({
    userId,
    amount,
    binanceUid,
    status: "Pending",
    created: Date.now()
  });

  res.json({ status: "ok", message: "Withdrawal request submitted" });
}
