# Paisley & Pallu — Saree E-commerce Website

Full-stack saree store: Node.js/Express backend + MongoDB + React (Vite) frontend,
Razorpay payment (Online + COD with +₹100 advance), and delivery.com live-tracking
integration (runs in simulated mode until you add the real API key).

```
saree-store/
  backend/     -> Node.js + Express + MongoDB API
  frontend/    -> React (Vite) storefront
```

---

## 0. Munnadi install pannanum (prerequisites)

1. **Node.js** (v18 or above) — https://nodejs.org (LTS version download pannunga)
2. **VS Code** — https://code.visualstudio.com
3. **MongoDB** — rendu option irukku, edhuvachum eduthukalam:
   - **Option A (easy):** MongoDB Atlas free cloud DB — https://www.mongodb.com/cloud/atlas/register la account create panni oru free cluster create pannunga. "Connect" → "Drivers" la irundhu connection string (`mongodb+srv://...`) copy pannunga.
   - **Option B:** Local MongoDB install pannunga (`mongodb.com/try/download/community`) — appo `mongodb://127.0.0.1:27017/sareeStore` use pannalam (already default ah vச்சிருken).
4. **Razorpay account** — https://dashboard.razorpay.com/signup la free signup pannunga (TEST mode automatic ah enable aagidum). Signup aana odane "Settings → API Keys" la "Generate Test Key" click panni `Key Id` and `Key Secret` vaangikonga.

---

## 1. Project folder ah VS Code la open pannunga

- Intha `saree-store` folder ah unga computer la edho oru place la save pannunga (Desktop or Documents).
- VS Code open pannunga → **File → Open Folder** → `saree-store` folder select pannunga.
- VS Code la **Terminal → New Terminal** open pannunga (rendu terminal venum — backend & frontend ku separate).

---

## 2. Backend setup

Terminal 1 la:

```bash
cd backend
npm install
```

Idhu `express`, `mongoose`, `razorpay`, `cors`, `dotenv`, `axios`, `nodemon` — ellame install pannidum.

`.env` file create pannunga:

```bash
cp .env.example .env
```

(Windows la `cp` velaya na, `.env.example` file ah copy panni `.env` nu rename pannunga.)

`.env` file open panni idha fill pannunga:

```
PORT=5000
MONGO_URI=<unga MongoDB connection string — Atlas or local>
RAZORPAY_KEY_ID=<unga Razorpay TEST Key Id>
RAZORPAY_KEY_SECRET=<unga Razorpay TEST Key Secret>
COD_EXTRA_CHARGE=100
DELIVERY_API_BASE_URL=
DELIVERY_API_KEY=
CLIENT_URL=http://localhost:5173
```

> `DELIVERY_API_BASE_URL` and `DELIVERY_API_KEY` empty ah vச்சிருந்தா, tracking **simulated mode** la automatic ah run aagum (dummy tracking progress kaamikum). Neenga delivery.com oda real API key kudutha odane, adha inga podanga — automatic ah live mode ku switch aayidum, code edhuvum change pannanam nu illa.

**Dummy sarees database la insert panna** (30 sarees, 6 categories):

```bash
npm run seed
```

**Backend server start pannunga:**

```bash
npm run dev
```

`http://localhost:5000` la "Saree Store API is running" nu kaamikanum. Ithu run aana state la vachukonga (close pannaadheenga).

---

## 3. Frontend setup

Terminal 2 la (backend terminal ah close pannaama, pudhu terminal open pannunga):

```bash
cd frontend
npm install
```

`.env` file create pannunga:

```bash
cp .env.example .env
```

Default value already correct ah irukum (`VITE_API_BASE_URL=http://localhost:5000/api`) — backend வேற port la run aana mattum change pannunga.

**Frontend start pannunga:**

```bash
npm run dev
```

Terminal la kaamikura link (`http://localhost:5173`) browser la open pannunga — website ready!

---

## 4. Test pannunga

1. Website la category click pannunga → 5 sarees per category kaamikanum.
2. Oru saree open panni "Add to Cart" pannunga → Cart page ku pogunga → "Proceed to Checkout".
3. Address fill panni, payment method select pannunga:
   - **Pay Online** → Razorpay checkout window open aagum. TEST mode la irukura padhala, **real money edukaadhu**. Test UPI ID: `success@razorpay` (adhu automatic ah "success" kaamikum). Test card: `4111 1111 1111 1111`, edho future expiry date, edho 3-digit CVV.
   - **Cash on Delivery** → ₹100 advance mattum Razorpay la charge aagum (same test UPI/card), balance amount COD ah irukum.
4. Payment success aana odane "Payment accepted" message kaamikanum → Order confirm aagidum.
5. "My Orders" page ku pogi, checkout la kudutha phone number type panni "Find Orders" pannunga → order kaamikanum, kீழ இருக்கறது **live tracking timeline** (Order Placed → Picked Up → In Transit → Out for Delivery → Delivered) automatic ah progress aagum (simulated, since delivery.com real key innum illa).

---

## 5. Production ku deploy panna (later)

- **Backend:** Render / Railway / a VPS la deploy pannunga, `.env` la production Razorpay keys (`rzp_live_...`) and MongoDB Atlas URI podunga.
- **Frontend:** `npm run build` pannunga (`frontend/dist` folder varum), Vercel / Netlify la deploy pannunga. `VITE_API_BASE_URL` ah production backend URL ku update pannunga.
- **Razorpay:** TEST keys ah LIVE keys ku change pannanum (KYC complete pannanum Razorpay dashboard la).
- **delivery.com:** real `DELIVERY_API_BASE_URL` + `DELIVERY_API_KEY` backend `.env` la podunga — `backend/routes/tracking.js` file la already real-API call code ready ah irukku (`LIVE_MODE` automatic ah on aagum), just adhula delivery.com oda actual endpoint/request-response fields match pannanum (avanga API docs paathu konjam adjust pannunga).

---

## Notes

- Idhu **dummy data** — product images Unsplash free placeholder images (`source.unsplash.com`). Real product photos vandha, `backend/seed/seedData.js` la image URLs replace pannitu `npm run seed` again run pannunga.
- No login system — "My Orders" phone number based lookup (guest checkout). Login/signup venumna sollunga, adha separate ah add pannalam.
- Prices are never trusted from the frontend — backend recalculates everything from the database before charging, so it's safe against tampering.
