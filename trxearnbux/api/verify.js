import crypto from "crypto";

export default function handler(req, res) {
  const { initData } = req.body;
  const BOT_TOKEN = "8276388475:AAE90AnhNnGQR3q19t1eVk9lOYIpCSW4ydA";

  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get("hash");
  urlParams.delete("hash");

  const dataCheckString = [...urlParams]
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(BOT_TOKEN)
    .digest();

  const _hash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  res.json({ valid: _hash === hash });
}
