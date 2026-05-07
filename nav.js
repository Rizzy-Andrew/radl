// nav.js - Universal nav handler
// Usage: <nav></nav> and <script type="module" src="/nav.js"></script>
// To add/remove nav links, only edit this file!

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAyNCyGdahYYsLbG1sP8GGKc7AAogyI7V4",
  authDomain: "radl-652e8.firebaseapp.com",
  projectId: "radl-652e8",
  storageBucket: "radl-652e8.firebasestorage.app",
  messagingSenderId: "453756233220",
  appId: "1:453756233220:web:a43c80ffe66ab17c4f7751"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ─────────────────────────────────────────────
// EDIT YOUR NAV LINKS HERE
// To add a new page, just add a new object!
// ─────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Home',              href: '/' },
  { label: 'Placement History', href: '/placement-history.html' },
  { label: 'Submit',            href: '/submit.html' },
  { label: 'Leaderboard',       href: '/leaderboard.html' },
  { label: 'Packs',             href: '/packs.html' },
];
// ─────────────────────────────────────────────

onAuthStateChanged(auth, async (user) => {
  const nav = document.querySelector('nav');
  if (!nav) return;

  // Clear nav entirely
  nav.innerHTML = '';

  // Build static links
  const currentPath = window.location.pathname;
  NAV_LINKS.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.label;
    if (
      (link.href === '/' && currentPath === '/') ||
      (link.href !== '/' && currentPath.includes(link.href.replace('.html', '')))
    ) {
      a.style.color = 'var(--accent)';
    }
    nav.appendChild(a);
  });

  // Auth links
  if (user) {
    let username = user.email.split('@')[0];
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        username = userDoc.data().username || username;
      }
    } catch (e) {}

    // Profile link (just shows username, goes to profile.html)
    const profileLink = document.createElement('a');
    profileLink.href = '/profile.html';
    profileLink.textContent = username;
    nav.appendChild(profileLink);

  } else {
    const loginLink = document.createElement('a');
    loginLink.href = '/login.html';
    loginLink.textContent = 'Login';
    nav.appendChild(loginLink);
  }
});

export { auth, db };
