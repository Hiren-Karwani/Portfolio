/* ============================================================
   HIREN KARWANI PORTFOLIO — MAIN JS
   Lenis Smooth Scroll + GSAP ScrollTrigger + Custom Cursor
   + Magnetic Buttons + Menu + Page Transitions
   ============================================================ */

'use strict';

/* ============================================================
   1. LENIS SMOOTH SCROLL
   ============================================================ */
let lenis;

function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Ensure GSAP ScrollTrigger syncs with Lenis
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
}

/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */

function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Lerp follower for smooth trailing
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Expand on hoverable elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .btn-cta, .btn-outline, .btn-download, .btn-dark, .btn-light, .menu-btn, .contact-card, .nav-link, input, textarea, .chip, .icon-link'
  );
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
      follower.classList.add('cursor--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
      follower.classList.remove('cursor--hover');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; follower.style.opacity = '1'; });
}

/* ============================================================
   3. MAGNETIC BUTTON EFFECT
   ============================================================ */

function initMagneticButtons() {
  const magnetics = document.querySelectorAll('.magnetic-btn');

  magnetics.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) * 0.35;
      const dy = (e.clientY - centerY) * 0.35;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      btn.style.transform = 'translate(0, 0)';
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.15s ease';
    });
  });
}

/* ============================================================
   4. HAMBURGER MENU
   ============================================================ */

function initMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('main-menu');
  const menuNav = document.querySelector('.menu-nav');
  const menuBranding = document.querySelector('.menu-branding');
  const navItems = document.querySelectorAll('.nav-item');

  if (!menuBtn) return;

  let showMenu = false;

  menuBtn.addEventListener('click', toggleMenu);
  menuBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') toggleMenu();
  });

  // Close menu when nav link is clicked
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (showMenu) {
        // Small delay so transition plays before navigation
        setTimeout(toggleMenu, 100);
      }
    });
  });

  function toggleMenu() {
    if (!showMenu) {
      menuBtn.classList.add('close');
      menu.classList.add('show');
      menuNav.classList.add('show');
      menuBranding.classList.add('show');
      navItems.forEach((item) => item.classList.add('show'));
      document.body.style.overflow = 'hidden';
      showMenu = true;
    } else {
      menuBtn.classList.remove('close');
      menu.classList.remove('show');
      menuNav.classList.remove('show');
      menuBranding.classList.remove('show');
      navItems.forEach((item) => item.classList.remove('show'));
      document.body.style.overflow = '';
      showMenu = false;
    }

    menuBtn.setAttribute('aria-expanded', showMenu.toString());
  }
}

/* ============================================================
   5. PAGE TRANSITION
   ============================================================ */

function initPageTransitions() {
  if (typeof gsap === 'undefined') return;

  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  // Animate out on load
  gsap.set(overlay, { scaleY: 1, transformOrigin: 'bottom' });
  gsap.to(overlay, {
    scaleY: 0,
    duration: 0.7,
    ease: 'power3.inOut',
    delay: 0.1,
    onComplete: () => { overlay.style.pointerEvents = 'none'; }
  });

  // Animate in on link click (internal pages only)
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || link.hasAttribute('download')) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.href;
      overlay.style.pointerEvents = 'all';
      gsap.set(overlay, { scaleY: 0, transformOrigin: 'top' });
      gsap.to(overlay, {
        scaleY: 1,
        duration: 0.55,
        ease: 'power3.inOut',
        onComplete: () => { window.location.href = target; }
      });
    });
  });
}

/* ============================================================
   6. GSAP SCROLL ANIMATIONS
   ============================================================ */

function initGSAP() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const defaults = { duration: 0.9, ease: 'power3.out' };

  // --- FADE UP (generic) ---
  gsap.utils.toArray('.gsap-fade-up').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: defaults.duration,
        ease: defaults.ease,
        delay: i * 0.08,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // --- TIMELINE ITEMS (stagger slide-in from left) ---
  gsap.utils.toArray('.gsap-timeline-item').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        delay: i * 0.06,
      }
    );
  });

  // --- PROJECT CARDS (stagger fade-up) ---
  gsap.utils.toArray('.gsap-project-card').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        delay: (i % 3) * 0.1,
      }
    );
  });

  // --- HOME PAGE: stagger hero content ---
  const homeContent = document.querySelector('.home-content');
  if (homeContent) {
    const children = homeContent.children;
    gsap.fromTo(children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.55,
      }
    );
    // Reset initial states so GSAP can control them
    Array.from(children).forEach(child => { child.style.opacity = ''; child.style.transform = ''; });
  }
}

/* ============================================================
   7. CONTACT FORM (mock submission)
   ============================================================ */

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successMsg = document.getElementById('form-success-msg');
  const submitBtn = document.getElementById('contact-submit-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name')?.value.trim();
    const email = document.getElementById('contact-email')?.value.trim();
    const message = document.getElementById('contact-message')?.value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }

    // Simulate submission
    if (submitBtn) {
      submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
        submitBtn.disabled = false;
      }
      if (successMsg) successMsg.style.display = 'block';
      form.reset();

      // Animate success message
      if (typeof gsap !== 'undefined' && successMsg) {
        gsap.fromTo(successMsg, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
      }
    }, 1500);
  });
}

/* ============================================================
   8. INIT ALL
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initCursor();
  initMagneticButtons();
  initMenu();
  initPageTransitions();
  initGSAP();
  initContactForm();
});
