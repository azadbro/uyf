import { db } from "../firebaseConfig.js";

export default async function handler(req, res) {
  const { adminId, action, payload } = req.body;
  if (adminId !== "6434588999") return res.status(403).json({ error: "Not authorized" });

  if (action === "withdrawals") {
    const snap = await db.ref("withdrawals").get();
    return res.json(snap.val() || {});
  }

  if (action === "approve") {
    const { withdrawId } = payload;
    await db.ref("withdrawals/" + withdrawId).update({ status: "Approved" });
    return res.json({ status: "ok" });
  }

  if (action === "reject") {
    const { withdrawId } = payload;
    await db.ref("withdrawals/" + withdrawId).update({ status: "Rejected" });
    return res.json({ status: "ok" });
  }

  res.json({ status: "unknown action" });
}
