document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar scroll effect ───
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ─── Mobile menu ───
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggle.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('active');
    });
  });

  // ─── Active nav link on scroll ───
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const observerNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => observerNav.observe(s));

  // ─── Scroll reveal ───
  const reveals = document.querySelectorAll('.reveal');
  const observerReveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observerReveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => observerReveal.observe(el));

  // ─── Gallery filter ───
  const filters = document.querySelectorAll('.gallery-filter');
  const items = document.querySelectorAll('.gallery-item');
  filters.forEach(f => {
    f.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      f.classList.add('active');
      const cat = f.dataset.filter;
      items.forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
          item.style.display = '';
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ─── Lightbox ───
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  let currentImages = [];
  let currentIdx = 0;

  function openLightbox(src) {
    currentImages = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"]) img'));
    currentIdx = currentImages.findIndex(i => i.src === src);
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  function navigateLightbox(dir) {
    currentIdx = (currentIdx + dir + currentImages.length) % currentImages.length;
    lightboxImg.src = currentImages[currentIdx].src;
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      openLightbox(img.src);
    });
  });
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigateLightbox(-1));
  nextBtn.addEventListener('click', () => navigateLightbox(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // ─── Counter animation ───
  const counters = document.querySelectorAll('.counter');
  const observerCounter = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();
        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(target * ease) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        observerCounter.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observerCounter.observe(c));

  // ─── Smooth scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
