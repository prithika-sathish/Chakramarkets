# ChakraMarkets

A modern options analytics and portfolio tool for Indian markets. Think of it as a lightweight, DIY take on Sensibull: clean UI, fast charts, and practical tools for decisions—not noise.

---

## Demo

![ChakraMarkets Demo](https://media.giphy.com/media/mEXnQLhtoUUWI3ahwL/giphy.gif)

---

## What it does

* **Real‑time OI visuals** for NIFTY, BANKNIFTY, FINNIFTY, MIDCPNIFTY and NSE F\&O stocks.
* **Change in OI vs Total OI** side‑by‑side so you spot shifts, not just levels.
* **Multi‑expiry view** (indices: 2 weekly + 2 monthly; stocks: 2 monthly).
* **Strike range control** to focus on relevant strikes.
* **Strategy payoff** for up to **10 legs**, at target date and at expiry.
* **IV estimates** per strike using a Black‑style model (OTM calls and puts shown).
* **Synthetic futures** price via put‑call parity for consistent IVs across expiries.
* **Auto‑refresh every 3 minutes** (e.g., 09:30, 09:33, …) via a Web Worker.
* **RTK Query cache** (\~3 minutes) and **local storage** for last‑used underlying.

---

## New: Portfolio Manager + Priority Alerts

**Why**: You need one place to track positions, risk, and what deserves your attention first.

**What you get**

* **Positions**: Add trades (options, futures, cash) with size, price, and expiry.
* **Live P\&L**: Mark‑to‑market using the same price/IV pipeline as analytics.
* **Greeks**: Per‑leg and aggregated Delta/Gamma/Vega/Theta (where data allows).
* **Risk views**: Payoff curve, exposure by expiry, and concentration by symbol.
* **Tagging**: Group by strategy (e.g., Iron Condor, Covered Call) for quick filters.

**Priority‑based alerts**

* **Levels**: `Critical` (act now), `High` (check soon), `Normal` (monitor), `Low` (FYI).
* **Triggers** (configurable thresholds):

  * Underlying move vs entry (%, ATR, or absolute points)
  * IV spike/dive vs 20‑day baseline
  * OI buildup/long‑short shifts near your strikes
  * Time decay milestones (e.g., T‑7, T‑3)
  * Breach of payoff breakeven or risk cap
* **Channels**: In‑app toasts, badge counts, and optional email/webhook.
* **Noise control**: Cooldowns per rule and daily alert cap.

> Quick start: Defaults are conservative. Edit thresholds in **Settings → Alerts** to match your risk tolerance.


## Data & math 

* **Data source**: NSE endpoints proxied through the backend. Avoids CORS issues and keeps keys/timing server‑side.
* **IV model**: A Black‑style options model. We estimate IV from option prices; per expiry we use a synthetic futures price from put‑call parity so calls/puts align.
* **Why results may differ from vendors**: Some vendors use actual listed futures for monthlies and slightly different time‑to‑expiry conventions. Expect small IV/PNL deltas.

Attribution: the core Black/Black‑Scholes style logic was adapted and simplified from open‑source references; the implementation here is tailored for JS and this app’s data flow.

---

## Setup

1. **Clone the repo**
2. **Backend**

   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. **Frontend**

   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
4. Open `http://localhost:5173`.

> The backend acts as a thin proxy to NSE. If you rate‑limit yourself, slow down the refresh or add simple caching.

---

## Configuration

Create a `.env` in **backend** for proxy and rate controls:

```env
PORT=5050
REFRESH_SEC=180     # 3‑minute cadence
CACHE_TTL_SEC=180   # RTK Query pairs with this client‑side
```

Optionally add other providers (e.g., Alpha Vantage for equities or fallback quotes) and wire them behind the same interface.

---

## Usage

* Pick an **underlying** → choose **expiries** → set **strike range**.
* Toggle **Change OI / Total OI**.
* Build a strategy (max 10 legs) → see payoff now vs expiry.
* In **Portfolio**, add positions and set **alert rules**. The alert badge reflects the highest current priority.



---

## Notes

* For education/research. Not investment advice.
* NSE site and APIs may throttle or change. Keep your refresh modest.
* Market hours/holidays affect live data.


