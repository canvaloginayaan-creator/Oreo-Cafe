# Oreo's Cafe — storefront + Firebase admin

A responsive coffee storefront and administration panel built with **plain HTML, CSS and JavaScript**. No React, Tailwind, bundler or website build step is used.

## Included

### Storefront

- Firestore-backed product catalogue with the original 24-item menu as a fallback.
- `product.html`: full description, image, Small/Medium/Large drink sizes, add-ons, quantity, related products, add to cart and Buy now.
- `checkout.html`: personal details, pickup/delivery, address, notes, order summary and pending-order creation.
- Payment choices are **Pay at cafe** and **Cash on delivery**. The site deliberately does not request card details.
- Email/password signup and login, Google login, password reset and email verification in `auth.html`.
- Customer account page with order history.
- Persistent shared cart, favourites, themes, search, gallery and installable PWA.
- Firestore table requests with a Gmail notification Cloud Function.
- Clickable footer destinations, including Careers, News, Contact, Terms, Privacy and app-install instructions.

### Admin panel — `admin.html`

- Firebase Authentication gate plus server-side Firestore admin rules.
- Overview: **products, total orders, pending orders and total sales** (fulfilled orders).
- Seven-day sales chart, recent orders and low-stock list.
- Add, edit and delete products with price, category, SKU, stock, rating, descriptions, ingredients, preparation time, calories, image URL, size price changes, availability and featured state.
- Import the original starter menu with one click.
- Incoming orders with customer details and pending, preparing, ready, fulfilled and cancelled states.
- Reservation management and email-delivery status.
- CSV order export.

## Run locally

Serve this directory rather than opening files through `file://`:

```bash
cd demo/demo
python3 -m http.server 3000
```

Open `http://localhost:3000`. Without Firebase configuration, the menu and cart work in demo mode. Demo orders stay in the browser, and reservations use a clearly labelled email-app fallback.

## 1. Connect Firebase

1. Create a project in [Firebase Console](https://console.firebase.google.com/).
2. In **Build → Authentication → Sign-in method**, enable:
   - Email/Password
   - Google
3. In **Authentication → Settings → Authorized domains**, add every domain used by the site, including your Vercel production domain and any preview domain you will use.
4. Create a **Cloud Firestore** database.
5. In the Firebase project, add a **Web app** and copy its web configuration into:

```text
demo/demo/firebase-config.js
```

Replace every `YOUR_...` placeholder. The web configuration identifies the project and is safe to use in a browser. Never place a service-account key, Gmail password or Gmail app password in that file.

## 2. Publish the security rules

The rules are in the repository root:

```text
firestore.rules
```

Either paste them into **Firestore Database → Rules** and publish, or use the Firebase CLI from the repository root:

```bash
firebase deploy --only firestore:rules
```

The rules provide:

- Public product reads.
- Product writes only for admins.
- Customer access only to their own order history.
- Validated pending-order and reservation creation.
- Order/reservation administration only for admins.

## 3. Create and authorize the admin

1. On the main website, open **Log in → Sign up**.
2. Create the account using `canvalogin.ayaan@gmail.com`, or sign in with that Google account.
3. For email/password signup, open the verification email and verify the address. In the account page, choose **I've verified** if needed.
4. Open `admin.html` and sign in with the same credentials.

The default admin allow-list appears in both places:

- `demo/demo/firebase-config.js` → `OREOS_ADMIN_EMAILS`
- `firestore.rules` → `isAdmin()`

If you use a different admin email, change it in **both** files and publish the rules again. Signing up alone never grants admin access. A Firebase custom claim of `admin: true` is also supported.

After the first admin login, open **Products → Import starter menu** if you want to manage the original 24 products through Firestore. New and edited products appear on the public site in real time.

## 4. Enable reservation emails

The included function is:

```text
functions/index.js → sendReservationEmail
```

When a document is created in `reservations`, it sends the complete request to **canvalogin.ayaan@gmail.com** and updates `emailStatus` to `sent` or `failed`.

### Gmail preparation

1. Use the Gmail account `canvalogin.ayaan@gmail.com`.
2. Enable two-step verification in the Google account.
3. Create a **Gmail app password**. This is not your normal Gmail password.
4. Keep the app password private.

### Deploy the function

Cloud Functions deployment may require the Firebase Blaze (pay-as-you-go) plan. From the repository root:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
cd functions
npm install
cd ..
firebase functions:secrets:set GMAIL_APP_PASSWORD
# Paste the Gmail app password at the secure prompt.
firebase deploy --only functions
```

The sender defaults to `canvalogin.ayaan@gmail.com`. The recipient is already set to the same address. Do not skip the function deployment if you want automatic email: saving a request in Firestore alone cannot send email from a static website.

You can monitor delivery in the admin panel's Reservations view and in Firebase Functions logs.

## 5. Deploy to Vercel

This remains a static website. Use `demo/demo` as the Vercel root directory, with no framework and no build command. Add the resulting domain to Firebase Authorized domains.

The root `firebase.json` is for Firebase Hosting/rules/functions deployment; it does not add a website build step.

## Firestore collections

- `products`: public menu products managed by the admin.
- `orders`: customer details, item snapshots, totals and fulfilment status.
- `reservations`: table requests, reservation status and email-delivery status.
- `users`: basic account profile metadata; admin authorization is not taken from this collection.

## Product images and image-upload limits

You do not need to upload more images through chat. In **Admin → Products**, paste a direct **HTTPS image URL**. The image stays hosted by your chosen image host and displays on the storefront.

For reliable results:

- Use a direct image file URL, not a link to an HTML page.
- Square or 4:5 photos work best.
- Compress images to WebP/JPEG, roughly 1000–1400 px on the long edge.
- Keep files around 200–400 KB where practical.
- A local project path such as `images/oat-latte.jpg` also works.

Existing local photos remain in `images/`. Missing images fall back to the product emoji and brand gradient.

## Main files

| File | Purpose |
| --- | --- |
| `index.html`, `style.css`, `script.js` | Original-style storefront |
| `data.js` | Starter products and shared product helpers |
| `cart.js` | Shared persistent cart |
| `firebase-config.js` | Your public Firebase web configuration and admin email list |
| `firebase-service.js` | Auth and Firestore adapter |
| `product.html`, `product.js` | Product details/options |
| `checkout.html`, `checkout.js` | Personal details and order creation |
| `auth.html`, `auth.js` | Login, signup, Google auth and account history |
| `admin.html`, `admin.css`, `admin.js` | Protected management dashboard |
| `info.html`, `info.js` | Footer information pages |
| `../../firestore.rules` | Firestore access control (repository root) |
| `../../functions/index.js` | Reservation email function (repository root) |

## Before production

- Add the real Firebase configuration and publish the rules.
- Deploy the reservation email function and test a real request.
- Replace the sample address, public contact email and generic social links with the cafe's real details where necessary.
- Test email/password and Google sign-in on the final Vercel domain.
- Test a complete order and mark it fulfilled in the admin panel.
