import crypto from "crypto";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const merchantId = process.env.PAYHERE_MERCHANT_ID;
  const secret = process.env.PAYHERE_SECRET;

  if (!merchantId || !secret) {
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  const { orderId, amount, currency } = req.body;

  if (!orderId || !amount || !currency) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // PayHere hash: MD5(merchant_id + order_id + amount + currency + MD5(secret).toUpperCase())
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
