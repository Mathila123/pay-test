import crypto from "crypto";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const merchantId = process.env.PAYHERE_MERCHANT_ID;
  const secret = process.env.PAYHERE_SECRET;

  if (!merchantId || !secret) {
    console.error("Missing PAYHERE_MERCHANT_ID or PAYHERE_SECRET env vars");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  let body = req.body;

  // Handle cases where body is a string (not auto-parsed)
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }

  const { orderId, amount, currency } = body || {};

  if (!orderId || !amount || !currency) {
    return res.status(400).json({ error: "Missing orderId, amount, or currency" });
  }

  // PayHere hash formula:
  // MD5( merchant_id + order_id + amount + currency + MD5(secret).toUpperCase() )
  const secretHash = crypto
    .createHash("md5")
    .update(secret)
    .digest("hex")
    .toUpperCase();

  const formattedAmount = parseFloat(amount).toFixed(2);

  const hash = crypto
    .createHash("md5")
    .update(merchantId + orderId + formattedAmount + currency + secretHash)
    .digest("hex")
    .toUpperCase();

  return res.status(200).json({
    merchantId,
    hash,
    orderId,
    amount: formattedAmount,
    currency,
  });
}