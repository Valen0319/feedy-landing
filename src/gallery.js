import { PHOTOS, CATEGORIES, HERO_SRC } from './config/gallery-manifest.js';

const $ = (s) => document.querySelector(s);
const probe = (it) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(it); i.onerror = () => ok(null); i.src = it.src; });

function shot(it, idx, open) {
  const b = document.createElement('button');
  b.className = 'shot'; b.type = 'button'; b.dataset.cat = it.category;
  b.setAttribute('aria-label', `Ampliar: ${it.title}`);
  const img = document.createElement('img');
  img.src = it.src; img.alt = `${it.title}. ${it.description || ''}`.trim(); img.loading = 'lazy'; img.decoding = 'async';
  const cap = document.createElement('span'); cap.textContent = it.title;
  b.append(img, cap);
  b.addEventListener('click', () => open(idx));
  return b;
}

export async function initGallery() {
  // Solo se muestran las fotos que existen realmente (nunca imágenes rotas).
  const valid = (await Promise.all(PHOTOS.map(probe))).filter(Boolean);
  const dev = valid.filter((p) => p.category !== 'producto');
  const prod = valid.filter((p) => p.category === 'producto');

  // Lightbox
  const dlg = $('#lightbox'), lbImg = dlg.querySelector('img'), lbCap = dlg.querySelector('figcaption');
  let list = [], cur = 0;
  const show = (i) => { cur = (i + list.length) % list.length; const p = list[cur]; lbImg.src = p.src; lbImg.alt = p.title; lbCap.textContent = `${p.title}${p.description ? ' — ' + p.description : ''}`; };
  const open = (arr) => (i) => { list = arr; show(i); dlg.showModal(); };
  dlg.querySelector('.lb-close').onclick = () => dlg.close();
  dlg.querySelector('.prev').onclick = () => show(cur - 1);
  dlg.querySelector('.next').onclick = () => show(cur + 1);
  dlg.addEventListener('click', (e) => e.target === dlg && dlg.close());
  dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });

  // Galería con filtros
  const grid = $('#gallery'), filters = $('#filters');
  const render = (cat) => {
    const shown = cat === 'all' ? dev : dev.filter((p) => p.category === cat);
    grid.replaceChildren(...shown.map((p, i) => shot(p, i, open(shown))));
    filters.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.cat === cat));
  };
  if (!dev.length) { $('#gallery-empty').hidden = false; filters.hidden = true; }
  else {
    const cats = ['all', ...Object.keys(CATEGORIES).filter((c) => c !== 'producto' && dev.some((p) => p.category === c))];
    filters.replaceChildren(...cats.map((c) => { const b = document.createElement('button'); b.type = 'button'; b.dataset.cat = c; b.textContent = c === 'all' ? 'Todo' : CATEGORIES[c]; b.onclick = () => render(c); return b; }));
    render('all');
  }

  // Producto terminado + foto del hero (visible cuando no hay video)
  if (!prod.length) $('#product-empty').hidden = false;
  else $('#product-grid').replaceChildren(...prod.map((p, i) => shot(p, i, open(prod))));

  const heroSrc = HERO_SRC ? await probe({ src: HERO_SRC }) : prod[0];
  if (heroSrc) {
    const img = document.createElement('img');
    img.src = heroSrc.src; img.alt = 'Feedy, alimentador automático de mascotas';
    $('#hero-photo').replaceChildren(img);
  }
}
