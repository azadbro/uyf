import { db } from "../firebaseConfig.js";

export default async function handler(req, res) {
  const { userId, refId } = req.body;
  if (!userId || !refId) return res.status(400).json({ error: "Missing params" });

  const refUserRef = db.ref("users/" + refId);
  const snap = await refUserRef.get();
  if (!snap.exists()) return res.json({ status: "referrer not found" });

  let refBalance = snap.val().balance || 0;
  let refEarnings = snap.val().earnings?.referrals || 0;

  refBalance += 0.02;
  refEarnings += 0.02;

  await refUserRef.update({
    balance: refBalance,
    earnings: { ...(snap.val()?.earnings || {}), referrals: refEarnings },
    referrals: {
      ...(snap.val()?.referrals || {}),
      count: (snap.val()?.referrals?.count || 0) + 1
    }
  });

  res.json({ status: "ok", reward: 0.02 });
}
