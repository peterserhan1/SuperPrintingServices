document.addEventListener('DOMContentLoaded', () => {

  /* ── Nav scroll ── */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 60);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ── */
  const tog = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  const backdrop = document.querySelector('.nav-backdrop');

  function toggleMenu(open) {
    const isOpen = typeof open === 'boolean' ? open : !menu.classList.contains('open');
    menu.classList.toggle('open', isOpen);
    tog.classList.toggle('active', isOpen);
    backdrop.classList.toggle('show', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  tog.addEventListener('click', () => toggleMenu());
  backdrop.addEventListener('click', () => toggleMenu(false));
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => toggleMenu(false))
  );

  /* ── Hero slideshow ── */
  const slides = document.querySelectorAll('.hero-slides img');
  let cur = 0;
  if (slides.length) {
    slides[0].classList.add('active');
    setInterval(() => {
      slides[cur].classList.remove('active');
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add('active');
    }, 5000);
  }

  /* ── Scroll reveal ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ── Portfolio filter ── */
  const tabs = document.querySelectorAll('.pf-tab');
  const items = document.querySelectorAll('.pf-item');
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('on'));
      t.classList.add('on');
      const cat = t.dataset.cat;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  /* ── Lightbox ── */
  const lb = document.querySelector('.lb');
  const lbImg = lb.querySelector('img');
  let lbList = [], lbIdx = 0;

  function lbOpen(src) {
    lbList = [...document.querySelectorAll('.pf-item:not([style*="display: none"]) img')];
    lbIdx = lbList.findIndex(i => i.src === src);
    lbImg.src = src;
    lb.classList.add('on');
    document.body.style.overflow = 'hidden';
  }
  function lbClose() { lb.classList.remove('on'); document.body.style.overflow = ''; }
  function lbNav(d) { lbIdx = (lbIdx + d + lbList.length) % lbList.length; lbImg.src = lbList[lbIdx].src; }

  items.forEach(item => item.addEventListener('click', () => lbOpen(item.querySelector('img').src)));
  lb.querySelector('.lb-x').addEventListener('click', lbClose);
  lb.querySelector('.lb-prev').addEventListener('click', () => lbNav(-1));
  lb.querySelector('.lb-next').addEventListener('click', () => lbNav(1));
  lb.addEventListener('click', e => { if (e.target === lb) lbClose(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') lbClose();
    if (e.key === 'ArrowLeft') lbNav(-1);
    if (e.key === 'ArrowRight') lbNav(1);
  });

  /* ── Counter animation ── */
  const counters = document.querySelectorAll('.counter');
  const cio = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.to;
      const suffix = el.dataset.suffix || '';
      const dur = 2200;
      const t0 = performance.now();
      (function step(now) {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(t0);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cio.observe(c));

  /* ── Smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const h = a.getAttribute('href');
      if (h === '#') return;
      e.preventDefault();
      const t = document.querySelector(h);
      if (t) window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - nav.offsetHeight - 16, behavior: 'smooth' });
    });
  });

});
