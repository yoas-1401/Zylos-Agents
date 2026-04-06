// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateIcon(next);
});
function updateIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

// ===== MAGNETIC NAV HIGHLIGHT =====
const navHighlight = document.getElementById('navHighlight');
const navPillWrap  = document.getElementById('navPillWrap');
const navItems     = document.querySelectorAll('.nav-item');

function moveHighlight(el) {
  if (!navHighlight || !navPillWrap) return;
  const wrapRect = navPillWrap.getBoundingClientRect();
  const elRect   = el.getBoundingClientRect();
  navHighlight.style.opacity = '1';
  navHighlight.style.left    = (elRect.left - wrapRect.left - 6) + 'px';
  navHighlight.style.width   = elRect.width + 'px';
}
function resetHighlight() {
  const active = document.querySelector('.nav-item.active');
  if (active) moveHighlight(active);
  else if (navHighlight) navHighlight.style.opacity = '0';
}

navItems.forEach(item => {
  item.addEventListener('mouseenter', () => moveHighlight(item));
  item.addEventListener('mouseleave', resetHighlight);
});

// init on load
window.addEventListener('load', resetHighlight);

// ===== ACTIVE SECTION TRACKING =====
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.drawer-item').forEach(i => i.classList.remove('active'));

      const id = entry.target.id;
      const active = document.querySelector('.nav-item[href="#' + id + '"]');
      const drawerActive = document.querySelector('.drawer-item[href="#' + id + '"]');
      if (active)  { active.classList.add('active');  moveHighlight(active); }
      if (drawerActive) drawerActive.classList.add('active');
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => sectionObserver.observe(s));

// ===== NAVBAR SCROLL SHRINK =====
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== MOBILE DRAWER =====
const hamburger  = document.getElementById('hamburger');
const navDrawer  = document.getElementById('navDrawer');
const navOverlay = document.getElementById('navOverlay');
const drawerClose = document.getElementById('drawerClose');

function openDrawer() {
  navDrawer.classList.add('open');
  navOverlay.classList.add('open');
  hamburger.classList.add('open');
}
function closeDrawer() {
  navDrawer.classList.remove('open');
  navOverlay.classList.remove('open');
  hamburger.classList.remove('open');
}

hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  navDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
});
if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
if (navOverlay)  navOverlay.addEventListener('click', closeDrawer);
document.querySelectorAll('.drawer-item').forEach(a => a.addEventListener('click', closeDrawer));

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll(
  '.service-card, .stat-item, .tip-card, .chart-container, ' +
  '.about-text, .about-img, .contact-info, .contact-form, ' +
  '.work-card, .pricing-card'
);
reveals.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const step   = target / (1800 / 16);
  let current  = 0;
  const timer  = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target; clearInterval(timer); }
    else el.textContent = Math.floor(current);
  }, 16);
}

// ===== DONUT CHART =====
const donutSegs = document.querySelectorAll('.donut-seg');
const donutObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      donutSegs.forEach(seg => seg.classList.add('animated'));
      donutObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
const donutSection = document.querySelector('.donut-section');
if (donutSection) donutObserver.observe(donutSection);

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Message Sent!';
  btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  setTimeout(() => {
    btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
    btn.style.background = '';
    form.reset();
  }, 3000);
});

// ===== ADMIN PANEL =====
const ADMIN_PASSWORD = 'zylos2026'; // change this after publishing

const adminFab     = document.getElementById('adminFab');
const adminOverlay = document.getElementById('adminOverlay');
const adminPanel   = document.getElementById('adminPanel');
const adminClose   = document.getElementById('adminClose');
const adminLogin   = document.getElementById('adminLogin');
const adminDash    = document.getElementById('adminDash');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminError   = document.getElementById('adminError');
const adminSavedEl = document.getElementById('adminSaved');
const announceBar  = document.getElementById('announceBar');

// DB — localStorage as the persistent store
const DB_KEY = 'zylos_db';
function dbGet() {
  try { return JSON.parse(localStorage.getItem(DB_KEY)) || {}; } catch { return {}; }
}
function dbSet(data) { localStorage.setItem(DB_KEY, JSON.stringify(data)); }

