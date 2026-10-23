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
 * Administrator access is assigned in Firestore:
 * 1. Copy the user's UID from Authentication > Users.
 * 2. Create admins/{that UID} in Firestore with active: true (boolean).
 * The website can read only the signed-in user's own admin document. The
 * security rules prevent customers from creating or changing admin documents.
 */

/* Reservation notification recipient (the Cloud Function also uses this). */
window.OREOS_CAFE_EMAIL = "canvalogin.ayaan@gmail.com";
