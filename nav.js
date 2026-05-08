// nav.js - Universal nav handler
// Usage: <nav></nav> and <script type="module" src="/nav.js"></script>

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

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
// ─────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Home',              href: '/' },
  { label: 'Placement History', href: '/placement-history.html' },
  { label: 'Submit',            href: '/submit.html' },
  { label: 'Leaderboard',       href: '/leaderboard.html' },
  { label: 'Packs',             href: '/packs.html' },
];
// ─────────────────────────────────────────────

// ── Light/Dark Mode ──────────────────────────
const style = document.createElement('style');
style.textContent = `
  body.light-mode {
    --bg: #f0f0f8;
    --surface: #ffffff;
    --border: #d0d0e8;
    --text: #1a1a2e;
    --text-muted: #6666aa;
    --accent: #ff6b35;
    --accent2: #a855f7;
    --accent3: #0891b2;
  }

  body.light-mode body::before {
    background-image:
      linear-gradient(rgba(168,85,247,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(168,85,247,0.06) 1px, transparent 1px);
  }

  .theme-toggle {
    background: none;
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 16px;
    padding: 4px 8px;
    transition: all 0.2s;
    line-height: 1;
  }

  .theme-toggle:hover {
    border-color: var(--accent2);
    color: var(--accent2);
  }

  .notif-btn {
    position: relative;
    background: none;
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 16px;
    padding: 4px 8px;
    transition: all 0.2s;
    line-height: 1;
  }

  .notif-btn:hover {
    border-color: var(--accent2);
    color: var(--accent2);
  }

  .notif-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #ef4444;
    color: white;
    font-size: 10px;
    font-weight: 700;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: sans-serif;
  }

  .notif-dropdown {
    display: none;
    position: absolute;
    right: 0;
    top: calc(100% + 12px);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    min-width: 280px;
    max-width: 320px;
    z-index: 999;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    overflow: hidden;
  }

  .notif-wrapper {
    position: relative;
    display: inline-block;
  }

  .notif-wrapper:hover .notif-dropdown,
  .notif-wrapper:focus-within .notif-dropdown {
    display: block;
  }

  .notif-header {
    padding: 12px 16px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
  }

  .notif-item {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
    line-height: 1.5;
  }

  .notif-item:last-child { border-bottom: none; }

  .notif-item.unread { background: rgba(168,85,247,0.05); }

  .notif-item .notif-title {
    font-weight: 700;
    margin-bottom: 2px;
  }

  .notif-item .notif-title.approved { color: #22c55e; }
  .notif-item .notif-title.rejected { color: #ef4444; }

  .notif-item .notif-time {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .notif-empty {
    padding: 24px 16px;
    text-align: center;
    color: var(--text-muted);
    font-size: 13px;
  }

  .notif-mark-read {
    display: block;
    width: 100%;
    padding: 10px;
    background: none;
    border: none;
    border-top: 1px solid var(--border);
    color: var(--accent2);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.2s;
  }

  .notif-mark-read:hover { background: var(--bg); }
`;
document.head.appendChild(style);

// Apply saved theme
const savedTheme = localStorage.getItem('radl-theme');
if (savedTheme === 'light') document.body.classList.add('light-mode');

function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem('radl-theme', isLight ? 'light' : 'dark');
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.textContent = isLight ? '🌙' : '☀️';
}

// Load notifications for a user
async function loadNotifications(uid) {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', uid)
    );
    const snap = await getDocs(q);
    const notifs = [];
    snap.forEach(d => notifs.push({ id: d.id, ...d.data() }));
    notifs.sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0));
    return notifs;
  } catch (e) {
    return [];
  }
}

