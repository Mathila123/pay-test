# MD WEBX — PayHere Product Page

A secure product checkout page using PayHere payment gateway. The merchant ID and secret are **never exposed to the frontend** — all sensitive operations happen in a Vercel serverless function.

## Architecture

```
/
├── public/
│   ├── index.html       ← Product page
│   ├── success.html     ← Post-payment success
│   └── cancel.html      ← Payment cancelled
├── api/
│   └── checkout.js      ← Serverless fn: generates PayHere hash
├── .env.local           ← Local secrets (never committed)
├── .env.example         ← Template for env vars
├── vercel.json          ← Vercel routing config
└── package.json
```

## How It Works

1. User clicks "Buy Now"
2. Frontend calls `/api/checkout` with order details
3. Serverless function reads `PAYHERE_MERCHANT_ID` + `PAYHERE_SECRET` from env vars
4. Computes the MD5 hash securely on the server
5. Returns `merchantId` + `hash` to frontend
6. Frontend populates a hidden form and submits to PayHere

**The secret never leaves the server.**

## Local Development

```bash
# Install Vercel CLI
npm install

# Copy env template
cp .env.example .env.local
# Fill in your real values in .env.local

# Run locally
npm run dev
# → http://localhost:3000
```

## Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Import in Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. **Add Environment Variables** (Settings → Environment Variables):
   - `PAYHERE_MERCHANT_ID` = `1231941`
   - `PAYHERE_SECRET` = `Mzg1NTc0MDE1MDgzMDU4MDk0NDI4OTU4NDMwNTgyOTg4ODI1MTA0`
4. Deploy!

## Go Live

The form currently points to **PayHere Sandbox**:
```
action="https://sandbox.payhere.lk/pay/checkout"
```

When ready for production, change it to:
```
action="https://www.payhere.lk/pay/checkout"
```

## Customizing the Product

Edit `public/index.html` to change:
- Product name, description, features
- Price (also update `amount` in the `startCheckout()` function)
- Customer `first_name`, `email`, `phone` fields in the hidden form (ideally collect from a form)