// open / close panel
function openAdmin() {
  adminOverlay.classList.add('open');
  adminPanel.classList.add('open');
}
function closeAdmin() {
  adminOverlay.classList.remove('open');
  adminPanel.classList.remove('open');
}
adminFab.addEventListener('click', openAdmin);
adminOverlay.addEventListener('click', openAdmin);
adminClose.addEventListener('click', closeAdmin);
adminOverlay.addEventListener('click', closeAdmin);

// login
adminLoginBtn.addEventListener('click', () => {
  const val = document.getElementById('adminPass').value;
  if (val === ADMIN_PASSWORD) {
    adminLogin.style.display = 'none';
    adminDash.style.display  = 'flex';
    adminError.textContent   = '';
    loadAdminData();
  } else {
    adminError.textContent = 'Incorrect password. Try again.';
    document.getElementById('adminPass').value = '';
  }
});
document.getElementById('adminPass').addEventListener('keydown', e => {
  if (e.key === 'Enter') adminLoginBtn.click();
});

// tabs
document.querySelectorAll('.atab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.atab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.atab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// load saved data into fields
function loadAdminData() {
  const db = dbGet();

  // stats
  if (db.stats) {
    document.getElementById('db-reach').value        = db.stats.reach        || '';
    document.getElementById('db-followers').value    = db.stats.followers    || '';
    document.getElementById('db-satisfaction').value = db.stats.satisfaction || '';
    document.getElementById('db-campaigns').value    = db.stats.campaigns    || '';
  }

  // social
  if (db.social) {
    document.getElementById('db-telegram').value  = db.social.telegram  || '';
    document.getElementById('db-tiktok').value    = db.social.tiktok    || '';
    document.getElementById('db-instagram').value = db.social.instagram || '';
    document.getElementById('db-facebook').value  = db.social.facebook  || '';
    document.getElementById('db-youtube').value   = db.social.youtube   || '';
    document.getElementById('db-xtwitter').value  = db.social.xtwitter  || '';
    document.getElementById('db-meta').value      = db.social.meta      || '';
  }

  // announcement
  if (db.announce) {
    document.getElementById('db-announce-msg').value   = db.announce.msg   || '';
    document.getElementById('db-announce-color').value = db.announce.color || '#7c3aed';
    document.getElementById('db-announce-show').checked = !!db.announce.show;
  }

  // services list
  renderServicesList(db.services || []);

  // pricing list
  renderPricingList(db.pricing || []);
}

// save handler
window.adminSave = function(section) {
  const db = dbGet();

  if (section === 'stats') {
    db.stats = {
      reach:        document.getElementById('db-reach').value,
      followers:    document.getElementById('db-followers').value,
      satisfaction: document.getElementById('db-satisfaction').value,
      campaigns:    document.getElementById('db-campaigns').value,
    };
    // apply live to page
    const nums = document.querySelectorAll('.stat-num');
    const keys = ['reach','followers','satisfaction','campaigns'];
    nums.forEach((el, i) => {
      if (db.stats[keys[i]]) el.dataset.target = db.stats[keys[i]];
    });
  }

  if (section === 'social') {
    db.social = {
      telegram:  document.getElementById('db-telegram').value,
      tiktok:    document.getElementById('db-tiktok').value,
      instagram: document.getElementById('db-instagram').value,
      facebook:  document.getElementById('db-facebook').value,
      youtube:   document.getElementById('db-youtube').value,
      xtwitter:  document.getElementById('db-xtwitter').value,
    };
    // apply live using IDs for speed
    const idMap = {
      telegram:  ['link-telegram', 'ft-telegram'],
      tiktok:    ['link-tiktok',   'ft-tiktok'],
      instagram: ['link-instagram','ft-instagram'],
      facebook:  ['link-facebook', 'ft-facebook'],
      youtube:   ['link-youtube',  'ft-youtube'],
      xtwitter:  ['link-xtwitter', 'ft-xtwitter'],
    };
    Object.entries(db.social).forEach(([key, url]) => {
      if (!url) return;
      idMap[key].forEach(id => { const el = document.getElementById(id); if (el) el.href = url; });
    });
  }

  if (section === 'announce') {
    db.announce = {
      msg:   document.getElementById('db-announce-msg').value,
      color: document.getElementById('db-announce-color').value,
      show:  document.getElementById('db-announce-show').checked,
    };
    applyAnnouncement(db.announce);
  }

  dbSet(db);
  showSaved();
};

// add service
window.adminAddService = function() {
  const title = document.getElementById('new-service-title').value.trim();
  const desc  = document.getElementById('new-service-desc').value.trim();
  const icon  = document.getElementById('new-service-icon').value.trim() || 'fa-star';
  if (!title) return;
  const db = dbGet();
  db.services = db.services || [];
  db.services.push({ title, desc, icon });
  dbSet(db);
  renderServicesList(db.services);
  document.getElementById('new-service-title').value = '';
  document.getElementById('new-service-desc').value  = '';
  document.getElementById('new-service-icon').value  = '';
  showSaved();
};

function renderServicesList(services) {
  const el = document.getElementById('services-list');
  el.innerHTML = services.length
    ? services.map((s, i) =>
        `<div class="admin-list-item">
          <span><i class="fas ${s.icon}" style="color:var(--accent2);margin-right:0.5rem"></i>${s.title}</span>
          <button onclick="adminDeleteService(${i})">Remove</button>
        </div>`
      ).join('')
    : '<p style="color:var(--text2);font-size:0.85rem">No custom services yet.</p>';
}

window.adminDeleteService = function(i) {
  const db = dbGet();
  db.services.splice(i, 1);
  dbSet(db);
  renderServicesList(db.services);
};

function renderPricingList(pricing) {
  const plans = ['Starter – $199/mo', 'Growth – $499/mo', 'Pro – $999/mo', 'Custom – Let\'s Talk'];
  const el = document.getElementById('pricing-list');
  el.innerHTML = plans.map((p, i) => {
    const saved = pricing[i] || {};
    return `<div class="admin-list-item">
      <span>${p}</span>
      <input type="text" value="${saved.price || ''}" placeholder="Override price"
        style="width:120px;padding:0.3rem 0.6rem;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:0.8rem"
        onchange="adminUpdatePrice(${i}, this.value)"/>
    </div>`;
  }).join('');
}

window.adminUpdatePrice = function(i, val) {
  const db = dbGet();
  db.pricing = db.pricing || [];
  db.pricing[i] = { price: val };
  dbSet(db);
  // apply live to page
  const amounts = document.querySelectorAll('.price-amount');
  if (amounts[i] && val) amounts[i].textContent = val;
  showSaved();
};

// announcement banner
function applyAnnouncement(cfg) {
  if (!cfg || !cfg.show || !cfg.msg) {
    announceBar.style.display = 'none';
    document.body.style.paddingTop = '';
    return;
  }
  announceBar.innerHTML = `<span>${cfg.msg}</span>
    <button onclick="dismissAnnounce()" aria-label="Dismiss">✕</button>`;
  announceBar.style.background = cfg.color || '#7c3aed';
  announceBar.style.display = 'flex';
  document.body.style.paddingTop = announceBar.offsetHeight + 'px';
}
window.dismissAnnounce = function() {
  announceBar.style.display = 'none';
  document.body.style.paddingTop = '';
};

function showSaved() {
  adminSavedEl.classList.add('show');
  setTimeout(() => adminSavedEl.classList.remove('show'), 2500);
}

// apply saved data on page load
(function applyOnLoad() {
  const db = dbGet();
  if (db.social) {
    const idMap = {
      telegram:  ['link-telegram', 'ft-telegram'],
      tiktok:    ['link-tiktok',   'ft-tiktok'],
      instagram: ['link-instagram','ft-instagram'],
      facebook:  ['link-facebook', 'ft-facebook'],
      youtube:   ['link-youtube',  'ft-youtube'],
      xtwitter:  ['link-xtwitter', 'ft-xtwitter'],
    };
    Object.entries(db.social).forEach(([key, url]) => {
      if (!url) return;
      idMap[key].forEach(id => { const el = document.getElementById(id); if (el) el.href = url; });
    });
  }
  if (db.stats) {
    const keys = ['reach','followers','satisfaction','campaigns'];
    document.querySelectorAll('.stat-num').forEach((el, i) => {
      if (db.stats[keys[i]]) el.dataset.target = db.stats[keys[i]];
    });
  }
  if (db.pricing) {
    const amounts = document.querySelectorAll('.price-amount');
    db.pricing.forEach((p, i) => { if (p && p.price && amounts[i]) amounts[i].textContent = p.price; });
  }
  if (db.announce) applyAnnouncement(db.announce);
})();