onAuthStateChanged(auth, async (user) => {
  const nav = document.querySelector('nav');
  if (!nav) return;

  nav.innerHTML = '';

  // Static links
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

  // Theme toggle
  // Random level button
  const randomBtn = document.createElement('button');
  randomBtn.className = 'theme-toggle';
  randomBtn.textContent = '🎲';
  randomBtn.title = 'Random Level';
  randomBtn.addEventListener('click', async () => {
    randomBtn.textContent = '⏳';
    try {
      const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vT8piEYpPcelXSiPpyaakaU1phI-WJEKP475A_4-lKhtCRONRqopePPjra8wQyjyMWQIgZ79rH3mQUA/pub?gid=0&single=true&output=csv');
      const text = await res.text();
      const lines = text.trim().split('\n').slice(1).filter(l => l.trim());
      const randomLine = lines[Math.floor(Math.random() * lines.length)];
      const slug = randomLine.split(',')[2]?.replace(/"/g, '').trim();
      if (slug) window.location.href = `/level/${slug}`;
    } catch (e) {
      randomBtn.textContent = '🎲';
    }
  });
  nav.appendChild(randomBtn);
  const themeBtn = document.createElement('button');
  themeBtn.className = 'theme-toggle';
  themeBtn.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
  themeBtn.title = 'Toggle light/dark mode';
  themeBtn.addEventListener('click', toggleTheme);
  nav.appendChild(themeBtn);

  if (user) {
    let username = user.email.split('@')[0];
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        username = userDoc.data().username || username;
      }
    } catch (e) {}

    // Notifications bell
    const notifs = await loadNotifications(user.uid);
    const unread = notifs.filter(n => !n.read);

    const notifWrapper = document.createElement('div');
    notifWrapper.className = 'notif-wrapper';

    const notifBtn = document.createElement('button');
    notifBtn.className = 'notif-btn';
    notifBtn.innerHTML = '🔔';
    notifBtn.title = 'Notifications';

    if (unread.length > 0) {
      const badge = document.createElement('span');
      badge.className = 'notif-badge';
      badge.textContent = unread.length > 9 ? '9+' : unread.length;
      notifBtn.appendChild(badge);
    }

    const notifDropdown = document.createElement('div');
    notifDropdown.className = 'notif-dropdown';

    const notifHeader = document.createElement('div');
    notifHeader.className = 'notif-header';
    notifHeader.textContent = `Notifications ${unread.length > 0 ? `(${unread.length} new)` : ''}`;
    notifDropdown.appendChild(notifHeader);

    if (notifs.length === 0) {
      notifDropdown.innerHTML += '<div class="notif-empty">No notifications yet</div>';
    } else {
      notifs.slice(0, 5).forEach(n => {
        const item = document.createElement('div');
        item.className = `notif-item ${n.read ? '' : 'unread'}`;

        const statusClass = n.type === 'approved' ? 'approved' : 'rejected';
        const icon = n.type === 'approved' ? '✅' : '❌';
        const time = n.createdAt?.toDate ? n.createdAt.toDate().toLocaleDateString() : '';

        item.innerHTML = `
          <div class="notif-title ${statusClass}">${icon} Submission ${n.type}</div>
          <div>${n.levelName || 'Unknown level'}</div>
          ${n.notes ? `<div style="color:var(--text-muted);font-size:12px;">Admin: "${n.notes}"</div>` : ''}
          <div class="notif-time">${time}</div>
        `;
        notifDropdown.appendChild(item);
      });

      if (unread.length > 0) {
        const markRead = document.createElement('button');
        markRead.className = 'notif-mark-read';
        markRead.textContent = 'Mark all as read';
        markRead.addEventListener('click', async () => {
          try {
            const { updateDoc, doc: firestoreDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
            for (const n of unread) {
              await updateDoc(firestoreDoc(db, 'notifications', n.id), { read: true });
            }
            // Remove badge
            const badge = notifBtn.querySelector('.notif-badge');
            if (badge) badge.remove();
            notifHeader.textContent = 'Notifications';
            markRead.remove();
            notifDropdown.querySelectorAll('.notif-item').forEach(el => el.classList.remove('unread'));
          } catch (e) {
            console.error('Error marking notifications as read:', e);
          }
        });
        notifDropdown.appendChild(markRead);
      }
    }

    notifWrapper.appendChild(notifBtn);
    notifWrapper.appendChild(notifDropdown);
    nav.appendChild(notifWrapper);

    // Profile link
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
