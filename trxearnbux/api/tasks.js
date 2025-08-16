import { db } from "../firebaseConfig.js";

export default async function handler(req, res) {
  const { userId, adsWatched } = req.body;
  if (!userId || !adsWatched) return res.status(400).json({ error: "Missing params" });

  if (adsWatched >= 100) {
    const userRef = db.ref("users/" + userId);
    const snap = await userRef.get();
    let balance = snap.val().balance || 0;

    balance += 0.1;

    await userRef.update({
      balance,
      earnings: { ...(snap.val()?.earnings || {}), tasks: (snap.val()?.earnings?.tasks || 0) + 0.1 }
    });

    res.json({ status: "rewarded", reward: 0.1 });
  } else {
    res.json({ status: "not eligible" });
  }
}
