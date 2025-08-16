import { db } from "../firebaseConfig.js";

export default async function handler(req, res) {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  const userRef = db.ref("users/" + userId);
  const snap = await userRef.get();
  let balance = 0;
  let ads = 0;

  if (snap.exists()) {
    balance = snap.val().balance || 0;
    ads = snap.val().earnings?.ads || 0;
  }

  balance += 0.005;
  ads += 0.005;

  await userRef.update({
    balance,
    earnings: { ...(snap.val()?.earnings || {}), ads }
  });

  res.json({ balance, earned: 0.005 });
}
