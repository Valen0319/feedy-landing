import { LOGO_URL } from './config/gallery-manifest.js';
import { initGallery } from './gallery.js';
import { initViewer } from './viewer.js';
import { initHeroVideo } from './hero-video.js';

const $ = (s, r = document) => r.querySelector(s);

// Logo: si falta el archivo, se muestra el texto "Feedy".
const probe = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(true); i.onerror = () => ok(false); i.src = src; });
probe(LOGO_URL).then((found) => {
  document.querySelectorAll('[data-logo]').forEach((img) => {
    const text = img.parentElement.querySelector('.brand-text');
    if (found) { img.src = LOGO_URL; } else { img.remove(); if (text) text.hidden = false; }
  });
});

// Menú responsive
const burger = $('.burger'), nav = $('#nav');
const setMenu = (open) => { nav.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); };
burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', (e) => e.target.closest('a') && setMenu(false));
document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

// Animaciones de entrada
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

$('#year').textContent = new Date().getFullYear();
initHeroVideo();
initGallery();
initViewer();

document.querySelectorAll('[data-team-photo]').forEach((img) => {
  const fallback = () => {
    const avatar = document.createElement('span');
    avatar.className = 'team-avatar';
    avatar.setAttribute('aria-label', img.alt);
    avatar.textContent = img.dataset.teamPhoto;
    img.replaceWith(avatar);
  };
  img.addEventListener('error', fallback, { once: true });
  if (img.complete && img.naturalWidth === 0) fallback();
});
