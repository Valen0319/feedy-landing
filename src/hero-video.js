import { HERO_VIDEO } from './config/gallery-manifest.js';

// Video de fondo en bucle. Si falta el archivo, falla la reproducción
// o el usuario prefiere menos movimiento, se mantiene el hero con foto.
export function initHeroVideo() {
  const hero = document.querySelector('.hero'), video = hero.querySelector('.hero-video');
  const off = () => { video.pause(); video.remove(); hero.classList.remove('has-video'); };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !HERO_VIDEO.mp4) return off();

  [['webm', 'video/webm'], ['mp4', 'video/mp4']].forEach(([k, type]) => {
    if (!HERO_VIDEO[k]) return;
    const s = document.createElement('source'); s.src = HERO_VIDEO[k]; s.type = type; video.append(s);
  });
  video.querySelector('source:last-child').addEventListener('error', off);
  video.addEventListener('error', off);
  video.addEventListener('loadeddata', () => { hero.classList.add('has-video'); video.play().catch(off); }, { once: true });
  video.load();

  // Ahorra batería: pausa si el hero no se ve o la pestaña está en segundo plano.
  let inView = true;
  const sync = () => { if (video.isConnected) (inView && !document.hidden) ? video.play().catch(() => {}) : video.pause(); };
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }).observe(hero);
  document.addEventListener('visibilitychange', sync);
}
