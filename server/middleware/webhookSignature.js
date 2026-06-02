import crypto from "crypto"

function timingSafeCompare(a, b) {
  const aBuf = Buffer.from(a || "", "utf8")
  const bBuf = Buffer.from(b || "", "utf8")
  if (aBuf.length !== bBuf.length) return false
  return crypto.timingSafeEqual(aBuf, bBuf)
}

export const verifyKopoKopoWebhookSignature = (req, res, next) => {
  const secret = process.env.KOPOKOPO_WEBHOOK_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return res.status(503).json({ message: "Webhook secret not configured" })
    }
    return next()
  }

  const signature = req.header("x-kopokopo-signature") || req.header("x-signature")
  if (!signature) {
    return res.status(401).json({ message: "Missing webhook signature" })
  }

  const payload = JSON.stringify(req.body || {})
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex")
  if (!timingSafeCompare(signature, expected)) {
    return res.status(401).json({ message: "Invalid webhook signature" })
  }

  return next()
}
