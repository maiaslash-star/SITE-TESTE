/* ═══════════════════════════════════════════════════════
   CABO DEYVISON — main.js
   WebGL Particles · Scroll Cinema · Cursor Magic
═══════════════════════════════════════════════════════ */

'use strict';

const qs   = s => document.querySelector(s);
const qsa  = s => [...document.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* ═══ LOADER ═══ */
(function initLoader() {
  const loader = qs('#loader');
  const bar    = qs('#loaderBar');
  const numEl  = qs('#loaderNum');
  let progress = 0;

  const tick = () => {
    progress += Math.random() * 4 + 1;
    if (progress >= 100) {
      progress = 100;
      bar.style.width = '100%';
      numEl.textContent = '100';
      setTimeout(() => {
        loader.classList.add('done');
        document.body.classList.remove('loading');
        startApp();
      }, 500);
      return;
    }
    bar.style.width = progress + '%';
    numEl.textContent = Math.floor(progress);
    setTimeout(tick, 40 + Math.random() * 60);
  };
  tick();
})();

/* ═══ HERO CANVAS — Three.js Particle Field ═══ */
function initHeroCanvas() {
  const canvas = qs('#heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  const COUNT   = 1200;
  const geo     = new THREE.BufferGeometry();
  const pos     = new Float32Array(COUNT * 3);
  const speeds  = new Float32Array(COUNT);
  const offsets = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    pos[i*3]   = (Math.random() - 0.5) * 18;
    pos[i*3+1] = (Math.random() - 0.5) * 12;
    pos[i*3+2] = (Math.random() - 0.5) * 8;
    speeds[i]  = Math.random() * 0.3 + 0.1;
    offsets[i] = Math.random() * Math.PI * 2;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xf97316,
    size: 0.05,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  /* Glow sphere */
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.04 });
  const glow    = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), glowMat);
  glow.position.set(-3, 1, -2);
  scene.add(glow);

  /* Connection lines */
  const linePositions = [];
  for (let i = 0; i < 80; i++) {
    const a = Math.floor(Math.random() * COUNT);
    const b = Math.floor(Math.random() * COUNT);
    linePositions.push(pos[a*3], pos[a*3+1], pos[a*3+2]);
    linePositions.push(pos[b*3], pos[b*3+1], pos[b*3+2]);
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending });
  scene.add(new THREE.LineSegments(lineGeo, lineMat));

  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let camX = 0, camY = 0, t = 0;
  const posArr = geo.attributes.position.array;

  function animate() {
    requestAnimationFrame(animate);
    t += 0.005;

    for (let i = 0; i < COUNT; i++) {
      posArr[i*3+1] += speeds[i] * 0.005;
      posArr[i*3]   += Math.sin(t + offsets[i]) * 0.002;
      if (posArr[i*3+1] > 6) posArr[i*3+1] = -6;
    }
    geo.attributes.position.needsUpdate = true;

    camX = lerp(camX, mx * 0.4, 0.04);
    camY = lerp(camY, -my * 0.25, 0.04);
    camera.position.x = camX;
    camera.position.y = camY;

    particles.rotation.y = t * 0.03;
    glow.scale.setScalar(1 + Math.sin(t * 0.8) * 0.15);

    renderer.render(scene, camera);
  }
  animate();

  new ResizeObserver(() => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }).observe(canvas);
}

/* ═══ CTA CANVAS ═══ */
function initCtaCanvas() {
  const canvas = qs('#ctaCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 4;

  const COUNT = 400;
  const geo   = new THREE.BufferGeometry();
  const pos   = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i*3]   = (Math.random() - 0.5) * 12;
    pos[i*3+1] = (Math.random() - 0.5) * 8;
    pos[i*3+2] = (Math.random() - 0.5) * 4;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xf97316, size: 0.04,
    transparent: true, opacity: 0.4,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  scene.add(new THREE.Points(geo, mat));

  const p = geo.attributes.position.array;
  function animate() {
    requestAnimationFrame(animate);
    for (let i = 0; i < COUNT; i++) {
      p[i*3+1] += 0.004;
      if (p[i*3+1] > 4) p[i*3+1] = -4;
    }
    geo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  }
  animate();

  new ResizeObserver(() => {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }).observe(canvas);
}

/* ═══ CURSOR ═══ */
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  const dot  = qs('.cursor-dot');
  const ring = qs('.cursor-ring');
  if (!dot || !ring) return;

  let mx = -200, my = -200, rx = -200, ry = -200;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  qsa('a, button, .proposta-header, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  window.addEventListener('mousedown', () => document.body.classList.add('cursor-clicking'));
  window.addEventListener('mouseup',   () => document.body.classList.remove('cursor-clicking'));

  (function loop() {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    dot.style.cssText  = `left:${mx}px;top:${my}px`;
    ring.style.cssText = `left:${rx}px;top:${ry}px`;
    requestAnimationFrame(loop);
  })();
}

/* ═══ NAV ═══ */
function initNav() {
  const nav    = qs('#nav');
  const burger = qs('#navBurger');
  const menu   = qs('#mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  burger?.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  qsa('.mobile-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ═══ SCROLL REVEAL ═══ */
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  qsa('.reveal-up, .reveal-fade, .reveal-slide').forEach(el => obs.observe(el));
}

/* ═══ COUNTER ANIMATION ═══ */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.count);
      const dur = 1800;
      const t0  = performance.now();

      (function tick(now) {
        const p = clamp((now - t0) / dur, 0, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.floor(ease * end);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = end;
      })(performance.now());

      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  qsa('[data-count]').forEach(el => obs.observe(el));
}

/* ═══ PROPOSTAS ACCORDION ═══ */
function initPropostas() {
  qsa('.proposta-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.proposta-item');
      const wasOpen = item.classList.contains('open');

      // Close all
      qsa('.proposta-item.open').forEach(i => i.classList.remove('open'));

      // Toggle clicked
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ═══ SMOOTH ANCHOR SCROLL ═══ */
function initSmoothScroll() {
  qsa('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ═══ FORM ═══ */
function initForm() {
  const form = qs('#contatoForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('button[type="submit"]');
    const text = btn.querySelector('.btn-text');
    text.textContent = 'Enviado! ✓';
    btn.style.pointerEvents = 'none';
    btn.querySelector('.btn-bg').style.background = '#22c55e';
    setTimeout(() => {
      text.textContent = 'Quero que você venha!';
      btn.style.pointerEvents = '';
      btn.querySelector('.btn-bg').style.background = '';
      form.reset();
    }, 3000);
  });
}

/* ═══ PARALLAX HERO ═══ */
function initParallax() {
  const hero = qs('#hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const content = hero.querySelector('.hero-content');
    if (content) content.style.transform = `translateY(${y * 0.25}px)`;
  }, { passive: true });
}

/* ═══ ACTIVE NAV LINK ═══ */
function initActiveNav() {
  const sections = qsa('section[id]');
  const navLinks = qsa('.nav-link');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = qs(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
}

/* ═══ HOVER CARD TILT ═══ */
function initCardTilt() {
  qsa('.caso-card, .metric-card, .dash-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => card.style.transition = '', 500);
    });
  });
}

/* ═══ START ═══ */
function startApp() {
  initHeroCanvas();
  initCtaCanvas();
  initCursor();
  initNav();
  initScrollReveal();
  initCounters();
  initPropostas();
  initSmoothScroll();
  initForm();
  initParallax();
  initActiveNav();
  initCardTilt();

  /* Open first proposta by default */
  const first = qs('.proposta-item');
  if (first) first.classList.add('open');
}
