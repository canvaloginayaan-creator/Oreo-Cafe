/*
 * Firebase setup
 * 1. Create a project at https://console.firebase.google.com/
 * 2. Add a Web App and paste its configuration below.
 * 3. Enable Email/Password and Google in Authentication > Sign-in method.
 * 4. Create a Cloud Firestore database and publish firestore.rules.
 *
 * This file contains a web configuration, not a private service-account key.
 * Never put passwords, service-account JSON, or Gmail app passwords here.
 */
window.firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

/*
 * Administrator access is granted only to verified email addresses in this list.
 * Add the same address to isAdmin() in firestore.rules (already set for the
 * address below), or use an `admin: true` Firebase custom auth claim.
 * Signing up alone never grants administrator access.
 */
window.OREOS_ADMIN_EMAILS = ["canvalogin.ayaan@gmail.com"];

/* Reservation notification recipient (the Cloud Function also uses this). */
window.OREOS_CAFE_EMAIL = "canvalogin.ayaan@gmail.com";
