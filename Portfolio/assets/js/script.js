// =========================================
// Loader — Animated Progress Bar + Percentage Counter
// =========================================
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const pctEl = loader.querySelector('.loader-pct');
  const fillEl = loader.querySelector('.loader-bar-fill');
  if (!pctEl || !fillEl) {
    // fallback: simply hide after 2s
    setTimeout(() => loader.classList.add('hide'), 2000);
    return;
  }

  const duration = 2200; // ms for 0→100
  const fps = 60;
  const totalFrames = Math.round((duration / 1000) * fps);
  const increment = 100 / totalFrames;
  let current = 0;
  let frame = 0;

  function animate() {
    frame++;
    current = Math.min(current + increment, 100);
    pctEl.textContent = Math.round(current) + '%';
    fillEl.style.width = current + '%';

    if (current < 100) {
      requestAnimationFrame(animate);
    } else {
      // Hold at 100% briefly, then hide
      setTimeout(() => loader.classList.add('hide'), 400);
    }
  }

  // Start animation after a tiny delay for layout settle
  setTimeout(() => requestAnimationFrame(animate), 120);
});

// =========================================
// Navbar — scroll state + mobile menu + active link
// =========================================
const nav = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 30);
  const btt = document.querySelector('.to-top');
  if (btt) btt.classList.toggle('show', window.scrollY > 400);
});

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open'); navLinks.classList.remove('open');
  }));
}

// Highlight active page link
(function () {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path) a.classList.add('active');
  });
})();

// =========================================
// Mouse Glow + Parallax
// =========================================
const glow = document.getElementById('mouse-glow');
document.addEventListener('mousemove', (e) => {
  if (glow) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }
  const portrait = document.querySelector('.portrait-card');
  if (portrait) {
    const rect = portrait.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / rect.height) * -10;
    const ry = ((e.clientX - cx) / rect.width) * 10;
    portrait.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  }
});

// =========================================
// Typing Animation
// =========================================
(function () {
  const el = document.querySelector('.typed');
  if (!el) return;
  const words = (el.dataset.words || 'Full Stack Developer').split('|');
  let wi = 0, ci = 0, deleting = false;
  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, --ci) : word.slice(0, ++ci);
    let delay = deleting ? 55 : 110;
    if (!deleting && ci === word.length) { delay = 1400; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
    setTimeout(tick, delay);
  }
  tick();
})();

// =========================================
// Scroll Reveal (IntersectionObserver)
// =========================================
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Progress bars
      e.target.querySelectorAll('.progress-fill').forEach(bar => {
        const v = bar.getAttribute('data-value') || '80';
        bar.style.width = v + '%';
      });
      // Counters
      e.target.querySelectorAll('[data-count]').forEach(num => {
        const target = +num.getAttribute('data-count');
        const dur = 1500; const start = performance.now();
        function step(t) {
          const p = Math.min((t - start) / dur, 1);
          num.textContent = Math.floor(target * (0.2 + 0.8 * p * (2 - p))) + '+';
          if (p < 1) requestAnimationFrame(step); else num.textContent = target + '+';
        }
        requestAnimationFrame(step);
      });
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// =========================================
// Contact form (client-side only demo)
// =========================================
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('formMsg');
    if (msg) { msg.textContent = 'Thanks! Your message has been received.'; msg.style.color = '#22d3ee'; }
    form.reset();
  });
}

// =========================================
// Back to top
// =========================================
const btt = document.querySelector('.to-top');
if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// =========================================
// Particles (Canvas)
// =========================================
(function () {
  const c = document.getElementById('particles');
  if (!c) return;
  const ctx = c.getContext('2d');
  let w, h, particles;
  function resize() { w = c.width = innerWidth; h = c.height = innerHeight; }
  function init() {
    particles = Array.from({ length: Math.min(80, Math.floor(w * h / 20000)) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
      r: Math.random() * 1.6 + .4,
    }));
  }
  function loop() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180,180,255,.55)'; ctx.fill();
    }
    // Lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.strokeStyle = `rgba(139,92,246,${(1 - d / 120) * .25})`;
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  resize(); init(); loop();
  window.addEventListener('resize', () => { resize(); init(); });
})();


const phoneNum = "923287004634"; // Actual WhatsApp Number

        const toggleBtn = document.getElementById('waToggleBtn');
        const closeBtn = document.getElementById('waCloseBtn');
        const chatBox = document.getElementById('waChatBox');
        const timeElement = document.getElementById('waCurrentTime');

        // Automatic System Time Update
        function updateTime() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}`;
        }
        updateTime();

        // Toggle Popup Display
        toggleBtn.addEventListener('click', () => {
            if (chatBox.classList.contains('show')) {
                chatBox.classList.remove('show');
                setTimeout(() => chatBox.style.display = 'none', 300);
            } else {
                chatBox.style.display = 'block';
                setTimeout(() => chatBox.classList.add('show'), 10);
            }
        });

        // Close Button Logic
        closeBtn.addEventListener('click', () => {
            chatBox.classList.remove('show');
            setTimeout(() => chatBox.style.display = 'none', 300);
        });

        // WhatsApp Redirect Function
        function sendToWhatsApp() {
            const inputField = document.getElementById('waUserInput');
            const userText = inputField.value.trim();
            
            // Text empty hone par default message send hoga
            const textToSend = userText ? encodeURIComponent(userText) : encodeURIComponent("Hi, I want to inquire about your services!");
            
            const whatsappURL = `https://wa.me/${phoneNum}?text=${textToSend}`;
            window.open(whatsappURL, '_blank');
        }

        // Send message on 'Enter' key
        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendToWhatsApp();
            }
        }